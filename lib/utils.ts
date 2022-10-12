import { useEffect, useState } from 'react';
import { StaticImageData } from 'next/image';

// HOOKS

/**
 * hook that sets the proper dimension of the canvas against its wrapper
 * @param floorMap Static image object
 * @param clientHeight height of the canvas wrapper. NOTE: canvas fills 100% of the wrapper
 * @returns { canvasHeight, canvasWidth, mapperRatio }
 */
export const useSetDimensions = (floorMap: StaticImageData, clientHeight?: number) => {
  const [canvasHeight, setHeight] = useState<number>(0);
  const [canvasWidth, setWidth] = useState<number>(0);
  const [mapperRatio, setRatio] = useState<number>(1);

  /**
   * Generates a mapper ratio for image and canvas
   * mapper ratio is used to calculate corresponding width of image based on canvas height
   * mapper ratio is returned and used to calculate corresponding x and y axes of the robot pose
   */
  const resizeCanvasDimensions = () => {
    const wrapperHeight = clientHeight || 0;
    const ratio = wrapperHeight / floorMap.height;
    const wrapperWidth = ratio * floorMap.width;

    setHeight(wrapperHeight);
    setWidth(wrapperWidth);
    setRatio(ratio);
  };

  useEffect(() => {
    resizeCanvasDimensions();
    // resize event to respond to screen size
    window.addEventListener('resize', resizeCanvasDimensions);
    return () => {
      window.removeEventListener('resize', resizeCanvasDimensions);
    };
  });

  return { canvasHeight, canvasWidth, mapperRatio };
};

// REDUCERS
export type IGET_MOUSE_POSITION = {
  type: 'GET_MOUSE_POSITION';
  payload: {
    x: number;
    y: number;
    angle: number;
  }; };

export type ISET_MOUSE_POSITION = {
  type: 'SET_MOUSE_POSITION';
  payload: {
    x: number;
    y: number;
    angle: number;
  }; };

export type Action =
  | IGET_MOUSE_POSITION
  | ISET_MOUSE_POSITION;

type InitialState = {
  x: number;
  y: number;
  angle: number;
};

export type State =
  | InitialState;

export const positionReducer = (state: State, action: Action ): State => {
  switch(action.type){
  case 'GET_MOUSE_POSITION':
    return { ...state, ...action.payload };
  case 'SET_MOUSE_POSITION':
    return { ...state, ...action.payload };
  default:
    return state;
  }
};

// CONSTANTS

export type PoseItemProps = {
  value: 'x' | 'y' | 'angle';
  unit: 'meters' | 'rad';
  label: 'angle' | 'x-axis' | 'y-axis';
};

export const poseContainerItems: PoseItemProps[] = [
  {
    value: 'x',
    unit: 'meters',
    label: 'x-axis'
  },
  {
    value: 'y',
    unit: 'meters',
    label: 'y-axis'
  },
  {
    value: 'angle',
    unit: 'rad',
    label: 'angle'
  }
];

export const formatNumber = (num: number) => +num.toFixed(2);