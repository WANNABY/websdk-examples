// Put your license string here:
const license = '';
// Define the wrist size VTO will open with by default
const defaultWristSize = 55;
// Watches models list
const watches = {
  45: 'wanna_watch_45',
  50: 'wanna_watch_50',
  55: 'wanna_watch_55',
  60: 'wanna_watch_60',
  65: 'wanna_watch_65',
};

if (!license) {
  alert(
    'License is required to run the example! Set it in ./index.js'
  );
}

let savedWristMeasure = Number(localStorage.getItem('wristSize'));
let isConsentConfirmed = JSON.parse(localStorage.getItem('isConsentConfirmed'));
let wristMeasurementConfig;
let tryOnConfig;
let wristMeasurementLoaded = false;
let wristMeasurementSuccessPopupShown = false;
let tryOnStarted = false;
let hintTimeoutId;

// Wait util 'wanna' object is ready
window.addEventListener('load', init);

async function init() {
  const isSupportedEnvironment = await wanna.checkEnvironment();

  if (!isSupportedEnvironment) {
    handleTryOnUnavailable();

    return;
  }

  // You can use customization options in both wrist measure and Try-on configs
  wristMeasurementConfig = {
    container: 'wristMeasureWrapper',
    startWristSize: savedWristMeasure || defaultWristSize,
  };
  tryOnConfig = {
    container: 'iframeWrapper',
    license,
    type: wanna.MODEL_TYPE_WATCH,
    iframeSrc: './libs/iframe.html',
  };

  try {
    // Init VTO
    await wanna.init(tryOnConfig);
    await startTryOn();

    if (!savedWristMeasure) {
      // Show the hint after starting VTO
      hintTimeoutId = setTimeout(showSuggestion, 5000);
    }
  } catch (error) {
    handleTryOnUnavailable();
  }
}

// Display an error if environment does not fit Try-on requirements,
// also could be used for error catching
function handleTryOnUnavailable() {
  hideElement('iframeWrapper');
  hideElement('wristMeasureWrapper');
  showElement('errorWrapper');

  const errorWrapper = document.getElementById('errorWrapper');

  errorWrapper.textContent = 'Try-on not available';
  wanna.destroy();
}

// Use saved/default wrist size value if user closes wrist measurement
function skipWristMeasurement() {
  hideElement('wristMeasureWrapper');
  startTryOn();
}

// Load and display wrist measurement
async function showWristMeasurement() {
  // Interrupt for confirmation if it wasn't chosen
  if (isConsentConfirmed === null) {
    showElement('consentConfirmation');

    return;
  }

  // Just show wrist measure container if it has been loaded already
  if (wristMeasurementLoaded) {
    hideElement('loading');
    showElement('wristMeasureWrapper');

    return;
  }

  // Setup timeout for skipping the wrist measure in case of slow loading
  const skipMeasurementTimeout = setTimeout(() => {
    skipWristMeasurement();
  }, 5000);

  showElement('loading');

  await wanna.showWristMeasurement({
    ...wristMeasurementConfig,
    onLoadingSuccess: () => {
      wristMeasurementLoaded = true;
      clearTimeout(skipMeasurementTimeout);
      hideElement('loading');
      showElement('wristMeasureWrapper');
    },
    onSaveClick: onWristMeasureSave,
    onCloseClick: onWristMeasureClose,
    onError: (error) => {
      console.error(error)
      skipWristMeasurement()
    },
  });
}

async function startTryOn(measuredWristSize = null) {
  try {
    const wristSize = measuredWristSize || savedWristMeasure;

    // Show sdk iframe with raw camera output, and loading dialog while model is loading
    showElement('iframeWrapper');
    showElement('loading');

    await Promise.all([
      // Load video stream
      // This will request camera access if needed
      wanna.initVideo(),
      // Wait for init to finish
      // It is allowed to call init multiple times with the same config
      wanna.init(tryOnConfig),
    ]);

    // Detect watches model id by user wrist size and use it for Try-on
    await wanna.downloadAndSetModel({
      id: getModelBySize(wristSize || defaultWristSize),
    });

    tryOnStarted = true;

    hideElement('loading');
    showElement('remeasureButton');

    // Check if wrist size was measured or saved before
    if (wristSize) {
      // Display check icon on re-measure button to show that measurement succeeded
      showElement('remeasureButtonSuccessIcon');

      // Display dialog window with success measurement only once
      if (measuredWristSize && !wristMeasurementSuccessPopupShown) {
        wristMeasurementSuccessPopupShown = true;
        showElement('successWristMeasureWrapper');

        setTimeout(() => {
          hideElement('successWristMeasureWrapper');
        }, 2000);
      }
    }
  } catch (error) {
    handleTryOnUnavailable();
  }
}

// Show suggestion hint
function showSuggestion() {
  showElement('suggestion');
}

function hideSuggestion() {
  hideElement('suggestion');
}

// Use selected wrist size value for Try-on and save it in local storage,
// so next when time user open Try-on we can skip wrist measurement step
function onWristMeasureSave(wristSize) {
  hideElement('wristMeasureWrapper');

  startTryOn(wristSize);

  savedWristMeasure = wristSize;
  localStorage.setItem('wristSize', wristSize);
}

// Closing re-measure should not restart try-on, we can just hide wrist measureн
function onWristMeasureClose() {
  hideElement('wristMeasureWrapper');

  if (tryOnStarted) {
    showElement('iframeWrapper');

    return;
  }

  startTryOn();
}

// Show wrist measure again if user clicks on re-measure button
function onRemeasureClick() {
  clearTimeout(hintTimeoutId);
  hideSuggestion();
  hideElement('iframeWrapper');

  // If confirmation was skipped set to initial value
  if (isConsentConfirmed === false) {
    isConsentConfirmed = null;
  }
  showWristMeasurement();
}

// Detect exact model id by user wrist size
function getModelBySize(size) {
  const modelSizes = Object.keys(watches).sort();
  const smallestSize = modelSizes[0];
  const biggestSize = modelSizes[modelSizes.length - 1];
  let modelSize = Math.round(size / 5) * 5;

  if (modelSize < smallestSize) {
    modelSize = smallestSize;
  } else if (modelSize > biggestSize) {
    modelSize = biggestSize;
  }

  return watches[modelSize];
}

function toggleConfirmationCheckbox(checkboxElement) {
  const isChecked = checkboxElement.classList.toggle('checked');
  const confirmButton = document.getElementById('confirmConsentButton');

  confirmButton.disabled = !isChecked;
}

// Utils
function hideElement(id) {
  const element = document.getElementById(id);

  element.style.display = 'none';
}

function showElement(id) {
  const element = document.getElementById(id);

  element.style.display = '';
}

function setIsConsentConfirmed(value) {
  localStorage.setItem('isConsentConfirmed', JSON.stringify(value));
  isConsentConfirmed = value;
  hideElement('consentConfirmation');

  if (value) {
    showWristMeasurement();
  } else {
    skipWristMeasurement();
  }
}
