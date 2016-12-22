var electron = require('electron'), path = require('path'), url = require('url'), storage = require('electron-json-storage'), mainWindow, scale = 3, barHeight = 8;
var app = electron.app, browserWindow = electron.BrowserWindow;

var winWidth = 256, winHeight = 240 + barHeight;

var createWindow = function(){
  mainWindow = new browserWindow({
    width: winWidth * scale,
    height: winHeight * scale,
    minWidth: winWidth,
    minHeight: winHeight
  });
  mainWindow.setMenu(null);
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));
  mainWindow.webContents.openDevTools()
  mainWindow.on('closed', function(){
    mainWindow = null
  });
}
app.on('ready', createWindow);
app.on('window-all-closed', function(){
  if(process.platform != 'darwin') app.quit();
});
app.on('activate', function(){
  if(mainWindow == null) createWindow();
});