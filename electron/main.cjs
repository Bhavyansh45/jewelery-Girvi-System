const { app, BrowserWindow, Menu, Tray, nativeImage, ipcMain, dialog } = require('electron');
const path = require('path');

// Determine if we're in development mode
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

let mainWindow;
let tray;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.cjs'),
      webSecurity: true,
      allowRunningInsecureContent: false
    },
    icon: path.join(__dirname, '../assets/icon.png'),
    show: false,
    titleBarStyle: 'default',
    frame: true
  });

  // Set Content Security Policy
  mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' http://localhost:* https://*.firebaseio.com https://*.googleapis.com;"
        ]
      }
    });
  });

  // Load the app
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Prevent new window creation
  mainWindow.webContents.setWindowOpenHandler(() => {
    return { action: 'deny' };
  });
}

function createTray() {
  // Create tray icon
  const iconPath = path.join(__dirname, '../assets/icon.png');
  const icon = nativeImage.createFromPath(iconPath).resize({ width: 16, height: 16 });
  
  tray = new Tray(icon);
  tray.setToolTip('Jewelry Girvi System');

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show App',
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
        }
      }
    },
    {
      label: 'Hide App',
      click: () => {
        if (mainWindow) {
          mainWindow.hide();
        }
      }
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        app.quit();
      }
    }
  ]);

  tray.setContextMenu(contextMenu);

  // Double click to show window
  tray.on('double-click', () => {
    if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
    }
  });
}

// App event handlers
app.whenReady().then(() => {
  createWindow();
  createTray();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  if (tray) {
    tray.destroy();
  }
});

