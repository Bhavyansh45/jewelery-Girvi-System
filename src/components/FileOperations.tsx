import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  Download, 
  FileText, 
  Image, 
  FileSpreadsheet,
  FolderOpen,
  Save,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { licenseFileManager } from '@/lib/utils/licenseFile';
import { fileUploadManager } from '@/lib/utils/fileUpload';

const FileOperations: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<any[]>([]);
  const [licenseData, setLicenseData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // License file operations
  const handleSelectLicenseFile = async () => {
    setIsLoading(true);
    try {
      const license = await licenseFileManager.selectLicenseFile();
      if (license) {
        setLicenseData(license);
        toast.success('License file loaded successfully!');
      } else {
        toast.error('No license file selected');
      }
    } catch (error) {
      toast.error('Failed to load license file');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveLicenseFile = async () => {
    if (!licenseData) {
      toast.error('No license data to save');
      return;
    }

    setIsLoading(true);
    try {
      const success = await licenseFileManager.saveLicenseToAppData(licenseData);
      if (success) {
        toast.success('License saved to app data!');
      } else {
        toast.error('Failed to save license');
      }
    } catch (error) {
      toast.error('Failed to save license file');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportLicenseFile = async () => {
    if (!licenseData) {
      toast.error('No license data to export');
      return;
    }

    setIsLoading(true);
    try {
      const success = await licenseFileManager.exportLicenseFile(licenseData);
      if (success) {
        toast.success('License exported successfully!');
      } else {
        toast.error('Failed to export license');
      }
    } catch (error) {
      toast.error('Failed to export license file');
    } finally {
      setIsLoading(false);
    }
  };

  // File upload operations
  const handleSelectImages = async () => {
    setIsLoading(true);
    try {
      const files = await fileUploadManager.selectImageFiles(true);
      setSelectedFiles(files);
      toast.success(`Selected ${files.length} image files`);
    } catch (error) {
      toast.error('Failed to select image files');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectDocuments = async () => {
    setIsLoading(true);
    try {
      const files = await fileUploadManager.selectDocumentFiles(true);
      setSelectedFiles(files);
      toast.success(`Selected ${files.length} document files`);
    } catch (error) {
      toast.error('Failed to select document files');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectExcelFiles = async () => {
    setIsLoading(true);
    try {
      const files = await fileUploadManager.selectExcelFiles(true);
      setSelectedFiles(files);
      toast.success(`Selected ${files.length} Excel files`);
    } catch (error) {
      toast.error('Failed to select Excel files');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBrowseDirectory = async () => {
    setIsLoading(true);
    try {
      const documentsPath = await fileUploadManager.getDocumentsPath();
      const result = await fileUploadManager.listDirectory(documentsPath);
      toast.success(`Found ${result.files.length} files and ${result.directories.length} directories`);
    } catch (error) {
      toast.error('Failed to browse directory');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveTextFile = async () => {
    setIsLoading(true);
    try {
      const content = 'This is a test file created by the Jewelry Girvi System.\n\nCreated on: ' + new Date().toISOString();
      const filePath = await fileUploadManager.saveFile(content, {
        filters: [{ name: 'Text Files', extensions: ['txt'] }],
        defaultPath: 'test_file.txt',
        title: 'Save Test File'
      });
      
      if (filePath) {
        toast.success(`File saved to: ${filePath}`);
      } else {
        toast.error('Failed to save file');
      }
    } catch (error) {
      toast.error('Failed to save text file');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">File Operations Demo</h1>
      
      {/* License File Operations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            License File Operations
          </CardTitle>
          <CardDescription>
            Test license file reading, writing, and validation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button 
              onClick={handleSelectLicenseFile} 
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <FolderOpen className="h-4 w-4" />
              Select License File
            </Button>
            <Button 
              onClick={handleSaveLicenseFile} 
              disabled={isLoading || !licenseData}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save to App Data
            </Button>
            <Button 
              onClick={handleExportLicenseFile} 
              disabled={isLoading || !licenseData}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export License
            </Button>
          </div>
          
          {licenseData && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2">License Data:</h4>
              <pre className="text-sm overflow-auto">
                {JSON.stringify(licenseData, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>

      {/* File Upload Operations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            File Upload Operations
          </CardTitle>
          <CardDescription>
            Test different types of file selection and upload
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Button 
              onClick={handleSelectImages} 
              disabled={isLoading}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Image className="h-4 w-4" />
              Select Images
            </Button>
            <Button 
              onClick={handleSelectDocuments} 
              disabled={isLoading}
              variant="outline"
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Select Documents
            </Button>
            <Button 
              onClick={handleSelectExcelFiles} 
              disabled={isLoading}
              variant="outline"
              className="flex items-center gap-2"
            >
              <FileSpreadsheet className="h-4 w-4" />
              Select Excel Files
            </Button>
            <Button 
              onClick={handleBrowseDirectory} 
              disabled={isLoading}
              variant="outline"
              className="flex items-center gap-2"
            >
              <FolderOpen className="h-4 w-4" />
              Browse Directory
            </Button>
            <Button 
              onClick={handleSaveTextFile} 
              disabled={isLoading}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save Text File
            </Button>
          </div>
          
          {selectedFiles.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold">Selected Files:</h4>
              <div className="space-y-2">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <div className="flex-1">
                      <div className="font-medium">{file.name}</div>
                      <div className="text-sm text-gray-500">
                        {file.path} • {(file.size / 1024).toFixed(1)} KB
                      </div>
                    </div>
                    <Badge variant="secondary">{file.type}</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Status */}
      {isLoading && (
        <div className="flex items-center gap-2 text-blue-600">
          <AlertTriangle className="h-4 w-4 animate-spin" />
          Processing...
        </div>
      )}
    </div>
  );
};

export default FileOperations;
