import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Cpu, 
  Memory, 
  HardDrive, 
  Network, 
  Monitor,
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Copy,
  Download
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { 
  generateMachineFingerprint, 
  getHardwareInfo, 
  getMachineDescription,
  hasMachineChanged,
  MachineFingerprint,
  HardwareInfo
} from '@/lib/auth/machine';

const MachineFingerprintDemo: React.FC = () => {
  const [currentFingerprint, setCurrentFingerprint] = useState<MachineFingerprint | null>(null);
  const [hardwareInfo, setHardwareInfo] = useState<HardwareInfo | null>(null);
  const [machineDescription, setMachineDescription] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [storedFingerprint, setStoredFingerprint] = useState<MachineFingerprint | null>(null);
  const [machineChangeStatus, setMachineChangeStatus] = useState<any>(null);

  useEffect(() => {
    generateFingerprint();
  }, []);

  const generateFingerprint = async () => {
    setIsLoading(true);
    try {
      const fingerprint = await generateMachineFingerprint();
      setCurrentFingerprint(fingerprint);
      
      const hwInfo = await getHardwareInfo();
      setHardwareInfo(hwInfo);
      
      const description = await getMachineDescription();
      setMachineDescription(description);
      
      toast.success('Machine fingerprint generated successfully!');
    } catch (error) {
      console.error('Error generating fingerprint:', error);
      toast.error('Failed to generate machine fingerprint');
    } finally {
      setIsLoading(false);
    }
  };

  const storeCurrentFingerprint = () => {
    if (currentFingerprint) {
      setStoredFingerprint(currentFingerprint);
      toast.success('Current fingerprint stored for comparison');
    }
  };

  const checkMachineChange = async () => {
    if (!storedFingerprint) {
      toast.error('No stored fingerprint to compare against');
      return;
    }

    setIsLoading(true);
    try {
      const changeStatus = await hasMachineChanged(storedFingerprint);
      setMachineChangeStatus(changeStatus);
      
      if (changeStatus.changed) {
        toast.error(`Machine has changed: ${changeStatus.reason}`);
      } else {
        toast.success('Machine fingerprint is consistent');
      }
    } catch (error) {
      console.error('Error checking machine change:', error);
      toast.error('Failed to check machine change');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const exportFingerprint = () => {
    if (!currentFingerprint) return;
    
    const dataStr = JSON.stringify(currentFingerprint, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `machine-fingerprint-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Fingerprint exported successfully');
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Machine Fingerprint Demo</h1>
        <div className="flex gap-2">
          <Button 
            onClick={generateFingerprint} 
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Generate Fingerprint
          </Button>
          <Button 
            onClick={exportFingerprint} 
            disabled={!currentFingerprint}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Machine Description */}
      {machineDescription && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              Machine Description
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium">{machineDescription}</p>
          </CardContent>
        </Card>
      )}

      {/* Current Fingerprint */}
      {currentFingerprint && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Current Machine Fingerprint
            </CardTitle>
            <CardDescription>
              Unique identifier generated from hardware and system characteristics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Machine ID</label>
                <div className="flex items-center gap-2 mt-1">
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                    {currentFingerprint.machineId}
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(currentFingerprint.machineId)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Platform</label>
                <div className="mt-1">
                  <Badge variant="secondary">{currentFingerprint.platform}</Badge>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Architecture</label>
                <div className="mt-1">
                  <Badge variant="secondary">{currentFingerprint.arch}</Badge>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Hostname</label>
                <div className="mt-1">
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                    {currentFingerprint.hostname}
                  </code>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={storeCurrentFingerprint}
                variant="outline"
                size="sm"
              >
                Store for Comparison
              </Button>
              <Button 
                onClick={checkMachineChange}
                disabled={!storedFingerprint || isLoading}
                variant="outline"
                size="sm"
              >
                Check for Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Hardware Information */}
      {hardwareInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="h-5 w-5" />
              Hardware Information
            </CardTitle>
            <CardDescription>
              Detailed hardware characteristics used in fingerprint generation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* CPU Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                  <Cpu className="h-4 w-4" />
                  CPU Model
                </label>
                <div className="mt-1">
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                    {hardwareInfo.cpuModel}
                  </code>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">CPU Cores</label>
                <div className="mt-1">
                  <Badge variant="secondary">{hardwareInfo.cpuCores} cores</Badge>
                </div>
              </div>
            </div>

            {/* Memory Information */}
            <div>
              <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                <Memory className="h-4 w-4" />
                Total Memory
              </label>
              <div className="mt-1">
                <Badge variant="secondary">{formatBytes(hardwareInfo.totalMemory)}</Badge>
              </div>
            </div>

            {/* MAC Addresses */}
            {hardwareInfo.macAddresses.length > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                  <Network className="h-4 w-4" />
                  Network Interfaces
                </label>
                <div className="mt-1 space-y-1">
                  {hardwareInfo.macAddresses.map((mac, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                        {mac}
                      </code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(mac)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Disk Information */}
            {hardwareInfo.diskInfo.length > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                  <HardDrive className="h-4 w-4" />
                  Disk Drives
                </label>
                <div className="mt-1 space-y-1">
                  {hardwareInfo.diskInfo.map((disk, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                        {disk.serial} ({disk.size})
                      </code>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Machine GUID */}
            {hardwareInfo.machineGuid && (
              <div>
                <label className="text-sm font-medium text-gray-500">Machine GUID</label>
                <div className="mt-1 flex items-center gap-2">
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                    {hardwareInfo.machineGuid}
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(hardwareInfo.machineGuid!)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}

            {/* BIOS Serial */}
            {hardwareInfo.biosSerial && (
              <div>
                <label className="text-sm font-medium text-gray-500">BIOS Serial</label>
                <div className="mt-1 flex items-center gap-2">
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                    {hardwareInfo.biosSerial}
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(hardwareInfo.biosSerial!)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Machine Change Status */}
      {machineChangeStatus && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {machineChangeStatus.changed ? (
                <XCircle className="h-5 w-5 text-red-500" />
              ) : (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
              Machine Change Detection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant={machineChangeStatus.changed ? "destructive" : "default"}>
                  {machineChangeStatus.changed ? "Changed" : "Consistent"}
                </Badge>
                {machineChangeStatus.reason && (
                  <span className="text-sm text-gray-600">{machineChangeStatus.reason}</span>
                )}
              </div>
              
              {machineChangeStatus.details && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Change Details:</h4>
                  <div className="space-y-1 text-sm">
                    {Object.entries(machineChangeStatus.details).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-2">
                        <span className="font-medium">{key}:</span>
                        {typeof value === 'boolean' ? (
                          <Badge variant={value ? "default" : "destructive"}>
                            {value ? "Match" : "Mismatch"}
                          </Badge>
                        ) : (
                          <span>{String(value)}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Status */}
      {isLoading && (
        <div className="flex items-center gap-2 text-blue-600">
          <RefreshCw className="h-4 w-4 animate-spin" />
          Processing...
        </div>
      )}
    </div>
  );
};

export default MachineFingerprintDemo;
