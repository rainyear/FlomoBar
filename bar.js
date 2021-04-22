const { menubar } = require('menubar')
const Store = require('electron-store')
const path = require('path')
const { globalShortcut } = require('electron');


Store.initRenderer()

const bwOption = {
  width: 600,
  height: 250,
  webPreferences: {
    preload: path.join(__dirname, 'preload.js'),
    nodeIntegration: true,
    contextIsolation: false
  },
  resizable: false
};

const mb = menubar({
  browserWindow: bwOption,
  icon: "icon_dark.png"});


let isShown = false;
mb
  .on('after-show', () => { isShown = true })
  .on('after-hide', () => { isShown = false })
  .on('focus-lost', () => { isShown = false });


mb.on('ready', () => {
  console.log('app is ready');

  globalShortcut.register('Command+Shift+f', () => {
    isShown ? mb.hideWindow() : mb.showWindow()
  });
});