// IPC handlers for database operations
ipcMain.handle('db-init', async () => {
  try {
    const { initDatabase } = require('../src/lib/db/index.ts');
    const db = initDatabase();
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('db-query', async (event, query, params) => {
  try {
    const { getDatabase } = require('../src/lib/db/index.ts');
    const db = getDatabase();
    const result = await db.execute(query, params);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('file-dialog', async (event, options) => {
  try {
    const result = await dialog.showOpenDialog(mainWindow, options);
    return result;
  } catch (error) {
    return { canceled: true, error: error.message };
  }
});

ipcMain.handle('save-dialog', async (event, options) => {
  try {
    const result = await dialog.showSaveDialog(mainWindow, options);
    return result;
  } catch (error) {
    return { canceled: true, error: error.message };
  }
});

// Enhanced IPC handlers for file operations
ipcMain.handle('read-license-file', async (event, filePath) => {
  try {
    const fs = require('fs');
    const path = require('path');
    
    // Validate file path for security
    const resolvedPath = path.resolve(filePath);
    if (!resolvedPath.startsWith(process.cwd()) && !resolvedPath.startsWith(app.getPath('userData'))) {
      throw new Error('Access denied: Invalid file path');
    }
    
    const content = fs.readFileSync(resolvedPath, 'utf8');
    return { success: true, content };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('write-license-file', async (event, filePath, content) => {
  try {
    const fs = require('fs');
    const path = require('path');
    
    // Validate file path for security
    const resolvedPath = path.resolve(filePath);
    if (!resolvedPath.startsWith(process.cwd()) && !resolvedPath.startsWith(app.getPath('userData'))) {
      throw new Error('Access denied: Invalid file path');
    }
    
    fs.writeFileSync(resolvedPath, content, 'utf8');
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('file-exists', async (event, filePath) => {
  try {
    const fs = require('fs');
    const path = require('path');
    
    const resolvedPath = path.resolve(filePath);
    const exists = fs.existsSync(resolvedPath);
    return { success: true, exists };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-app-data-path', async () => {
  return app.getPath('userData');
});

ipcMain.handle('get-documents-path', async () => {
  return app.getPath('documents');
});

ipcMain.handle('read-file-content', async (event, filePath) => {
  try {
    const fs = require('fs');
    const content = fs.readFileSync(filePath, 'utf8');
    return { success: true, content };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('write-file-content', async (event, filePath, content) => {
  try {
    const fs = require('fs');
    fs.writeFileSync(filePath, content, 'utf8');
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('list-directory', async (event, dirPath) => {
  try {
    const fs = require('fs');
    const path = require('path');
    
    const items = fs.readdirSync(dirPath);
    const files = [];
    const directories = [];
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stats = fs.statSync(fullPath);
      
      if (stats.isFile()) {
        files.push({ name: item, path: fullPath, size: stats.size });
      } else if (stats.isDirectory()) {
        directories.push({ name: item, path: fullPath });
      }
    }
    
    return { success: true, files, directories };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Enhanced machine fingerprinting IPC handlers
ipcMain.handle('get-machine-fingerprint', async () => {
  try {
    const os = require('os');
    const crypto = require('crypto');
    const { execSync } = require('child_process');
    const fs = require('fs');
    const path = require('path');

    // Get system information
    const platform = os.platform();
    const arch = os.arch();
    const hostname = os.hostname();
    const cpus = os.cpus();
    const totalMem = os.totalmem();
    const networkInterfaces = os.networkInterfaces();

    // Get hardware-specific information
    let hardwareInfo = {
      cpuModel: cpus[0]?.model || 'unknown',
      cpuCores: cpus.length,
      totalMemory: totalMem,
      macAddresses: [],
      diskInfo: [],
      machineGuid: null,
      biosSerial: null
    };

    // Get MAC addresses from network interfaces
    Object.keys(networkInterfaces).forEach(interfaceName => {
      const interfaces = networkInterfaces[interfaceName];
      interfaces.forEach(netInterface => {
        if (netInterface.mac && netInterface.mac !== '00:00:00:00:00:00') {
          hardwareInfo.macAddresses.push(netInterface.mac);
        }
      });
    });

    // Platform-specific hardware information
    if (platform === 'win32') {
      try {
        // Get Windows Machine GUID
        const machineGuid = execSync('reg query "HKLM\\SOFTWARE\\Microsoft\\Cryptography" /v MachineGuid', { encoding: 'utf8' });
        const guidMatch = machineGuid.match(/MachineGuid\s+REG_SZ\s+([a-f0-9-]+)/i);
        if (guidMatch) {
          hardwareInfo.machineGuid = guidMatch[1];
        }

        // Get BIOS Serial Number
        const biosSerial = execSync('wmic bios get serialnumber', { encoding: 'utf8' });
        const serialMatch = biosSerial.match(/SerialNumber\s+([^\r\n]+)/);
        if (serialMatch && serialMatch[1].trim() !== '') {
          hardwareInfo.biosSerial = serialMatch[1].trim();
        }

        // Get disk serial numbers
        const diskInfo = execSync('wmic diskdrive get serialnumber,size', { encoding: 'utf8' });
        const diskLines = diskInfo.split('\n').slice(1);
        diskLines.forEach(line => {
          const parts = line.trim().split(/\s+/);
          if (parts.length >= 2) {
            hardwareInfo.diskInfo.push({
              serial: parts[0],
              size: parts[1]
            });
          }
        });
      } catch (error) {
        console.error('Error getting Windows hardware info:', error);
      }
    } else if (platform === 'darwin') {
      try {
        // Get macOS hardware UUID
        const hardwareUUID = execSync('system_profiler SPHardwareDataType | grep "Hardware UUID"', { encoding: 'utf8' });
        const uuidMatch = hardwareUUID.match(/Hardware UUID:\s+([a-f0-9-]+)/i);
        if (uuidMatch) {
          hardwareInfo.machineGuid = uuidMatch[1];
        }

        // Get macOS serial number
        const serialNumber = execSync('system_profiler SPHardwareDataType | grep "Serial Number"', { encoding: 'utf8' });
        const serialMatch = serialNumber.match(/Serial Number:\s+([^\r\n]+)/);
        if (serialMatch) {
          hardwareInfo.biosSerial = serialMatch[1].trim();
        }
      } catch (error) {
        console.error('Error getting macOS hardware info:', error);
      }
    } else if (platform === 'linux') {
      try {
        // Get Linux machine ID
        if (fs.existsSync('/etc/machine-id')) {
          hardwareInfo.machineGuid = fs.readFileSync('/etc/machine-id', 'utf8').trim();
        }

        // Get Linux product UUID
        if (fs.existsSync('/sys/class/dmi/id/product_uuid')) {
          const productUUID = fs.readFileSync('/sys/class/dmi/id/product_uuid', 'utf8').trim();
          if (productUUID) {
            hardwareInfo.biosSerial = productUUID;
          }
        }

        // Get disk information
        const diskInfo = execSync('lsblk -d -o SERIAL,SIZE', { encoding: 'utf8' });
        const diskLines = diskInfo.split('\n').slice(1);
        diskLines.forEach(line => {
          const parts = line.trim().split(/\s+/);
          if (parts.length >= 2) {
            hardwareInfo.diskInfo.push({
              serial: parts[0],
              size: parts[1]
            });
          }
        });
      } catch (error) {
        console.error('Error getting Linux hardware info:', error);
      }
    }

    // Create unique machine string
    const machineString = JSON.stringify({
      platform,
      arch,
      hostname,
      hardwareInfo,
      timestamp: Date.now()
    });

    // Generate SHA256 hash
    const hash = crypto.createHash('sha256').update(machineString).digest('hex');
    const machineId = hash.substring(0, 16);

    return {
      success: true,
      fingerprint: {
        machineId,
        platform,
        arch,
        hostname,
        timestamp: Date.now(),
        hash,
        hardwareInfo
      }
    };
  } catch (error) {
    console.error('Error generating machine fingerprint:', error);
    return {
      success: false,
      error: error.message
    };
  }
});

ipcMain.handle('validate-machine-fingerprint', async (event, fingerprint) => {
  try {
    const os = require('os');
    const crypto = require('crypto');

    // Basic validation
    if (!fingerprint || !fingerprint.machineId || !fingerprint.platform || !fingerprint.arch) {
      return { success: false, error: 'Invalid fingerprint format' };
    }

    // Check if machine ID format is valid
    if (!/^[a-f0-9]{16}$/.test(fingerprint.machineId)) {
      return { success: false, error: 'Invalid machine ID format' };
    }

    // Check if platform matches current system
    if (fingerprint.platform !== os.platform()) {
      return { success: false, error: 'Platform mismatch' };
    }

    // Check if architecture matches current system
    if (fingerprint.arch !== os.arch()) {
      return { success: false, error: 'Architecture mismatch' };
    }

    // Check if hostname matches current system
    if (fingerprint.hostname !== os.hostname()) {
      return { success: false, error: 'Hostname mismatch' };
    }

    // Check timestamp validity (not too old, not in future)
    const now = Date.now();
    const maxAge = 365 * 24 * 60 * 60 * 1000; // 1 year
    if (fingerprint.timestamp < now - maxAge || fingerprint.timestamp > now + 24 * 60 * 60 * 1000) {
      return { success: false, error: 'Invalid timestamp' };
    }

    return { success: true, isValid: true };
  } catch (error) {
    console.error('Error validating machine fingerprint:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('compare-machine-fingerprints', async (event, fp1, fp2) => {
  try {
    if (!fp1 || !fp2) {
      return { success: false, error: 'Invalid fingerprints' };
    }

    // Compare machine IDs
    const machineIdMatch = fp1.machineId === fp2.machineId;
    
    // Compare platform and architecture
    const systemMatch = fp1.platform === fp2.platform && fp1.arch === fp2.arch;
    
    // Compare hostname
    const hostnameMatch = fp1.hostname === fp2.hostname;

    // Compare hardware information if available
    let hardwareMatch = false;
    if (fp1.hardwareInfo && fp2.hardwareInfo) {
      hardwareMatch = JSON.stringify(fp1.hardwareInfo) === JSON.stringify(fp2.hardwareInfo);
    }

    const isSameMachine = machineIdMatch && systemMatch && hostnameMatch;

    return {
      success: true,
      isSameMachine,
      details: {
        machineIdMatch,
        systemMatch,
        hostnameMatch,
        hardwareMatch
      }
    };
  } catch (error) {
    console.error('Error comparing machine fingerprints:', error);
    return { success: false, error: error.message };
  }
});

// Handle app activation (macOS)
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Security: Prevent new window creation
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    event.preventDefault();
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
