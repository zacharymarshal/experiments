let keybindings = {
  'document': {
    'application:new-window': ['command+n'],
    'application:quit': ['command+q'],
    'window:close': ['command+w'],
    'window:reload': ['command+r'],
    'window:toggle-dev-tools': ['command+option+i'],
  },
};

for (let selector in keybindings) {
  let el;
  if (selector === 'document') {
    el = document;
  } else {
    el = document.querySelector(selector);
  }
  for (let command in keybindings[selector]) {
    let keys = keybindings[selector][command];
    bindKeys(el, keys, () => {
      callCommand(command);
      return false;
    });
  }
}

let commands = {
  'application:new-window': () => sendCommand('application-new-window'),
  'application:quit': () => sendCommand('application-quit'),
  'window:close': () => sendCommand('window-close'),
  'window:reload': () => sendCommand('window-reload'),
  'window:toggle-dev-tools': () => sendCommand('window-toggle-dev-tools'),
};

onDidReceiveCommand(command => callCommand(command));
function callCommand(command) {
  return commands[command]();
}
