
const { app, BrowserWindow, Menu, protocol } = require('electron');
const path = require('path');

function createWindow() {
  Menu.setApplicationMenu(null)
  const win = new BrowserWindow({
    width: 1052,
    height: 700,
    center: true,
    maximizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: false,
    }
  });
  win.loadFile('build/index.html');
  win.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow()
  app.on('window-all-closed', () => {
    app.quit();
  });
  //注册FileProtocol
  protocol.registerFileProtocol('host', (request, callback) => {
  	//截取file:///之后的内容，也就是我们需要的
    const url = request.url.substr(8);
    //使用callback获取真正指向内容
    callback({ path: path.normalize(url) });
  }, (error) => {
    if (error) console.error('Failed to register protocol');
  })
})