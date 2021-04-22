const { menubar } = require('menubar')
const Store = require('electron-store')
const path = require('path')

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

mb.on('ready', () => {
  console.log('app is ready');
});