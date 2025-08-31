import { ref, get, set, update, remove } from 'firebase/database';
import { database } from './config';

// Firebase license interface - matches your actual database structure
export interface FirebaseLicense {
  licenseKey: string;
  expiryDate: string;
  startDate: string;
  status: 'active' | 'expired' | 'revoked' | 'suspended';
  createdAt: number;
  updatedAt: number;
  shopId: string;
  shopName: string;
  ownerName: string;
  email: string;
  phone: string;
  isTrial: boolean;
  machineId?: string; // Will be added when license is activated
  maxUsers?: number; // Will be added for user management
  features?: string[]; // Will be added for feature control
  lastValidation?: string; // Will be added for tracking
}

// License validation result interface
export interface LicenseValidationResult {
  isValid: boolean;
  license?: FirebaseLicense;
  message: string;
  error?: string;
  expiresIn?: number;
  isOffline: boolean;
}

// Firebase database operations
export const adminDatabase = {
  ref: (path: string) => ({
    get: async () => {
      try {
        const snapshot = await get(ref(database, path));
        return {
          exists: () => snapshot.exists(),
          val: () => snapshot.val()
        };
      } catch (error) {
        console.error('Firebase database error:', error);
        return {
          exists: () => false,
          val: () => null
        };
      }
    },
    update: async (data: any) => {
      try {
        await update(ref(database, path), data);
        return Promise.resolve();
      } catch (error) {
        console.error('Firebase update error:', error);
        throw error;
      }
    },
    set: async (data: any) => {
      try {
        await set(ref(database, path), data);
        return Promise.resolve();
      } catch (error) {
        console.error('Firebase set error:', error);
        throw error;
      }
    },
    remove: async () => {
      try {
        await remove(ref(database, path));
        return Promise.resolve();
      } catch (error) {
        console.error('Firebase remove error:', error);
        throw error;
      }
    }
  })
};

// Mock admin auth for compatibility (not needed in frontend)
export const adminAuth = {
  verifyIdToken: async (token: string) => ({ uid: 'user', email: 'user@example.com' }),
  createCustomToken: async (uid: string) => 'custom-token'
};

// Helper function to check if Firebase is available
export function isFirebaseAvailable(): boolean {
  return database !== null;
}
