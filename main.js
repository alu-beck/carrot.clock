const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

// Conditionally require electron-reload in development mode
if (process.env.NODE_ENV === 'development') {
  try {
    require('electron-reload')(__dirname);
  } catch (err) {
    console.error('Failed to load electron-reload:', err);
  }
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 200,
    height: 200,
    x: 20,
    y: 40,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // Ensure this path is correct
      contextIsolation: true, // Enable context isolation
      enableRemoteModule: false, // Disable remote module
      nodeIntegration: false // Disable Node.js integration
    },
    resizable: false, // Make the window non-resizable
    movable: true, // Ensure the window is movable
    frame: false, // Remove the window frame
    alwaysOnTop: true, // Keep the window always on top
    transparent: true, // Make the window transparent
    backgroundColor: '#00000000', // Set the background color to transparent
    vibrancy: 'ultra-dark' // Set the vibrancy effect to create a blur
  });

  mainWindow.loadFile('index.html');

  // Open the DevTools in a separate window
  if (process.env.NODE_ENV === 'development') {
    try {
      mainWindow.webContents.openDevTools({ mode: 'detach' });
    } catch (err) {
      console.error('dev tools could not open', err);
    }
  }
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Handle close-window event
ipcMain.on('close-window', (event) => {
  const window = BrowserWindow.fromWebContents(event.sender);
  window.close();
});