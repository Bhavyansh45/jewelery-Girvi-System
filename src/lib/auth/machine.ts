// Enhanced machine identification utilities for Electron
export interface HardwareInfo {
  cpuModel: string;
  cpuCores: number;
  totalMemory: number;
  macAddresses: string[];
  diskInfo: Array<{ serial: string; size: string }>;
  machineGuid: string | null;
  biosSerial: string | null;
}

export interface MachineFingerprint {
  machineId: string;
  platform: string;
  arch: string;
  hostname: string;
  timestamp: number;
  hash: string;
  hardwareInfo: HardwareInfo;
}

/**
 * Generate a SHA256 hash using Web Crypto API
 */
async function sha256Hash(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Generate a unique machine fingerprint using Electron's Node.js capabilities
 * This creates a hash based on real system and hardware characteristics
 */
export async function generateMachineFingerprint(): Promise<MachineFingerprint> {
  try {
    // Use Electron's enhanced machine fingerprinting
    const result = await window.electronAPI.getMachineFingerprint();
    
    if (result.success && result.fingerprint) {
      return result.fingerprint;
    } else {
      throw new Error(result.error || 'Failed to generate machine fingerprint');
    }
  } catch (error) {
    console.error('Error generating machine fingerprint:', error);
    
    // Fallback to basic browser-based fingerprinting
    const platform = navigator.platform || 'unknown';
    const arch = navigator.userAgent.includes('x86_64') ? 'x64' : 
                 navigator.userAgent.includes('x86') ? 'x86' : 
                 navigator.userAgent.includes('arm64') ? 'arm64' : 
                 navigator.userAgent.includes('arm') ? 'arm' : 'unknown';
    const hostname = window.location.hostname || 'localhost';
    const timestamp = Date.now();
    
    // Create a unique string combining system characteristics
    const machineString = `${platform}-${arch}-${hostname}-${timestamp}`;
    
    // Generate SHA256 hash using Web Crypto API
    const hash = await sha256Hash(machineString);
    
    // Use first 16 characters of hash as machine ID
    const machineId = hash.substring(0, 16);
    
    return {
      machineId,
      platform,
      arch,
      hostname,
      timestamp,
      hash,
      hardwareInfo: {
        cpuModel: 'unknown',
        cpuCores: 0,
        totalMemory: 0,
        macAddresses: [],
        diskInfo: [],
        machineGuid: null,
        biosSerial: null
      }
    };
  }
}

/**
 * Get the current machine fingerprint
 */
export async function getCurrentMachineFingerprint(): Promise<MachineFingerprint> {
  return generateMachineFingerprint();
}

/**
 * Validate a machine fingerprint using Electron's enhanced validation
 */
export async function validateMachineFingerprint(fingerprint: MachineFingerprint): Promise<boolean> {
  try {
    // Use Electron's enhanced validation
    const result = await window.electronAPI.validateMachineFingerprint(fingerprint);
    
    if (result.success) {
      return result.isValid ?? false;
    } else {
      console.error('Machine fingerprint validation error:', result.error);
      return false;
    }
  } catch (error) {
    console.error('Error validating machine fingerprint:', error);
    
    // Fallback to basic validation
    try {
      // Check if all required fields exist
      if (!fingerprint.machineId || !fingerprint.platform || !fingerprint.arch || !fingerprint.hostname) {
        return false;
      }
      
      // Check if machine ID is valid format (16 character hex)
      if (!/^[a-f0-9]{16}$/.test(fingerprint.machineId)) {
        return false;
      }
      
      // Check if timestamp is reasonable (not too old, not in future)
      const now = Date.now();
      const maxAge = 365 * 24 * 60 * 60 * 1000; // 1 year
      if (fingerprint.timestamp < now - maxAge || fingerprint.timestamp > now + 24 * 60 * 60 * 1000) {
        return false;
      }
      
      return true;
    } catch (fallbackError) {
      console.error('Error in fallback validation:', fallbackError);
      return false;
    }
  }
}

/**
 * Check if two machine fingerprints are from the same machine using enhanced comparison
 */
export async function isSameMachine(fp1: MachineFingerprint, fp2: MachineFingerprint): Promise<boolean> {
  try {
    // Use Electron's enhanced comparison
    const result = await window.electronAPI.compareMachineFingerprints(fp1, fp2);
    
    if (result.success) {
      return result.isSameMachine ?? false;
    } else {
      console.error('Machine fingerprint comparison error:', result.error);
      return false;
    }
  } catch (error) {
    console.error('Error comparing machine fingerprints:', error);
    
    // Fallback to basic comparison
    return fp1.machineId === fp2.machineId && 
           fp1.platform === fp2.platform && 
           fp1.arch === fp2.arch;
  }
}

/**
 * Get detailed hardware information
 */
export async function getHardwareInfo(): Promise<HardwareInfo | null> {
  try {
    const fingerprint = await generateMachineFingerprint();
    return fingerprint.hardwareInfo;
  } catch (error) {
    console.error('Error getting hardware info:', error);
    return null;
  }
}

/**
 * Get a human-readable machine description
 */
export async function getMachineDescription(): Promise<string> {
  try {
    const fingerprint = await generateMachineFingerprint();
    const hw = fingerprint.hardwareInfo;
    
    const parts = [
      fingerprint.platform,
      fingerprint.arch,
      hw.cpuModel,
      `${hw.cpuCores} cores`,
      `${Math.round(hw.totalMemory / (1024 * 1024 * 1024))}GB RAM`
    ];
    
    return parts.filter(Boolean).join(' - ');
  } catch (error) {
    console.error('Error getting machine description:', error);
    return 'Unknown Machine';
  }
}

/**
 * Check if the current machine has changed significantly
 */
export async function hasMachineChanged(storedFingerprint: MachineFingerprint): Promise<{
  changed: boolean;
  reason?: string;
  details?: any;
}> {
  try {
    const currentFingerprint = await generateMachineFingerprint();
    const result = await window.electronAPI.compareMachineFingerprints(storedFingerprint, currentFingerprint);
    
    if (result.success) {
      if (result.isSameMachine) {
        return { changed: false };
      } else {
        return {
          changed: true,
          reason: 'Machine fingerprint mismatch',
          details: result.details
        };
      }
    } else {
      return {
        changed: true,
        reason: 'Failed to compare fingerprints',
        details: { error: result.error }
      };
    }
  } catch (error) {
    console.error('Error checking machine change:', error);
    return {
      changed: true,
      reason: 'Error during machine comparison',
      details: { error: error instanceof Error ? error.message : String(error) }
    };
  }
}
