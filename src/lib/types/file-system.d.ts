// File System Access API TypeScript definitions
declare global {
  interface Window {
    showOpenFilePicker(options?: {
      multiple?: boolean;
      types?: Array<{
        description: string;
        accept: Record<string, string[]>;
      }>;
    }): Promise<FileSystemFileHandle[]>;
    
    showSaveFilePicker(options?: {
      suggestedName?: string;
      types?: Array<{
        description: string;
        accept: Record<string, string[]>;
      }>;
    }): Promise<FileSystemFileHandle>;
    
    // Enhanced Electron API for file operations
    electronAPI: {
      // Database operations
      dbInit: () => Promise<any>;
      dbQuery: (query: string, params: any[]) => Promise<any>;
      
      // File operations
      showOpenDialog: (options: any) => Promise<any>;
      showSaveDialog: (options: any) => Promise<any>;
      
      // Enhanced file operations
      readLicenseFile: (filePath: string) => Promise<{ success: boolean; content?: string; error?: string }>;
      writeLicenseFile: (filePath: string, content: string) => Promise<{ success: boolean; error?: string }>;
      fileExists: (filePath: string) => Promise<{ success: boolean; exists: boolean; error?: string }>;
      readFileContent: (filePath: string) => Promise<{ success: boolean; content?: string; error?: string }>;
      writeFileContent: (filePath: string, content: string) => Promise<{ success: boolean; error?: string }>;
      listDirectory: (dirPath: string) => Promise<{ 
        success: boolean; 
        files?: Array<{ name: string; path: string; size: number }>;
        directories?: Array<{ name: string; path: string }>;
        error?: string 
      }>;
      getAppDataPath: () => Promise<string>;
      getDocumentsPath: () => Promise<string>;
      
      // Enhanced machine fingerprinting
      getMachineFingerprint: () => Promise<{
        success: boolean;
        fingerprint?: {
          machineId: string;
          platform: string;
          arch: string;
          hostname: string;
          timestamp: number;
          hash: string;
          hardwareInfo: {
            cpuModel: string;
            cpuCores: number;
            totalMemory: number;
            macAddresses: string[];
            diskInfo: Array<{ serial: string; size: string }>;
            machineGuid: string | null;
            biosSerial: string | null;
          };
        };
        error?: string;
      }>;
      validateMachineFingerprint: (fingerprint: any) => Promise<{
        success: boolean;
        isValid?: boolean;
        error?: string;
      }>;
      compareMachineFingerprints: (fp1: any, fp2: any) => Promise<{
        success: boolean;
        isSameMachine?: boolean;
        details?: {
          machineIdMatch: boolean;
          systemMatch: boolean;
          hostnameMatch: boolean;
          hardwareMatch: boolean;
        };
        error?: string;
      }>;
      
      // App information
      getAppVersion: () => string;
      getNodeVersion: () => string;
      getChromeVersion: () => string;
      
      // Platform information
      platform: string;
      isDev: boolean;
      
      // Window controls
      minimize: () => void;
      maximize: () => void;
      close: () => void;
      
      // Listeners
      onWindowStateChange: (callback: (event: any, data: any) => void) => void;
      
      // Remove listeners
      removeAllListeners: (channel: string) => void;
    };
  }
}

interface FileSystemFileHandle {
  getFile(): Promise<File>;
  createWritable(options?: FileSystemCreateWritableOptions): Promise<FileSystemWritableFileStream>;
}

interface FileSystemCreateWritableOptions {
  keepExistingData?: boolean;
}

interface FileSystemWritableFileStream extends WritableStream {
  write(data: FileSystemWriteChunkType): Promise<void>;
  seek(position: number): Promise<void>;
  truncate(size: number): Promise<void>;
}

type FileSystemWriteChunkType = BufferSource | Blob | string;

export {};
