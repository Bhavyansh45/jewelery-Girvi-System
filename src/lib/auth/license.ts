import { adminDatabase, FirebaseLicense, LicenseValidationResult } from '../firebase/admin';
import { getCurrentMachineFingerprint, validateMachineFingerprint } from './machine';
import { 
  saveLicenseData, 
  loadLicenseData, 
  deleteLicenseData, 
  hasLicenseData,
  convertFirebaseLicenseToLocal,
  validateLocalLicenseData,
  LocalLicenseData
} from './storage';
import { 
  checkOnlineStatus, 
  checkFirebaseReachability, 
  shouldAttemptOnlineValidation,
  getNetworkStatus
} from './network';
import { ref, update } from 'firebase/database';
import { database } from '../firebase/config';

// License validation service
export class LicenseValidationService {
  private static instance: LicenseValidationService;
  private currentLicense: LocalLicenseData | null = null;
  private validationCache: Map<string, LicenseValidationResult & { timestamp: number }> = new Map();
  private cacheExpiry = 5 * 60 * 1000; // 5 minutes

  private constructor() {
    this.initialize();
  }

  public static getInstance(): LicenseValidationService {
    if (!LicenseValidationService.instance) {
      LicenseValidationService.instance = new LicenseValidationService();
    }
    return LicenseValidationService.instance;
  }

  /**
   * Initialize the license validation service
   */
  private async initialize(): Promise<void> {
    try {
      // Try to load existing license from local storage
      this.currentLicense = await loadLicenseData();
      
      // Check network status
      await checkOnlineStatus();
      
      // If we have a local license and are online, validate it
      if (this.currentLicense && getNetworkStatus().isOnline) {
        await this.validateLicenseOnline(this.currentLicense.licenseKey);
      }
    } catch (error) {
      console.error('Error initializing license validation service:', error);
    }
  }

  /**
   * Validate license key against Firebase
   */
  public async validateLicenseKey(licenseKey: string): Promise<LicenseValidationResult> {
    try {
      // Check cache first
      const cachedResult = this.getCachedValidation(licenseKey);
      if (cachedResult) {
        return cachedResult;
      }

      // Check if we're online
      const isOnline = await checkOnlineStatus();
      
      if (isOnline) {
        return await this.validateLicenseOnline(licenseKey);
      } else {
        return await this.validateLicenseOffline(licenseKey);
      }
    } catch (error) {
      console.error('Error validating license key:', error);
      return {
        isValid: false,
        error: 'Validation failed',
        message: 'Failed to validate license key',
        isOffline: !getNetworkStatus().isOnline
      };
    }
  }

  /**
   * Validate license online against Firebase
   */
  private async validateLicenseOnline(licenseKey: string): Promise<LicenseValidationResult> {
    try {
      // Check Firebase Realtime Database - licenses is an array
      const licensesRef = adminDatabase.ref('licenses');
      const snapshot = await licensesRef.get();
      
      if (!snapshot.exists()) {
        return {
          isValid: false,
          error: 'No licenses found',
          message: 'No licenses found in database',
          isOffline: false
        };
      }

      // Get all licenses and find the matching one
      const licenses = snapshot.val() as FirebaseLicense[];
      const firebaseLicense = licenses.find(license => 
        license && license.licenseKey === licenseKey
      );

      if (!firebaseLicense) {
        return {
          isValid: false,
          error: 'License not found',
          message: 'Invalid license key',
          isOffline: false
        };
      }

      // Check if license is active
      if (firebaseLicense.status !== 'active') {
        return {
          isValid: false,
          error: 'License inactive',
          message: `License status: ${firebaseLicense.status}`,
          isOffline: false
        };
      }

      // Check if license is expired
      const expiryDate = new Date(firebaseLicense.expiryDate);
      const now = new Date();
      
      if (expiryDate < now) {
        return {
          isValid: false,
          error: 'License expired',
          message: 'License has expired',
          isOffline: false
        };
      }

      // Check if machine ID is already bound
      const currentFingerprint = await getCurrentMachineFingerprint();
      if (firebaseLicense.machineId && firebaseLicense.machineId !== currentFingerprint.machineId) {
        return {
          isValid: false,
          error: 'Machine bound',
          message: 'License is already bound to another machine',
          isOffline: false
        };
      }

      // Calculate days until expiry
      const expiresIn = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      const result: LicenseValidationResult = {
        isValid: true,
        license: firebaseLicense,
        message: 'License is valid',
        expiresIn,
        isOffline: false
      };

      this.cacheValidation(licenseKey, result);
      return result;
    } catch (error) {
      console.error('Error validating license online:', error);
      return {
        isValid: false,
        error: 'Firebase error',
        message: 'Failed to validate license online',
        isOffline: false
      };
    }
  }

