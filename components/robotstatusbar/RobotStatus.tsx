/* eslint-disable react/jsx-no-bind */
import { useCallback, useState } from 'react';

import PoseForm from './poseform';

import { getPoseStream, useStream, PosePayload, getPausedStream } from '../../lib/stream';
import { formatNumber, poseContainerItems, PoseItemProps } from '../../lib/utils';

import styles from './RobotStatus.module.css';

const RobotStatus = () => {
  const [isRobotPaused, setRobotPaused] = useState(false);
  const [pose, setPose] = useState<PosePayload>();
  const [ errorMessage, setError] = useState('');
  const [ copyMessage, setCopyMessage] = useState('');
  // Pause state
  const { connected: pauseConnected, stream: pausedStream } = useStream(getPausedStream, ({ paused }) => { setRobotPaused(paused); });

  // Current pose
  const { connected: poseConnected, stream: poseStream } =
    useStream(getPoseStream, (payload) => { setError(''); setPose(payload); } );
  // set pose value
  const postPose = useCallback((newPose: PosePayload) => poseStream?.send({ ...newPose }), [poseStream]);

  // copy to clipboard
  const copyPose = async () => {
    await navigator.clipboard.writeText(JSON.stringify(pose));
    setCopyMessage('Position copied to clipboard');
    setTimeout(() => setCopyMessage(''), 5000);
  };

  /**
   * PAUSE AND/OR UNPAUSE ROBOT
   * refactored this since the most part share the same code.
   * Addes error handler to trigger an error message when connection is broken with the server
   */
  const pauseOrUnpause = useCallback(() => {
    try {
      pausedStream?.send({ paused: !isRobotPaused });
    } catch (error) {
      if(!pauseConnected) return setError('Please check your internet connection!');
      setError('Something wrong happened, we are working on fixing it!');
    }
  }, [pausedStream, pauseConnected, isRobotPaused]);

  /**
   * Renders pose values
   * @param PoseItemProps
   * @returns JSX
   */
  const renderPoseItems = ({ label, value, unit }: PoseItemProps) => {
    return(<>
      <span className={ styles['axis-label'] }>{label}</span>
      <span className={ styles.counter }>{formatNumber(pose?.[value] || 0)}</span>
      <span className={ styles['axis-label'] }>{unit}</span>
    </>);
  };

  // check if the robot is paused and connection is still online
  const isRobotPausedAndStreamConnected = isRobotPaused && poseConnected;

  // Renders controls, and form fields
  const renderControls = (<><div className={ styles.controls }>
    <div className={ styles['button-container'] }>
      <button className={ styles.buttons } onClick={ pauseOrUnpause }>{ isRobotPausedAndStreamConnected ? 'Start moving' : 'Stop moving'}</button>
      <button className={ styles.buttons } onClick={ copyPose }>Copy Position</button>
    </div>
    <div className={ styles.poseform }>
      <PoseForm onSubmit={ postPose } />
    </div>
  </div></>);

  // renders connection and robot statuses
  const renderSignals = (<div className={ `${styles.right} ${styles.signal}` }>
    <div className={ isRobotPausedAndStreamConnected ? styles.disconnected : styles.connected  }>
      <span className={ styles.text }>
        { isRobotPausedAndStreamConnected ? 'robot paused' : 'robot moving'}</span>
      <span className={ `${styles['connected-signal']} ${ isRobotPausedAndStreamConnected ? styles['robot-paused'] : '' }` } />
    </div>
    <div className={ poseConnected ? styles.connected : styles.disconnected }>
      <span className={ styles.text }>{ poseConnected ? 'Connection online' : 'Connection offline'}</span>
      <span className={ styles['connected-signal'] } />
    </div>
  </div>);

  return (
    <div className={ styles.container }>
      { errorMessage && <text className={ styles.errormessage }>{errorMessage}</text> }
      { copyMessage && <text className={ styles.copymessage }>{copyMessage}</text> }
      <div className={ styles.left }>
        {poseContainerItems.map((poseItem: PoseItemProps) =>
          <div key={ poseItem.value } className={ styles['pose-container-item'] }>
            {renderPoseItems(poseItem)}
          </div>)
        }
      </div>
      { renderControls }
      { renderSignals }
    </div>
  );
};

export default RobotStatus;
