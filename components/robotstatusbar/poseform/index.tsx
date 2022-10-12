/* eslint-disable react/jsx-no-bind */
import { KeyboardEvent, memo, useContext, useEffect, useRef } from 'react';

import FormInputGroup from './FormInputGroup';

import { StreamContext } from '../../../lib/context';
import { PosePayload } from '../../../lib/stream';
import { formatNumber } from '../../../lib/utils';

import styles from './styles.module.css';

const PoseForm = ({ onSubmit }: {
  onSubmit: (newPose: PosePayload) => void | undefined;}) => {
  const streamContext = useContext(StreamContext);
  /*
  I used a ref here to avoid renders everytime a field value is changed
  */
  const xAxisRef = useRef<HTMLInputElement>(null);
  const yAxisRef = useRef<HTMLInputElement>(null);
  const angleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    /**
     * the useEffect hook runs whenever the context value changes
     * It stores this context values to the specific fields via the ref
     */
    const state = streamContext?.state;
    if(!state) return;
    const { x, y, angle } = state;
    if(xAxisRef.current && yAxisRef.current && angleRef.current){
      xAxisRef.current.value = JSON.stringify(formatNumber(x));
      yAxisRef.current.value = JSON.stringify(formatNumber(y));
      angleRef.current.value = JSON.stringify(formatNumber(angle));
    }
  }, [ streamContext?.state]);

  /**
   * Submit pose values to the server
   */
  const onSubmitPose = () => {
    const x = parseFloat(xAxisRef.current?.value || '0');
    const y = parseFloat(yAxisRef.current?.value || '0');
    const angle = parseFloat(angleRef.current?.value || '0');
    const newPoseValues: PosePayload = { x, y, angle };
    onSubmit(newPoseValues);
  };

  /**
   * submits pose on press 'enter'
   * @param e keyboard event
   */
  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if ( e.code === 'Enter'){
      onSubmitPose();
    }
  };

  return (<>
    <>
      <FormInputGroup
        onKeyDown={ onKeyDown }
        label="X-axis"
        inputRef={ xAxisRef }
        className={ styles['input-field'] }
        name="x-axis"
        placeholder="0.00"
        type="number"
      />
      <FormInputGroup
        onKeyDown={ onKeyDown }
        label="Y-axis"
        inputRef={ yAxisRef }
        className={ styles['input-field'] }
        name="y-axis"
        placeholder="0.00"
        type="number"
      />
      <FormInputGroup
        onKeyDown={ onKeyDown }
        label="Angle"
        inputRef={ angleRef }
        className={ styles['input-field'] }
        name="angle"
        placeholder="0.00"
        type="number"  />
      <button onClick={ onSubmitPose } className={ styles.buttons }>submit</button>
    </></>);
};
// mempoized form component
export default memo(PoseForm);