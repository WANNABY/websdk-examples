## WANNA WEB SDK 4.1.0 example with npm

### Prerequisites

- Node.js@18 or higher
- yarn

### Installation

1. Run `yarn` in the root of this folder to install dependencies
2. Add your license key and models ids in `src/index.js`:
```html
const license = '';
const sneakerIds = ['wanna01', 'wanna02', 'wanna03'];
const watchIds = ['wanna_watch01', 'wanna_watch02'];
```
3. Run `yarn start` to start local dev server
4. use `type` query parameter to switch between sneakers and watches:
```
http://localhost:8000/index.html?type=sneakers
```
or
```
http://localhost:8000/index.html?type=watch
```
