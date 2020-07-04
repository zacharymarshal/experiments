const { ipcRenderer } = require('electron');

function onDidReceiveCommand(fn) {
  ipcRenderer.on('command', (e, command) => fn(command));
}
function sendCommand(command) {
  ipcRenderer.invoke(command);
}

let mousetraps = new WeakMap();
function bindKeys(el, keys, fn) {
  let mousetrap = mousetraps.get(el);
  if (!mousetrap) {
    const Mousetrap = require('mousetrap');
    mousetrap = new Mousetrap(el);
    mousetraps.set(el, mousetrap);
  }
  mousetrap.bind(keys, fn);
}

global.onDidReceiveCommand = onDidReceiveCommand;
global.sendCommand = sendCommand;
global.bindKeys = bindKeys;