  /**
   * Validate license offline using local storage
   */
  private async validateLicenseOffline(licenseKey: string): Promise<LicenseValidationResult> {
    try {
      // Check if we have local license data
      if (!hasLicenseData()) {
        return {
          isValid: false,
          error: 'No local license',
          message: 'No license found locally',
          isOffline: true
        };
      }

      const localLicense = await loadLicenseData();
      if (!localLicense || localLicense.licenseKey !== licenseKey) {
        return {
          isValid: false,
          error: 'License mismatch',
          message: 'Local license does not match',
          isOffline: true
        };
      }

      // Validate local license data
      if (!(await validateLocalLicenseData(localLicense))) {
        return {
          isValid: false,
          error: 'Invalid local license',
          message: 'Local license validation failed',
          isOffline: true
        };
      }

      // Calculate days until expiry
      const expiryDate = new Date(localLicense.expiryDate);
      const now = new Date();
      const expiresIn = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      return {
        isValid: true,
        license: {
          licenseKey: localLicense.licenseKey,
          expiryDate: localLicense.expiryDate,
          startDate: localLicense.startDate,
          status: localLicense.status as any,
          createdAt: localLicense.lastValidation ? new Date(localLicense.lastValidation).getTime() : Date.now(),
          updatedAt: localLicense.lastValidation ? new Date(localLicense.lastValidation).getTime() : Date.now(),
          shopId: localLicense.shopId,
          shopName: localLicense.shopName,
          ownerName: localLicense.ownerName,
          email: localLicense.email,
          phone: localLicense.phone,
          isTrial: localLicense.isTrial,
          machineId: localLicense.machineId,
          maxUsers: localLicense.maxUsers,
          features: localLicense.features,
          lastValidation: localLicense.lastValidation
        },
        message: 'License is valid (offline)',
        expiresIn,
        isOffline: true
      };
    } catch (error) {
      console.error('Error validating license offline:', error);
      return {
        isValid: false,
        error: 'Offline validation error',
        message: 'Failed to validate license offline',
        isOffline: true
      };
    }
  }

  /**
   * Activate license on current machine
   */
  public async activateLicense(licenseKey: string): Promise<LicenseValidationResult> {
    try {
      // Validate license first
      const validation = await this.validateLicenseKey(licenseKey);
      
      if (!validation.isValid || !validation.license) {
        return validation;
      }

      // Get current machine fingerprint
      const machineFingerprint = await getCurrentMachineFingerprint();
      
      // Update Firebase with machine ID - find the license in the array and update it
      if (getNetworkStatus().isOnline) {
        try {
          const licensesRef = adminDatabase.ref('licenses');
          const snapshot = await licensesRef.get();
          
          if (snapshot.exists()) {
            const licenses = snapshot.val() as FirebaseLicense[];
            const licenseIndex = licenses.findIndex(license => 
              license && license.licenseKey === licenseKey
            );
            
            if (licenseIndex !== -1) {
              // Update the specific license in the array
              await update(ref(database, `licenses/${licenseIndex}`), {
                machineId: machineFingerprint.machineId,
                lastValidation: new Date().toISOString(),
                updatedAt: Date.now()
              });
            }
          }
        } catch (error) {
          console.error('Failed to update Firebase with machine ID:', error);
          // Continue with local activation even if Firebase update fails
        }
      }

      // Save to local storage
      const localLicenseData = convertFirebaseLicenseToLocal(validation.license, machineFingerprint);
      await saveLicenseData(localLicenseData);

      // Update current license
      this.currentLicense = {
        ...localLicenseData,
        encryptedHash: '' // Will be set by saveLicenseData
      };

      return {
        isValid: true,
        license: validation.license,
        message: 'License activated successfully',
        expiresIn: validation.expiresIn,
        isOffline: !getNetworkStatus().isOnline
      };
    } catch (error) {
      console.error('Error activating license:', error);
      return {
        isValid: false,
        error: 'Activation failed',
        message: 'Failed to activate license',
        isOffline: !getNetworkStatus().isOnline
      };
    }
  }

