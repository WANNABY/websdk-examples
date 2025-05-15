import wanna from '@wannaby/wanna-sdk';
import wannaSdkIframe from '@wannaby/wanna-sdk/iframe.html';
import '@wannaby/wanna-sdk/core';
import "./index.css";

// Set your license key and models ids
const license = '';
const sneakerIds = ['wanna01', 'wanna02', 'wanna03'];
const watchIds = ['wanna_watch01', 'wanna_watch02'];

if (!license) {
  alert('License is required to run the example! Set it in index.html');
}

const elementsToShowBeforeInit = [
  'startBtn',
];
const elementsToShowAfterInit = [
  'prevBtn',
  'nextBtn',
  'destroyBtn',
];

const hideElement = (id) => {
  const element = document.getElementById(id);
  element.style.display = 'none';
};

const showElement = (id) => {
  const element = document.getElementById(id);
  element.style.display = '';
};

const disableElement = (id) => {
  document.getElementById(id).disabled = true;
};

const enableElement = (id) => {
  document.getElementById(id).disabled = false;
};

const showControls = () => {
  elementsToShowBeforeInit.forEach((id) => hideElement(id));
  elementsToShowAfterInit.forEach((id) => showElement(id));
};

const hideControls = () => {
  elementsToShowBeforeInit.forEach((id) => showElement(id));
  elementsToShowAfterInit.forEach((id) => hideElement(id));
};

const setMessage = (message) => {
  document.getElementById('message').textContent = message;
};

const setProgress = (progress) => {
  const element = document.getElementById('progress');
  if (progress === null || progress === 100) {
    element.textContent = '';
  } else {
    element.textContent = `${progress}%`;
  }
};

const resetControls = () => {
  hideControls();
  hideElement('info');
  hideElement('root');
  setMessage('');
  setProgress(null);
  enableElement('startBtn');
  enableElement('destroyBtn');
};

const processError = (error) => {
  console.error(error);
};

let modelIndex = 0;

window.addEventListener('load', () => {
  const type = new URLSearchParams(window.location.search).get('type');

  const sdkModelType = type || wanna.MODEL_TYPE_SNEAKER;

  document.getElementById('sampleType').innerText = `Current type: "${sdkModelType}"; `;
  document.getElementById('linkSneakers').setAttribute('href', `${window.location.origin}/?type=${wanna.MODEL_TYPE_SNEAKER}`);
  document.getElementById('linkWatches').setAttribute('href', `${window.location.origin}/?type=${wanna.MODEL_TYPE_WATCH}`);

  const modelIds = type === wanna.MODEL_TYPE_WATCH ? watchIds : sneakerIds;

  const config = {
    container: 'root',
    license,
    type: sdkModelType,
    iframeSrc: wannaSdkIframe,
    modelsCacheSize: 5,
  };

  const initListeners = () => {
    wanna
    .on(wanna.EVENT_RESOURCE_LOAD_PROGRESS, ({id, progress}) => {
      // don't show progress when preloading a model,
      // because the user didn't request the download
      if (id === modelIds[modelIndex]) {
        setProgress(progress);
      }
    })
  };

  const handleTryOnUnavailable = () => {
    hideElement('root');
    const initButton = document.getElementById('startBtn');
    initButton.textContent = 'Try-on not available';
    initButton.disabled = true;
    wanna.destroy();
  };

  const preInitAndPreload = () => {
    // start initializing and preload the selected model when initialized
    wanna.init(config)
      .then(() => false)
      .catch((error) => {
        handleTryOnUnavailable();
        processError(error);

        return true;
      })
      .then((wasError) => {
        if (!wasError) {
          preloadModel(modelIndex);
        }
      });
  };

  const consentGranted = window.confirm('[DEMO] By using this application, you consent to the collection and processing of your data as outlined in our Privacy Policy.');

  if (consentGranted) {
    wanna.registerUserConsent();
  } else {
    alert('Cannot proceed without a consent!');
    return;
  }

  preInitAndPreload();

  const handleInit = async () => {
    disableElement('startBtn');
    const isSupportedEnvironment = await wanna.checkEnvironment();
    if (!isSupportedEnvironment) {
      console.warn('Unsupported env! Use at your own risk :)');
    }

    showElement('info');
    setMessage('Initializing...');
    initListeners();

    try {
      showElement('root');
      await Promise.all([
        // show video stream as fast as possible
        // this will request camera access if needed
        wanna.initVideo(),
        // wait for init to finish
        // it is allowed to call init multiple times with the same config
        wanna.init(config),
      ])
    } catch (error) {
      handleTryOnUnavailable();
      processError(error);
      return;
    }

    showControls();

    await setModel(modelIndex);
  }

  const handleDestroy = async () => {
    disableElement('destroyBtn');
    await wanna.destroy();
    resetControls();
    modelIndex = 0;
  };

  const handleNext = async() => {
    await setModel(modelIndex + 1);
  };

  const handlePrev = async() => {
    await setModel(modelIndex - 1);
  };

  const preloadModel = async (index) => {
    try {
      await wanna.downloadModel({ id: modelIds[index] });
    } catch (error) {
      if (error.name === wanna.ERROR_SDK_DESTROYED) {
        // just an example of handling this error
        // sdk could be destroyed while preloading model in the background
        // no need to process this error in our case
      } else {
        processError(error);
      }
    }
  };

  const setModel = async (index) => {
    modelIndex = Math.max(0, Math.min(modelIds.length - 1, index));

    const modelId = modelIds[modelIndex];

    // call wanna.pausePipeline() here if you want to hide the current sneaker
    // and show the raw camera stream
    setMessage(modelId);

    let modelWasSet;

    try {
      // modelWasSet will be false if the user selects another model
      // before the promise resolution
      modelWasSet = await wanna.downloadAndSetModel({id: modelId});
    } catch (error) {
      // if another model is already set it won't be changed when an error occurs
      setMessage(`Failed to load model "${modelId}"`);
      processError(error);
    }

    if (modelWasSet) {
      // preload the next and previous models on the list
      if (modelIds[modelIndex + 1]) {
        preloadModel(modelIndex + 1);
      }

      if (modelIds[modelIndex - 1]) {
        preloadModel(modelIndex - 1);
      }
    }
  };

  document.getElementById('startBtn').addEventListener('click', handleInit);
  document.getElementById('prevBtn').addEventListener('click', handlePrev);
  document.getElementById('nextBtn').addEventListener('click', handleNext);
  document.getElementById('destroyBtn').addEventListener('click', handleDestroy);
})
