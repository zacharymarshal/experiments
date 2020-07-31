# dark-fog

Send commands between Electron render and main process

[electron](https://www.electronjs.org/)

## Goals

- Dynamically register commands via something like packages
- Build a command palette package that would let you run any registered commands

## Notes

- `nodeIntegration` is disabled on the BrowserWindow and I preload
`src/initialize-application-window.js` to be the bridge between the `static/`
pages and Node. This is cool because I could replace Electron with some other
backend if necessary.
- I am not using Electron 9 because there is a performance bug with resizing
windows [#23980](https://github.com/electron/electron/issues/23980).
