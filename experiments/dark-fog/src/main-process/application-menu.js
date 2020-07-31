const { BrowserWindow, Menu } = require('electron');

const defaultTemplate = [
  {
    label: 'SQLBoss',
    submenu: [
      {
        label: 'New Window',
        accelerator: 'Command+N',
        click: function() {
          global.sqlbossApplication.newWindow();
        },
      },
      {
        label: 'Toggle Dev Tools',
        accelerator: 'Command+Alt+I',
        click: function() {
          BrowserWindow.getFocusedWindow().toggleDevTools();
        },
      },
      {
        label: 'Quit',
        accelerator: 'Command+Q',
        click: function() {
          global.sqlbossApplication.quit();
        }
      }
    ]
  }
];

let menu = Menu.buildFromTemplate(defaultTemplate);
Menu.setApplicationMenu(menu);
