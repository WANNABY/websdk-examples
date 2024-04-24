## WANNA WEB SDK example with wrist measurement

### Installation

1. Put build of WANNA WEB SDK into `./libs` directory.
2. Add your license key in `index.js` file:
```js
const license = '';
```

**optional**: you can specify your models list in `index.js` file:
```js
const watches = {
  45: 'wanna_watch_45',
  50: 'wanna_watch_50',
  55: 'wanna_watch_55',
  60: 'wanna_watch_60',
  65: 'wanna_watch_65',
};
```
3. Start local web server in the root of this folder:
* PHP:<br />
  `php -S 0.0.0.0:8000`
* Python 2.x:<br />
  `python -m SimpleHTTPServer 8000`
* Python 3.x:<br />
  `python -m http.server 8000`
4. Open browser and navigate to `http://localhost:8000`