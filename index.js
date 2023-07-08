// main.js

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { stat } = require('fs').promises;
const { initialize, enable } = require('@electron/remote/main');
const { createFFmpeg, fetchFile } = require('@ffmpeg/ffmpeg');
const { generateThumbnail, convert } = require('./ffmpeg/core')
const fs = require('fs');
const Queue = require('./queue/queue');

let mainWindow;
let convertSettings;
initialize();
const ffmpegQueue = new Queue();
//const ffmpeg = createFFmpeg({log:true});
const ffmpeg = createFFmpeg();
const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
    //autoHideMenuBar: true
  });

  enable(mainWindow.webContents);

  // Load the index.html of the app.
  mainWindow.loadFile('index.html');
  //mainWindow.setMenu(null);
};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

ipcMain.on('convertSettings', async (event, data) => {
  convertSettings = new BrowserWindow({
    width: 500,
    height: 500,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false
    },
    autoHideMenuBar: true
  });
  enable(convertSettings.webContents);
  convertSettings.loadFile('convertSettings.html');
  convertSettings.webContents.on('dom-ready', () => {
    convertSettings.webContents.send('file', data);
  });
  convertSettings.setMenu(null);
});
ipcMain.on('fileImported', async (event, filePaths) => {
  try {
    filePaths.length > 1 ?mainWindow.webContents.send('fileAnalysis', 'Analyzing files'):mainWindow.webContents.send('fileAnalysis', 'Analyzing file');
    const data = [];
    for (const file of filePaths) {
      const fileStat = await stat(file);
      const pic = await generateThumbnail(ffmpeg, file);
      const fileInfo = {
        ...fileStat,
        path: file,
        parentDir: path.dirname(file),
        name: path.parse(file).base.replace(path.extname(file), ""),
        thumb: pic,
        extension: path.extname(file)
      };
      data.push(fileInfo);
    }    
    mainWindow.webContents.send('fileInfo', data);
  } catch (error) {
    mainWindow.webContents.send('ffmpegError', error);
  }
});
ipcMain.on('settingsDone', async (event, data) => {
  convertSettings.close()
  ffmpegQueue.enqueue(data)
})

ipcMain.on('changeView', async (e,data) => {
  mainWindow.loadFile(data);
})

ipcMain.on('startConversion', async (e) => {
  const list = ffmpegQueue.list();
  let totalBytes = 0;
  let bytesProcessed = 0;

  for (const video of list) {
    totalBytes += video.size;
  }
  mainWindow.webContents.send('fileAnalysis', 'Converting files')
  for (let index = 0; index < list.length; index++) {
    const element = list[index];
    console.log(index);
    bytesProcessed += element.size;
    mainWindow.webContents.send('progressBar', (bytesProcessed / totalBytes) * 100);
    await convert(ffmpeg, element.input, element.output, element.args);
  }
  mainWindow.webContents.send('conversionEnded', 'ok');
});


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
