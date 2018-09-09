const {BrowserWindow} = require('electron');
const {download} = require('electron-dl');

module.exports = (url, opts) => download(BrowserWindow.getAllWindows()[0], url, opts);