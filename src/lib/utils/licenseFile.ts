// License file operations utility
interface LicenseFileData {
  licenseKey: string;
  machineId: string;
  expiryDate: string;
  features: string[];
  signature: string;
}

export class LicenseFileManager {
  private static instance: LicenseFileManager;
  private appDataPath: string | null = null;

  private constructor() {}

  static getInstance(): LicenseFileManager {
    if (!LicenseFileManager.instance) {
      LicenseFileManager.instance = new LicenseFileManager();
    }
    return LicenseFileManager.instance;
  }

  async initialize(): Promise<void> {
    try {
      this.appDataPath = await window.electronAPI.getAppDataPath();
    } catch (error) {
      console.error('Failed to get app data path:', error);
    }
  }

  async readLicenseFile(filePath: string): Promise<LicenseFileData | null> {
    try {
      const result = await window.electronAPI.readLicenseFile(filePath);
      if (result.success) {
        return JSON.parse(result.content);
      }
      return null;
    } catch (error) {
      console.error('Error reading license file:', error);
      return null;
    }
  }

  async writeLicenseFile(filePath: string, data: LicenseFileData): Promise<boolean> {
    try {
      const content = JSON.stringify(data, null, 2);
      const result = await window.electronAPI.writeLicenseFile(filePath, content);
      return result.success;
    } catch (error) {
      console.error('Error writing license file:', error);
      return false;
    }
  }

  async saveLicenseToAppData(licenseData: LicenseFileData): Promise<boolean> {
    if (!this.appDataPath) {
      await this.initialize();
    }
    
    const licensePath = `${this.appDataPath}/license.json`;
    return await this.writeLicenseFile(licensePath, licenseData);
  }

  async loadLicenseFromAppData(): Promise<LicenseFileData | null> {
    if (!this.appDataPath) {
      await this.initialize();
    }
    
    const licensePath = `${this.appDataPath}/license.json`;
    const exists = await window.electronAPI.fileExists(licensePath);
    
    if (exists) {
      return await this.readLicenseFile(licensePath);
    }
    
    return null;
  }

  async selectLicenseFile(): Promise<LicenseFileData | null> {
    try {
      const result = await window.electronAPI.showOpenDialog({
        properties: ['openFile'],
        filters: [
          { name: 'License Files', extensions: ['lic', 'json', 'txt'] },
          { name: 'All Files', extensions: ['*'] }
        ],
        title: 'Select License File'
      });

      if (!result.canceled && result.filePaths.length > 0) {
        return await this.readLicenseFile(result.filePaths[0]);
      }
      
      return null;
    } catch (error) {
      console.error('Error selecting license file:', error);
      return null;
    }
  }

  async exportLicenseFile(licenseData: LicenseFileData): Promise<boolean> {
    try {
      const result = await window.electronAPI.showSaveDialog({
        filters: [
          { name: 'License Files', extensions: ['lic'] },
          { name: 'JSON Files', extensions: ['json'] },
          { name: 'All Files', extensions: ['*'] }
        ],
        defaultPath: `license_${new Date().toISOString().split('T')[0]}.lic`,
        title: 'Save License File'
      });

      if (!result.canceled && result.filePath) {
        return await this.writeLicenseFile(result.filePath, licenseData);
      }
      
      return false;
    } catch (error) {
      console.error('Error exporting license file:', error);
      return false;
    }
  }

  async validateLicenseFile(filePath: string): Promise<{ valid: boolean; error?: string }> {
    try {
      const licenseData = await this.readLicenseFile(filePath);
      
      if (!licenseData) {
        return { valid: false, error: 'Invalid license file format' };
      }

      // Basic validation
      if (!licenseData.licenseKey || !licenseData.expiryDate) {
        return { valid: false, error: 'Missing required license fields' };
      }

      // Check expiry
      const expiryDate = new Date(licenseData.expiryDate);
      if (expiryDate < new Date()) {
        return { valid: false, error: 'License has expired' };
      }

      return { valid: true };
    } catch (error) {
      return { valid: false, error: 'Failed to validate license file' };
    }
  }
}

// Export singleton instance
export const licenseFileManager = LicenseFileManager.getInstance();
