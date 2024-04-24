## WANNA WEB SDK example with local SDK files

### Installation

1. Put build of WANNA WEB SDK into `./libs` directory.
2. Add your license key in `index.html` file:
```html
const license = '';
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
http://localhost:8000/index.html?type=watches
```