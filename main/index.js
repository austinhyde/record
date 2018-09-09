const {app, BrowserWindow} = require('electron');


process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true;

let currentWindow;

function createWindow() {
  const window = new BrowserWindow({
    frame:false,
    width: 800,
    height: 600,
    webPreferences: {
      webSecurity:false,
    },
    transparent: true,
    alwaysOnTop: true,
  });
  window.setMenu(null);
  // window.setContentProtection(true);
  window.loadURL('http://localhost:8080/index.html');
  window.on('closed', function () {
    currentWindow = null;
  });
  return window;
}

async function devtools() {
  if (process.env.NODE_ENV !== 'development') return;
  // const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer');
  // await installExtension(REACT_DEVELOPER_TOOLS);
  currentWindow.webContents.openDevTools();
}

app.on('ready', async function(){
  currentWindow = createWindow();
  // devtools();
});

app.on('window-all-closed', function(){
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function(){
  if (!currentWindow) {
    currentWindow = createWindow();
  }
});