const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const path = require('path');
const url = require('url');
const WindowStack = require('./window-stack');

module.exports = class SQLBossApplication {
  constructor(options) {
    this.windowStack = new WindowStack();

    app.on('window-all-closed', () => true);
    app.on('activate', (e, hasVisibleWindows) => {
      if (hasVisibleWindows) {
        return;
      }

      e.preventDefault();
      this.newWindow();
    });

    ipcMain.handle('application-new-window', e => {
      this.newWindow();
    });
    ipcMain.handle('application-quit', e => {
      this.quit();
    });
    ipcMain.handle('window-show', e => {
      const browserWindow = BrowserWindow.fromWebContents(e.sender);
      browserWindow.show();
    });
    ipcMain.handle('window-close', e => {
      const browserWindow = BrowserWindow.fromWebContents(e.sender);
      browserWindow.close();
    });
    ipcMain.handle('window-reload', e => {
      const browserWindow = BrowserWindow.fromWebContents(e.sender);
      browserWindow.reload();
    });
    ipcMain.handle('window-toggle-dev-tools', e => {
      const browserWindow = BrowserWindow.fromWebContents(e.sender);
      browserWindow.toggleDevTools();
    });
  }

  initialize() {
    global.sqlbossApplication = this;

    require('./application-menu');

    this.newWindow();
  }

  newWindow() {
    let window = new BrowserWindow({
      show: false,
      title: app.getName(),
      tabbingIdentifier: 'sqlboss',
      webPreferences: {
        nodeIntegration: false,
        preload: path.join(__dirname, '..', 'initialize-application-window.js'),
      }
    });
    window.loadURL(url.format({
      protocol: 'file',
      pathname: path.join(__dirname, '..', '..', 'static', 'index.html'),
      slashes: true,
    }));
    window.on('ready-to-show', () => window.show());
    window.once('closed', () => this.windowStack.removeWindow(window));
    window.focus();

    this.windowStack.addWindow(window);
  }

  quit() {
    app.quit();
  }

  sendCommand(command) {
    BrowserWindow.getFocusedWindow().webContents.send('command', command);
  }
}
