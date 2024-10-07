## WANNA WEB SDK 3.3.0 example with local SDK files

### Installation

1. Put the content of WANNA WEB SDK into `./libs` directory.
2. Add your license key and models ids in `index.html` file:
```html
const license = '';
const sneakerIds = ['wanna01', 'wanna02', 'wanna03'];
const watchIds = ['wanna_watch01', 'wanna_watch02'];
```
3. Start local web server in the root of this folder:
* PHP:<br />
  `php -S 0.0.0.0:8000`
* Python 2.x:<br />
  `python -m SimpleHTTPServer 8000`
* Python 3.x:<br />
  `python -m http.server 8000`
4. Open browser and navigate to `http://localhost:8000`
5. Use `type` query parameter to switch between sneakers and watches:
```
http://localhost:8000/index.html?type=sneakers
```
or
```
http://localhost:8000/index.html?type=watch
```
