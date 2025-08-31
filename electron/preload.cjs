const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Database operations
  dbInit: () => ipcRenderer.invoke('db-init'),
  dbQuery: (query, params) => ipcRenderer.invoke('db-query', query, params),
  
  // File operations
  showOpenDialog: (options) => ipcRenderer.invoke('file-dialog', options),
  showSaveDialog: (options) => ipcRenderer.invoke('save-dialog', options),
  
  // Enhanced file operations
  readLicenseFile: (filePath) => ipcRenderer.invoke('read-license-file', filePath),
  writeLicenseFile: (filePath, content) => ipcRenderer.invoke('write-license-file', filePath, content),
  fileExists: (filePath) => ipcRenderer.invoke('file-exists', filePath),
  readFileContent: (filePath) => ipcRenderer.invoke('read-file-content', filePath),
  writeFileContent: (filePath, content) => ipcRenderer.invoke('write-file-content', filePath, content),
  listDirectory: (dirPath) => ipcRenderer.invoke('list-directory', dirPath),
  getAppDataPath: () => ipcRenderer.invoke('get-app-data-path'),
  getDocumentsPath: () => ipcRenderer.invoke('get-documents-path'),
  
  // Enhanced machine fingerprinting
  getMachineFingerprint: () => ipcRenderer.invoke('get-machine-fingerprint'),
  validateMachineFingerprint: (fingerprint) => ipcRenderer.invoke('validate-machine-fingerprint', fingerprint),
  compareMachineFingerprints: (fp1, fp2) => ipcRenderer.invoke('compare-machine-fingerprints', fp1, fp2),
  
  // App information
  getAppVersion: () => process.versions.app,
  getNodeVersion: () => process.versions.node,
  getChromeVersion: () => process.versions.chrome,
  
  // Platform information
  platform: process.platform,
  isDev: process.env.NODE_ENV === 'development',
  
  // Window controls
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close: () => ipcRenderer.send('window-close'),
  
  // Listeners
  onWindowStateChange: (callback) => {
    ipcRenderer.on('window-state-changed', callback);
  },
  
  // Remove listeners
  removeAllListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  }
});

// Security: Prevent access to Node.js APIs
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const dependency of ['chrome', 'node', 'electron']) {
    replaceText(`${dependency}-version`, process.versions[dependency]);
  }
});

// Prevent access to Node.js globals
window.process = undefined;
window.require = undefined;
window.module = undefined;
window.global = undefined;
window.Buffer = undefined;
