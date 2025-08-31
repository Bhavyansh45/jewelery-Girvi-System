// File upload and file system operations utility
interface FileInfo {
  name: string;
  path: string;
  size: number;
  type: string;
  lastModified: Date;
}

interface UploadOptions {
  multiple?: boolean;
  filters?: Array<{ name: string; extensions: string[] }>;
  title?: string;
  defaultPath?: string;
}

export class FileUploadManager {
  private static instance: FileUploadManager;

  private constructor() {}

  static getInstance(): FileUploadManager {
    if (!FileUploadManager.instance) {
      FileUploadManager.instance = new FileUploadManager();
    }
    return FileUploadManager.instance;
  }

  async selectFiles(options: UploadOptions = {}): Promise<FileInfo[]> {
    try {
      const result = await window.electronAPI.showOpenDialog({
        properties: options.multiple ? ['openFile', 'multiSelections'] : ['openFile'],
        filters: options.filters || [
          { name: 'All Files', extensions: ['*'] }
        ],
        title: options.title || 'Select Files'
      });

      if (result.canceled || !result.filePaths.length) {
        return [];
      }

      const files: FileInfo[] = [];
      for (const filePath of result.filePaths) {
        const fileInfo = await this.getFileInfo(filePath);
        if (fileInfo) {
          files.push(fileInfo);
        }
      }

      return files;
    } catch (error) {
      console.error('Error selecting files:', error);
      return [];
    }
  }

  async selectImageFiles(multiple: boolean = false): Promise<FileInfo[]> {
    return await this.selectFiles({
      multiple,
      filters: [
        { name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'] },
        { name: 'All Files', extensions: ['*'] }
      ],
      title: 'Select Image Files'
    });
  }

  async selectDocumentFiles(multiple: boolean = false): Promise<FileInfo[]> {
    return await this.selectFiles({
      multiple,
      filters: [
        { name: 'Documents', extensions: ['pdf', 'doc', 'docx', 'txt', 'rtf'] },
        { name: 'All Files', extensions: ['*'] }
      ],
      title: 'Select Document Files'
    });
  }

  async selectExcelFiles(multiple: boolean = false): Promise<FileInfo[]> {
    return await this.selectFiles({
      multiple,
      filters: [
        { name: 'Excel Files', extensions: ['xlsx', 'xls', 'csv'] },
        { name: 'All Files', extensions: ['*'] }
      ],
      title: 'Select Excel Files'
    });
  }

  async saveFile(content: string, options: UploadOptions = {}): Promise<string | null> {
    try {
      const result = await window.electronAPI.showSaveDialog({
        filters: options.filters || [
          { name: 'All Files', extensions: ['*'] }
        ],
        defaultPath: options.defaultPath || 'untitled.txt',
        title: options.title || 'Save File'
      });

      if (result.canceled || !result.filePath) {
        return null;
      }

      const success = await window.electronAPI.writeFileContent(result.filePath, content);
      return success ? result.filePath : null;
    } catch (error) {
      console.error('Error saving file:', error);
      return null;
    }
  }

  async readFile(filePath: string): Promise<string | null> {
    try {
      const result = await window.electronAPI.readFileContent(filePath);
      return result.success ? result.content : null;
    } catch (error) {
      console.error('Error reading file:', error);
      return null;
    }
  }

  async copyFile(sourcePath: string, destinationPath: string): Promise<boolean> {
    try {
      const content = await this.readFile(sourcePath);
      if (content === null) {
        return false;
      }

      const success = await window.electronAPI.writeFileContent(destinationPath, content);
      return success;
    } catch (error) {
      console.error('Error copying file:', error);
      return false;
    }
  }

  async getFileInfo(filePath: string): Promise<FileInfo | null> {
    try {
      const result = await window.electronAPI.listDirectory(filePath);
      if (result.success) {
        // This is a directory, not a file
        return null;
      }
    } catch (error) {
      // This means it's a file, continue with file operations
    }

    try {
      const content = await this.readFile(filePath);
      if (content === null) {
        return null;
      }

      // Extract file info from path
      const pathParts = filePath.split(/[/\\]/);
      const fileName = pathParts[pathParts.length - 1];
      const fileExtension = fileName.split('.').pop() || '';

      return {
        name: fileName,
        path: filePath,
        size: content.length,
        type: this.getMimeType(fileExtension),
        lastModified: new Date()
      };
    } catch (error) {
      console.error('Error getting file info:', error);
      return null;
    }
  }

  async listDirectory(dirPath: string): Promise<{ files: FileInfo[]; directories: string[] }> {
    try {
      const result = await window.electronAPI.listDirectory(dirPath);
      if (result.success) {
        return {
          files: result.files.map(file => ({
            name: file.name,
            path: file.path,
            size: file.size,
            type: this.getMimeType(file.name.split('.').pop() || ''),
            lastModified: new Date()
          })),
          directories: result.directories.map(dir => dir.name)
        };
      }
      return { files: [], directories: [] };
    } catch (error) {
      console.error('Error listing directory:', error);
      return { files: [], directories: [] };
    }
  }

  async getAppDataPath(): Promise<string> {
    return await window.electronAPI.getAppDataPath();
  }

  async getDocumentsPath(): Promise<string> {
    return await window.electronAPI.getDocumentsPath();
  }

  private getMimeType(extension: string): string {
    const mimeTypes: { [key: string]: string } = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'bmp': 'image/bmp',
      'webp': 'image/webp',
      'pdf': 'application/pdf',
      'doc': 'application/msword',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'txt': 'text/plain',
      'rtf': 'application/rtf',
      'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'xls': 'application/vnd.ms-excel',
      'csv': 'text/csv',
      'json': 'application/json',
      'xml': 'application/xml',
      'html': 'text/html',
      'css': 'text/css',
      'js': 'application/javascript',
      'ts': 'application/typescript'
    };

    return mimeTypes[extension.toLowerCase()] || 'application/octet-stream';
  }

  // Utility method for handling file uploads in forms
  async handleFileUpload(
    event: React.ChangeEvent<HTMLInputElement>,
    options: UploadOptions = {}
  ): Promise<FileInfo[]> {
    const files = event.target.files;
    if (!files || files.length === 0) {
      return [];
    }

    const fileInfos: FileInfo[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      fileInfos.push({
        name: file.name,
        path: file.name, // Note: In web context, we don't have full path
        size: file.size,
        type: file.type,
        lastModified: new Date(file.lastModified)
      });
    }

    return fileInfos;
  }
}

// Export singleton instance
export const fileUploadManager = FileUploadManager.getInstance();