  /**
   * Check if current license is valid
   */
  public async isLicenseValid(): Promise<boolean> {
    try {
      if (!this.currentLicense) {
        return false;
      }

      // Check if we should attempt online validation
      if (shouldAttemptOnlineValidation()) {
        const onlineValidation = await this.validateLicenseOnline(this.currentLicense.licenseKey);
        if (onlineValidation.isValid && onlineValidation.license) {
          // Update local storage if Firebase data has changed
          const machineFingerprint = await getCurrentMachineFingerprint();
          const updatedLocalData = convertFirebaseLicenseToLocal(onlineValidation.license, machineFingerprint);
          await saveLicenseData(updatedLocalData);
          this.currentLicense = {
            ...updatedLocalData,
            encryptedHash: ''
          };
          return true;
        }
      }

      // Fall back to local validation
      return await validateLocalLicenseData(this.currentLicense);
    } catch (error) {
      console.error('Error checking license validity:', error);
      return false;
    }
  }

  /**
   * Get current license information
   */
  public getCurrentLicense(): LocalLicenseData | null {
    return this.currentLicense;
  }

  /**
   * Deactivate current license
   */
  public async deactivateLicense(): Promise<void> {
    try {
      if (this.currentLicense && getNetworkStatus().isOnline) {
        // Remove machine ID from Firebase
        const licenseRef = adminDatabase.ref(`licenses/${this.currentLicense.licenseKey}`);
        await licenseRef.update({
          machineId: null,
          lastValidation: new Date().toISOString()
        });
      }

      // Delete local license data
      deleteLicenseData();
      this.currentLicense = null;
      
      // Clear validation cache
      this.validationCache.clear();
    } catch (error) {
      console.error('Error deactivating license:', error);
      throw error;
    }
  }

  /**
   * Refresh license validation
   */
  public async refreshValidation(): Promise<LicenseValidationResult | null> {
    try {
      if (!this.currentLicense) {
        return null;
      }

      // Force network check
      await checkOnlineStatus();
      
      // Validate license
      const result = await this.validateLicenseKey(this.currentLicense.licenseKey);
      
      // Update local storage if needed
      if (result.isValid && result.license && !result.isOffline) {
        const machineFingerprint = await getCurrentMachineFingerprint();
        const updatedLocalData = convertFirebaseLicenseToLocal(result.license, machineFingerprint);
        await saveLicenseData(updatedLocalData);
        this.currentLicense = {
          ...updatedLocalData,
          encryptedHash: ''
        };
      }

      return result;
    } catch (error) {
      console.error('Error refreshing validation:', error);
      return null;
    }
  }

  /**
   * Cache validation result
   */
  private cacheValidation(licenseKey: string, result: LicenseValidationResult): void {
    this.validationCache.set(licenseKey, {
      ...result,
      timestamp: Date.now()
    });
  }

  /**
   * Get cached validation result
   */
  private getCachedValidation(licenseKey: string): LicenseValidationResult | null {
    const cached = this.validationCache.get(licenseKey);
    if (!cached) return null;

    const now = Date.now();
    if (now - cached.timestamp > this.cacheExpiry) {
      this.validationCache.delete(licenseKey);
      return null;
    }

    // Return the result without the timestamp
    const { timestamp, ...result } = cached;
    return result;
  }

  /**
   * Clear validation cache
   */
  public clearCache(): void {
    this.validationCache.clear();
  }
}

// Export singleton instance
export const licenseValidationService = LicenseValidationService.getInstance();
