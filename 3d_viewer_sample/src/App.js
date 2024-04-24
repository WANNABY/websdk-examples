import React from 'react';
import wannaSdk from '@wannaby/wanna-sdk';
import WannaUI, { VIEW_MODE_MOBILE }  from '@wannaby/wanna-ui';
import '@wannaby/wanna-ui/styles.css';
import wannaSdkIframe from '@wannaby/wanna-sdk/iframe.html';
import '@wannaby/wanna-sdk/core';

// Put your license key here
const license = '';
const modelData = {
  id: 'wanna_bag',
  brand: 'WANNA',
  name: 'WANNA Bag',
  pois: [
    'Text that will be displayed for the 1st POI',
    '',
    'Text that will be displayed for the 3nd POI',
  ],
};

const App = () =>  {
  return (
    <div className="App">
      <WannaUI
        wannaSdk={wannaSdk}
        iframeSrc={wannaSdkIframe}
        models={[modelData]}
        license={license}
        mode={wannaSdk.MODE_TYPE_3D}
        modelsType={wannaSdk.MODEL_TYPE_BAG}
        viewMode={VIEW_MODE_MOBILE}
        theme={wannaSdk.THEME_LIGHT}
        onError={(error) => console.log(error)}
      />
    </div>
  );
}

export default App;