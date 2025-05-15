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
        const isSupportedEnvironment = await wanna.checkEnvironment();

        if (!isSupportedEnvironment) {
          setStatus('Unsupported environment');
          return
        }

        const consentGranted = window.confirm('[DEMO] By using this application, you consent to the collection and processing of your data as outlined in our Privacy Policy.');

        if (consentGranted) {
          wanna.registerUserConsent();
        } else {
          alert('Cannot proceed without a consent!');
          return;
        }

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
