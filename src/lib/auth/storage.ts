// File-based encrypted storage utilities
import { FirebaseLicense } from '../firebase/admin';
import { MachineFingerprint, getCurrentMachineFingerprint } from './machine';

// Local license storage interface - updated to match Firebase structure
export interface LocalLicenseData {
  licenseKey: string;
  machineId: string;
  expiryDate: string;
  startDate: string;
  status: string;
  shopId: string;
  shopName: string;
  ownerName: string;
  email: string;
  phone: string;
  isTrial: boolean;
  createdAt: number;
  updatedAt: number;
  machineFingerprint: MachineFingerprint;
  encryptedHash: string;
  // Optional fields that may be added later
  maxUsers?: number;
  features?: string[];
  lastValidation?: string;
}

// Storage configuration
const STORAGE_FILENAME = 'notdelete.dat';
const ENCRYPTION_KEY = 'jewelry-girvi-license-key-2024'; // In production, use environment variable
const HASH_SALT = 'jewelry-girvi-salt-2024'; // In production, use environment variable

// File handle for persistent storage (modern browsers)
let licenseFileHandle: FileSystemFileHandle | null = null;

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
 * Generate encryption key from password using PBKDF2
 */
async function deriveKey(password: string, salt: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);
  const saltBuffer = encoder.encode(salt);
  
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );
  
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: saltBuffer,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypt data using AES-GCM
 */
async function encryptData(data: string): Promise<Uint8Array> {
  try {
    const key = await deriveKey(ENCRYPTION_KEY, HASH_SALT);
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    
    // Generate random IV
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    // Encrypt data
    const encryptedBuffer = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      dataBuffer
    );
    
    // Combine IV and encrypted data
    const combined = new Uint8Array(iv.length + encryptedBuffer.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encryptedBuffer), iv.length);
    
    return combined;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

/**
 * Decrypt data using AES-GCM
 */
async function decryptData(encryptedData: Uint8Array): Promise<LocalLicenseData | null> {
  try {
    const key = await deriveKey(ENCRYPTION_KEY, HASH_SALT);
    
    // Extract IV and encrypted data
    const iv = encryptedData.slice(0, 12);
    const encryptedBuffer = encryptedData.slice(12);
    
    // Decrypt data
    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      encryptedBuffer
    );
    
    const decoder = new TextDecoder();
    const decryptedData = decoder.decode(decryptedBuffer);
    
    return JSON.parse(decryptedData);
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
}

/**
 * Generate tamper-proof hash for license data
 */
async function generateDataHash(data: LocalLicenseData): Promise<string> {
  const dataString = JSON.stringify({
    licenseKey: data.licenseKey,
    machineId: data.machineId,
    expiryDate: data.expiryDate,
    startDate: data.startDate,
    status: data.status,
    shopId: data.shopId,
    shopName: data.shopName,
    ownerName: data.ownerName,
    email: data.email,
    phone: data.phone,
    isTrial: data.isTrial,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    machineFingerprint: data.machineFingerprint
  });
  
  return sha256Hash(dataString + HASH_SALT);
}

/**
 * Request file system access (modern browsers)
 */
async function requestFileAccess(): Promise<FileSystemFileHandle | null> {
  try {
    if ('showOpenFilePicker' in window) {
      // Modern browser - request file access
      const [fileHandle] = await (window as any).showOpenFilePicker({
        multiple: false,
        types: [{
          description: 'License Data File',
          accept: { 'application/octet-stream': ['.dat'] }
        }]
      });
      return fileHandle;
    }
    return null;
  } catch (error) {
    console.log('File access not granted or not supported');
    return null;
  }
}

/**
 * Create new license file (modern browsers)
 */
async function createLicenseFile(): Promise<FileSystemFileHandle | null> {
  try {
    if ('showSaveFilePicker' in window) {
      const fileHandle = await (window as any).showSaveFilePicker({
        suggestedName: STORAGE_FILENAME,
        types: [{
          description: 'License Data File',
          accept: { 'application/octet-stream': ['.dat'] }
        }]
      });
      return fileHandle;
    }
    return null;
  } catch (error) {
    console.log('File creation not supported');
    return null;
  }
}

/**
 * Save license data to encrypted file
 */
