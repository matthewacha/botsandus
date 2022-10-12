/* eslint-disable react/jsx-no-bind */
import { MouseEvent, useCallback, useContext, useEffect, useRef, TouchEvent } from 'react';
import { StaticImageData } from 'next/image';

import { StreamContext } from '../../lib/context';
import {  getPoseStream, PosePayload, useStream } from '../../lib/stream';
import { useSetDimensions } from '../../lib/utils';

import styles from '../robotstatusbar/RobotStatus.module.css';

type Props = {
  id?: string;
  floorMap: StaticImageData;
  pixelRatio: number;
};

const WarehouseMapCanvas = ({ id, floorMap, pixelRatio = 10 }: Props) => {
  const canvasBackgroundRef = useRef<ImageData>();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mousePositionRef = useRef<{ x: number; y: number; angle: number }>();
  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const { canvasHeight, canvasWidth, mapperRatio } = useSetDimensions(floorMap, canvasWrapRef.current?.clientHeight);
  const streamContext = useContext(StreamContext);

  useEffect(() => {
    /**
     * This useEffect paints the map onto the canvas on component load
     */
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');

    // check that canvaswidth and canvasheight are not '0' otherwise context.drawImage() will throw error
    if (context && canvasWidth && canvasHeight) {
      //   draw warehouse floor map
      const imag = new Image();
      imag.src = floorMap.src;
      imag.onload = () => {
        // draw background image
        context.drawImage(imag, 0, 0, canvasWidth, canvasHeight);
        // save current canvas state to be used after clearing canvas
        canvasBackgroundRef.current = context.getImageData(0, 0, canvasWidth, canvasHeight);
      };
    }
  }, [canvasHeight, canvasWidth, floorMap]);

  /**
   * update robot pose on canvas
   * @param { x, y, angle } payload coordinates of robot pose
   */
  const updateRobotPoseOnCanvas = ({ x, y, angle}: PosePayload) => {
    // get canvas context from ref
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    // cache the payload to a mouseposition ref to be used in mouse events
    mousePositionRef.current = { x, y, angle };
    if(context){
      // clear canvas
      context.clearRect(0, 0, context.canvas.width, context.canvas.height);
      // update canvas with saved floor map: SEE useEffect that paints map to canvas
      if(canvasBackgroundRef.current) context.putImageData(canvasBackgroundRef.current, 0, 0);

      /**
        * DRAW ROBOT POSE TO CANVAS
        * pixelRatio = (ratio of meters to pixels: 1p = 0.1m) = 10
        * mapperRatio = (ratio of floor map dimension to corresponding canvas dimension)
        * position on X-axis - x * pixelRatio * mapperRatio
        * position on y axis - canvasHeight - (pixelRatio * y * mapperRatio)
      */
      const xAxis = x * pixelRatio * mapperRatio;
      const yAxis = canvasHeight - (pixelRatio * y * mapperRatio);
      drawRobot(context, 30* mapperRatio, 10* mapperRatio, '#fb6028', xAxis, yAxis, angle);

      // Just for fun,  uncomment the line below to see two robots in action :)
    //   drawRobot(context, 10, 10, '#fb6028', (canvasHeight - (pixelRatio * y * mapperRatio)), x * pixelRatio * mapperRatio*0.2, angle);
    }
  };

  const { stream: poseStream } = useStream(getPoseStream, updateRobotPoseOnCanvas);

  const postPose = useCallback((newPose: PosePayload) => poseStream?.send({ ...newPose }), [poseStream]);

  /**
   * Draw robot on canvas
   * @param ctx canvas context
   * @param rwidth robot width
   * @param rheight robot height
   * @param color robot color
   * @param x X axis pose value
   * @param y Y axis pose value
   * @param angle angle in radians
   */
  const drawRobot = (
    ctx: CanvasRenderingContext2D,
    rwidth: number,
    rheight: number,
    color: string,
    x: number,
    y: number,
    angle = 0
  ) => {

    ctx.fillStyle = color;
    ctx.save();

    ctx.translate(x, y);
    ctx.rotate(angle-(Math.PI/2)); // correct rotation angle relative to canvas
    ctx.fillStyle = color;
    // generate main body
    ctx.fillRect(rwidth / -2, rheight / -2, rwidth, rheight);
    // fill and generate head (black dot)
    ctx.fillStyle = '#000000';
    ctx.translate(7,-1);
    ctx.fillRect(0,0,4* mapperRatio,4* mapperRatio); // multiply by mapperRatio so that its seize is always the same relative to map size/screen

    ctx.restore();
  };

  /**
   * Get mouse position on canvas hover
   * @param event mouse event
   * @returns
   */
  const getMousePosition = (event: MouseEvent | MouseEventInit ) => {
    dispatchHelper(event.clientX, event.clientY );
  };

  /**
   * Capture mouse position on the canvas on click
   * and post to update robot pose
   * @returns
   */
  const captureMousePosition = () => {
    const state = streamContext?.state;
    if(!state) return;
    postPose({ ...state });
  };
  /**
   * On touch devices, since hover cannot work,
   *pose ordinates are updated on touch
   * @param event touch event
   * @returns
   */
  const captureTouchPosition = (event: TouchEvent<HTMLCanvasElement>) => {
    const payload = dispatchHelper(event.touches[0].clientX, event.touches[0].clientY );
    if(payload) postPose({ ...payload });
  };

  const dispatchHelper = (clientX?: number, clientY?: number) => {
    const canvas = canvasRef.current;
    const recentRobotPose = mousePositionRef.current;
    const rect = canvas?.getBoundingClientRect();
    const dispatch = streamContext?.dispatch;
    if(!dispatch) return;
    if(rect && clientX && clientY){
      const payload = {
        x: (clientX - rect.left)/(pixelRatio * mapperRatio),
        y: (canvasHeight - (clientY - rect.top)) / (pixelRatio * mapperRatio),
        angle: recentRobotPose?.angle || 0
      };
      dispatch({ type: 'GET_MOUSE_POSITION', payload });
      return payload;
    }
  };

  /**
   * onMouseLeave event, the mouse position will reset to the cached value 'mousePositionRef.current'
   * @returns
   */
  const onMouseLeave = () => {
    const recentRobotPose = mousePositionRef.current;
    const dispatch = streamContext?.dispatch;
    if(!dispatch || !recentRobotPose) return;
    dispatch({ type: 'SET_MOUSE_POSITION', payload: { ...recentRobotPose } });
  };

  return <div ref={ canvasWrapRef } className={ styles.canvasWrapper }>
    <canvas
      id={ id }
      className={ styles.canvas }
      ref={ canvasRef }
      onTouchStart={ captureTouchPosition }
      onMouseDown={ captureMousePosition }
      onMouseMove={ getMousePosition }
      onMouseLeave={ onMouseLeave }
      width={ `${canvasWidth}` }
      height={ `${canvasHeight}` } /></div>;
};

export default WarehouseMapCanvas;
