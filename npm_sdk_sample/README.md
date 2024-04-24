## WANNA WEB SDK example with npm

### Prerequisites

- Node.js@16
- yarn

### Installation

1. Run `yarn` in the root of this folder to install dependencies
2. Add your license key in `src/index.js`:
```html
const license = '';
```
3. Run `yarn start` to start local dev server
4. use `type` query parameter to switch between sneakers and watches:
```
http://localhost:8000/index.html?type=sneakers
```
or
```
http://localhost:8000/index.html?type=watches
```