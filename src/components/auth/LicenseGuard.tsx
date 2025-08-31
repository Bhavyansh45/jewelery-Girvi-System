import React, { useState, useEffect, ReactNode } from 'react';
import { licenseValidationService } from '@/lib/auth/license';
import { initializeNetworkMonitoring } from '@/lib/auth/network';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Key, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  RefreshCw,
  Wifi,
  WifiOff,
  Shield,
  FileText,
  Download,
  Info
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface LicenseGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface LicenseStatus {
  isValid: boolean;
  isLoading: boolean;
  isOnline: boolean;
  licenseKey?: string;
  expiresIn?: number;
  error?: string;
  message?: string;
}

const LicenseGuard: React.FC<LicenseGuardProps> = ({ children, fallback }) => {
  const [licenseStatus, setLicenseStatus] = useState<LicenseStatus>({
    isValid: false,
    isLoading: true,
    isOnline: true
  });
  const [activationKey, setActivationKey] = useState('');
  const [isActivating, setIsActivating] = useState(false);
  const [showFileInfo, setShowFileInfo] = useState(false);

  useEffect(() => {
    initializeLicenseGuard();
  }, []);

  const initializeLicenseGuard = async () => {
    try {
      // Initialize network monitoring
      initializeNetworkMonitoring();
      
      // Check if we have a valid license
      const isValid = await licenseValidationService.isLicenseValid();
      
      if (isValid) {
        const currentLicense = licenseValidationService.getCurrentLicense();
        setLicenseStatus({
          isValid: true,
          isLoading: false,
          isOnline: true,
          licenseKey: currentLicense?.licenseKey,
          expiresIn: currentLicense ? 
            Math.ceil((new Date(currentLicense.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 
            undefined
        });
      } else {
        setLicenseStatus({
          isValid: false,
          isLoading: false,
          isOnline: true
        });
      }
    } catch (error) {
      console.error('Error initializing license guard:', error);
      setLicenseStatus({
        isValid: false,
        isLoading: false,
        isOnline: false,
        error: 'Initialization failed'
      });
    }
  };

  const handleActivateLicense = async () => {
    if (!activationKey.trim()) {
      toast.error('Please enter a license key');
      return;
    }

    setIsActivating(true);
    try {
      const result = await licenseValidationService.activateLicense(activationKey);
      
      if (result.isValid) {
        toast.success('License activated successfully!');
        setLicenseStatus({
          isValid: true,
          isLoading: false,
          isOnline: !result.isOffline,
          licenseKey: result.license?.licenseKey,
          expiresIn: result.expiresIn
        });
        
        // Show file information
        setShowFileInfo(true);
        
        // Clear activation key
        setActivationKey('');
      } else {
        toast.error(result.message || 'License activation failed');
      }
    } catch (error) {
      console.error('Error activating license:', error);
      toast.error('Failed to activate license');
    } finally {
      setIsActivating(false);
    }
  };

  const handleRefreshValidation = async () => {
    try {
      const result = await licenseValidationService.refreshValidation();
      if (result && result.isValid) {
        toast.success('License validation refreshed');
        await initializeLicenseGuard();
      } else {
        toast.error('License validation failed');
      }
    } catch (error) {
      console.error('Error refreshing validation:', error);
      toast.error('Failed to refresh validation');
    }
  };

  const handleDeactivateLicense = async () => {
    try {
      await licenseValidationService.deactivateLicense();
      toast.success('License deactivated successfully');
      setLicenseStatus({
        isValid: false,
        isLoading: false,
        isOnline: true
      });
      setShowFileInfo(false);
    } catch (error) {
      console.error('Error deactivating license:', error);
      toast.error('Failed to deactivate license');
    }
  };

  if (licenseStatus.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing license system...</p>
        </div>
      </div>
    );
  }

  if (!licenseStatus.isValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <Key className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">License Activation Required</CardTitle>
            <CardDescription>
              Please enter your license key to activate the Jewelry Girvi System
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Enter license key"
                value={activationKey}
                onChange={(e) => setActivationKey(e.target.value)}
                className="text-center text-lg font-mono"
                disabled={isActivating}
              />
            </div>
            
            <Button
              onClick={handleActivateLicense}
              disabled={isActivating || !activationKey.trim()}
              className="w-full"
            >
              {isActivating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Activating...
                </>
              ) : (
                <>
                  <Key className="mr-2 h-4 w-4" />
                  Activate License
                </>
              )}
            </Button>

            <div className="text-center text-sm text-gray-500">
              <p>Your license will be securely stored in an encrypted file</p>
              <p className="mt-1">File name: <code className="bg-gray-100 px-1 rounded">notdelete.dat</code></p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      {children}
      
      {/* License Status Banner */}
      <div className="fixed top-0 left-0 right-0 bg-green-600 text-white p-3 z-50">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">
              License Active: {licenseStatus.licenseKey}
            </span>
            {licenseStatus.expiresIn && (
              <Badge variant="secondary" className="ml-2">
                Expires in {licenseStatus.expiresIn} days
              </Badge>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefreshValidation}
              className="text-white hover:bg-green-700"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDeactivateLicense}
              className="text-white hover:bg-green-700"
            >
              <XCircle className="h-4 w-4 mr-1" />
              Deactivate
            </Button>
          </div>
        </div>
      </div>

      {/* File Information Modal */}
      {showFileInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                License File Created Successfully
              </CardTitle>
              <CardDescription>
                Your license has been encrypted and saved to a secure file
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Important Information</h4>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>• File name: <code className="bg-blue-100 px-1 rounded">notdelete.dat</code></li>
                  <li>• Location: Your application folder</li>
                  <li>• <strong>DO NOT DELETE</strong> this file</li>
                  <li>• Keep a backup of this file</li>
                  <li>• File is encrypted and machine-bound</li>
                </ul>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-900 mb-2">What Happens Next</h4>
                <p className="text-yellow-800 text-sm">
                  The system will automatically load your license from this file on startup. 
                  If you move or delete the file, you'll need to reactivate your license.
                </p>
              </div>

              <Button
                onClick={() => setShowFileInfo(false)}
                className="w-full"
              >
                Got it!
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default LicenseGuard;