export async function saveLicenseData(licenseData: Omit<LocalLicenseData, 'encryptedHash'>): Promise<void> {
  try {
    // Generate hash for tamper protection
    const dataHash = await generateDataHash(licenseData as LocalLicenseData);
    
    // Create complete data object
    const completeData: LocalLicenseData = {
      ...licenseData,
      encryptedHash: dataHash
    };
    
    // Encrypt the complete data
    const encryptedData = await encryptData(JSON.stringify(completeData));
    
    // Try to save to file system (modern browsers)
    if (!licenseFileHandle) {
      licenseFileHandle = await createLicenseFile();
    }
    
    if (licenseFileHandle) {
      // Save to file system
      const writable = await licenseFileHandle.createWritable();
      await writable.write(encryptedData);
      await writable.close();
      console.log('License data saved to file successfully');
    } else {
      // Fallback: download file for user to place manually
      const blob = new Blob([encryptedData], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = STORAGE_FILENAME;
      a.textContent = 'Download License File';
      a.style.display = 'block';
      a.style.margin = '20px';
      a.style.padding = '10px';
      a.style.backgroundColor = '#007bff';
      a.style.color = 'white';
      a.style.textDecoration = 'none';
      a.style.borderRadius = '5px';
      a.style.textAlign = 'center';
      
      // Show download message
      const message = document.createElement('div');
      message.innerHTML = `
        <div style="background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 5px; padding: 15px; margin: 20px;">
          <h4>License File Created</h4>
          <p>Your license data has been encrypted and saved to <strong>${STORAGE_FILENAME}</strong></p>
          <p><strong>Important:</strong> Place this file in your application folder and do not delete it!</p>
          <p>Click the button below to download the file:</p>
        </div>
      `;
      
      // Insert message and download button
      const container = document.querySelector('body') || document.body;
      container.appendChild(message);
      container.appendChild(a);
      
      // Auto-click download
      a.click();
      
      // Clean up
      setTimeout(() => {
        URL.revokeObjectURL(url);
        container.removeChild(message);
        container.removeChild(a);
      }, 1000);
      
      console.log('License file downloaded for manual placement');
    }
  } catch (error) {
    console.error('Error saving license data:', error);
    throw new Error('Failed to save license data');
  }
}

/**
 * Load license data from encrypted file
 */
export async function loadLicenseData(): Promise<LocalLicenseData | null> {
  try {
    let encryptedData: Uint8Array | null = null;
    
    // Try to load from file system first
    if (!licenseFileHandle) {
      licenseFileHandle = await requestFileAccess();
    }
    
    if (licenseFileHandle) {
      // Read from file system
      const file = await licenseFileHandle.getFile();
      const arrayBuffer = await file.arrayBuffer();
      encryptedData = new Uint8Array(arrayBuffer);
    } else {
      // Try to find file in localStorage as fallback
      const storedData = localStorage.getItem('jewelry_girvi_license_data');
      if (storedData) {
        // Convert base64 to Uint8Array
        const binaryString = atob(storedData);
        encryptedData = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          encryptedData[i] = binaryString.charCodeAt(i);
        }
      }
    }
    
    if (!encryptedData) {
      return null;
    }

    // Decrypt data
    const licenseData = await decryptData(encryptedData);
    
    if (!licenseData) {
      return null;
    }

    // Validate tamper protection
    const expectedHash = await generateDataHash(licenseData);
    if (licenseData.encryptedHash !== expectedHash) {
      console.error('License data tampering detected');
      return null;
    }
    
    // Validate machine fingerprint
    const currentFingerprint = await getCurrentMachineFingerprint();
    if (!(await isSameMachine(licenseData.machineFingerprint, currentFingerprint))) {
      console.error('Machine fingerprint mismatch');
      return null;
    }
    
    return licenseData;
  } catch (error) {
    console.error('Error loading license data:', error);
    return null;
  }
}

/**
 * Delete local license data
 */
export function deleteLicenseData(): void {
  try {
    // Clear file handle
    licenseFileHandle = null;
    
    // Clear localStorage fallback
    localStorage.removeItem('jewelry_girvi_license_data');
    
    console.log('License data deleted successfully');
  } catch (error) {
    console.error('Error deleting license data:', error);
    throw new Error('Failed to delete license data');
  }
}

/**
 * Check if local license data exists
 */
export async function hasLicenseData(): Promise<boolean> {
  try {
    // Check if we have a file handle
    if (licenseFileHandle) {
      try {
        await licenseFileHandle.getFile();
        return true;
      } catch {
        return false;
      }
    }
    
    // Check localStorage fallback
    return localStorage.getItem('jewelry_girvi_license_data') !== null;
  } catch (error) {
    return false;
  }
}

/**
 * Convert Firebase license to local storage format
 */
export function convertFirebaseLicenseToLocal(
  firebaseLicense: FirebaseLicense,
  machineFingerprint: MachineFingerprint
): Omit<LocalLicenseData, 'encryptedHash'> {
  return {
    licenseKey: firebaseLicense.licenseKey,
    machineId: firebaseLicense.machineId || machineFingerprint.machineId,
    expiryDate: firebaseLicense.expiryDate,
    startDate: firebaseLicense.startDate,
    status: firebaseLicense.status,
    shopId: firebaseLicense.shopId,
    shopName: firebaseLicense.shopName,
    ownerName: firebaseLicense.ownerName,
    email: firebaseLicense.email,
    phone: firebaseLicense.phone,
    isTrial: firebaseLicense.isTrial,
    createdAt: firebaseLicense.createdAt,
    updatedAt: firebaseLicense.updatedAt,
    machineFingerprint: machineFingerprint,
    maxUsers: firebaseLicense.maxUsers,
    features: firebaseLicense.features,
    lastValidation: firebaseLicense.lastValidation
  };
}

/**
 * Validate local license data
 */
export async function validateLocalLicenseData(data: LocalLicenseData): Promise<boolean> {
  try {
    // Check if license is expired
    const expiryDate = new Date(data.expiryDate);
    const now = new Date();
    
    if (expiryDate < now) {
      return false;
    }
    
    // Check if status is active
    if (data.status !== 'active') {
      return false;
    }
    
    // Check if machine ID matches
    const currentFingerprint = await getCurrentMachineFingerprint();
    if (data.machineId !== currentFingerprint.machineId) {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error validating local license data:', error);
    return false;
  }
}

/**
 * Check if two machine fingerprints are from the same machine
 */
export async function isSameMachine(fp1: MachineFingerprint, fp2: MachineFingerprint): Promise<boolean> {
  try {
    // Use enhanced comparison from machine.ts
    const { isSameMachine: enhancedIsSameMachine } = await import('./machine');
    return await enhancedIsSameMachine(fp1, fp2);
  } catch (error) {
    console.error('Error in enhanced machine comparison, falling back to basic:', error);
    // Fallback to basic comparison
    return fp1.machineId === fp2.machineId && 
           fp1.platform === fp2.platform && 
           fp1.arch === fp2.arch;
  }
}
