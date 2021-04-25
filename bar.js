const { menubar } = require('menubar')
const Store = require('electron-store')
const path = require('path')
const { globalShortcut, BrowserWindow, ipcMain, Notification } = require('electron');

var mainWin
function createMainWin() {
  let win = new BrowserWindow({
    width: 400,
    height: 800,
    icon: "icon.icns",
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false
    } ,
    modal: true,
    show: false
  })

  win.loadURL("https://flomo.app")
  win.once('closed', ()=>{
    mainWin = null
  })
  return win
}

Store.initRenderer()

const bwOption = {
  width: 600,
  height: 220,
  webPreferences: {
    preload: path.join(__dirname, 'preload.js'),
    nodeIntegration: true,
    contextIsolation: false
  },
  resizable: false,
  icon: "icon.icns"
};

const mb = menubar({
  browserWindow: bwOption,
  showOnAllWorkspaces: true,
  icon: path.join(__dirname, "icon.png")});


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
  mainWin = createMainWin()
});

function showMainWin() {
  if (!mainWin) {
    mainWin = createMainWin()
  }
  mainWin.reload()
  mainWin.show()
}


ipcMain.on('SHOWMAIN', (event, arg) => {
  showMainWin()
})
