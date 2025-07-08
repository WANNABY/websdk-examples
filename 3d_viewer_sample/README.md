## WANNA WEB SDK 4.1.0 example with React.js

### Prerequisites

- Node.js@18 or higher
- yarn

### Installation

1. Run `yarn` in the root of this folder to install dependencies
2. Add your license key and model data in `src/App.js`:
```js
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
```
3. Run `yarn start` to start local dev server
