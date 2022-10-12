import { useEffect, useState } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';

import { StreamContextProvider } from '../lib/context';

import styles from '../styles/index.module.css';
import warehouseMap from '../public/images/map.png';

const RobotStatus = dynamic(() => import('../components/robotstatusbar/RobotStatus'), { ssr: false });
const WarehouseMapVisualizer = dynamic(() => import('../components/warehousemap'), { ssr: false });

const Home = () => {
  const [landscape, setLandscape]= useState(true);

  const triggerPotraitAlert = () => {
    const windowRatio = window.innerHeight / window.innerWidth;
    const isLandscape = windowRatio < 1;
    setLandscape(isLandscape);
  };

  useEffect(() => {
    window.addEventListener('resize', triggerPotraitAlert);
    return () => window.removeEventListener('resize', triggerPotraitAlert);
  });

  return (
    <StreamContextProvider>
      {landscape
        ? <div className={ styles.container }>
          <Head>
            <title>Robot Map tool</title>
            <meta name="description" content="A basic robot front-end" />
            <link rel="icon" href="/favicon.ico" />
          </Head>

          <header className={ styles.header }>
        Robot front-end
          </header>

          <main className={ styles.main }>
            <WarehouseMapVisualizer
              id="warehouse-1"
              floorMap={ warehouseMap }
              pixelRatio={ 10 }
            />
            <RobotStatus />
          </main>
        </div>
        : <div className={ styles.orientationalert }>
          <p className={ styles.orientationtext }>Please use landscape view for a better experience</p>
        </div>}
    </StreamContextProvider>
  );
};

export default Home;
