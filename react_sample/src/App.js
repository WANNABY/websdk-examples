import React, {useEffect, useState} from 'react'
import wanna from '@wannaby/wanna-sdk';
import wannaSdkIframe from '@wannaby/wanna-sdk/iframe.html';
import '@wannaby/wanna-sdk/core';
import './index.css';

const App = () => {
  const [status, setStatus] = useState('Initializing');

  useEffect(() => {
    // Set your license, modelType and modelId
    const license = '';
    const modelId = 'wanna01';
    const modelType = wanna.MODEL_TYPE_SNEAKER;

    const startWanna = async () => {
      try {
        await Promise.all([
          wanna.initVideo(),
          wanna.init({
            container: 'wanna-container',
            license: license,
            type: modelType,
            iframeSrc: wannaSdkIframe,
          }),
        ]);
        setStatus('Downloading model')

        await wanna.downloadAndSetModel({id: modelId});

        setStatus('Running')

        console.log('Successfully initialized WANNA SDK');
      } catch (error) {
        console.error('Error initializing WANNA SDK', error);
      }
    }

    startWanna();
  }, [])

  return (
    <>
      <div id="wanna-container" />
      <span className="status">
        Status: {status}
      </span>
    </>
  );
}

export default App;
