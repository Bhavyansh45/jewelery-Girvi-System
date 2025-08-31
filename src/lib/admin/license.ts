import { getDatabase } from '../db';

export interface LicenseInfo {
  id: string;
  type: 'trial' | 'basic' | 'premium' | 'enterprise';
  status: 'active' | 'expired' | 'suspended';
  issuedTo: string;
  issuedDate: string;
  expiryDate: string;
  maxUsers: number;
  features: string[];
  activationKey: string;
  lastValidated: string;
}

export interface LicenseValidation {
  isValid: boolean;
  message: string;
  expiresIn?: number; // days
  features?: string[];
}

// Mock license data for demo purposes
const mockLicense: LicenseInfo = {
  id: 'LIC-2024-001',
  type: 'premium',
  status: 'active',
  issuedTo: 'Jewelry Girvi System',
  issuedDate: '2024-01-01T00:00:00.000Z',
  expiryDate: '2025-01-01T00:00:00.000Z',
  maxUsers: 10,
  features: [
    'unlimited_customers',
    'unlimited_jewelry',
    'advanced_reports',
    'backup_restore',
    'multi_user',
    'api_access'
  ],
  activationKey: 'JGS-PREM-2024-XXXX-XXXX-XXXX',
  lastValidated: new Date().toISOString()
};

// Get current license information
export async function getLicenseInfo(): Promise<LicenseInfo> {
  try {
    // In a real app, this would validate with Firebase or external service
    const db = getDatabase();
    const licenseSetting = await db.select().from('settings').where({ key: 'license_info' }).get();
    
    if (licenseSetting) {
      return JSON.parse(licenseSetting.value);
    }
    
    // Return mock license if none exists
    return mockLicense;
  } catch (error) {
    console.error('Error fetching license info:', error);
    return mockLicense;
  }
}

// Validate license
export async function validateLicense(): Promise<LicenseValidation> {
  try {
    const license = await getLicenseInfo();
    const now = new Date();
    const expiryDate = new Date(license.expiryDate);
    
    if (expiryDate <= now) {
      return {
        isValid: false,
        message: 'License has expired',
        features: license.features
      };
    }
    
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    return {
      isValid: true,
      message: 'License is valid',
      expiresIn: daysUntilExpiry,
      features: license.features
    };
  } catch (error) {
    console.error('Error validating license:', error);
    return {
      isValid: false,
      message: 'Failed to validate license'
    };
  }
}

// Activate license
export async function activateLicense(activationKey: string): Promise<{ success: boolean; message: string }> {
  try {
    // In a real app, this would validate with external service
    if (!activationKey || activationKey.length < 20) {
      return {
        success: false,
        message: 'Invalid activation key'
      };
    }
    
    // Simulate activation process
    const newLicense: LicenseInfo = {
      ...mockLicense,
      activationKey,
      issuedDate: new Date().toISOString(),
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
      lastValidated: new Date().toISOString()
    };
    
    // Save to database
    const db = getDatabase();
    await db.insert('settings').values({
      key: 'license_info',
      value: JSON.stringify(newLicense)
    }).returning(['id']).get();
    
    return {
      success: true,
      message: 'License activated successfully'
    };
  } catch (error) {
    console.error('Error activating license:', error);
    return {
      success: false,
      message: 'Failed to activate license'
    };
  }
}

// Renew license
export async function renewLicense(months: number = 12): Promise<{ success: boolean; message: string }> {
  try {
    const currentLicense = await getLicenseInfo();
    const expiryDate = new Date(currentLicense.expiryDate);
    const newExpiryDate = new Date(expiryDate.getTime() + months * 30 * 24 * 60 * 60 * 1000);
    
    const updatedLicense: LicenseInfo = {
      ...currentLicense,
      expiryDate: newExpiryDate.toISOString(),
      lastValidated: new Date().toISOString()
    };
    
    // Update in database
    const db = getDatabase();
    await db.update('settings').set({
      value: JSON.stringify(updatedLicense)
    }).where({ key: 'license_info' });
    
    return {
      success: true,
      message: `License renewed for ${months} months`
    };
  } catch (error) {
    console.error('Error renewing license:', error);
    return {
      success: false,
      message: 'Failed to renew license'
    };
  }
}

// Get license usage statistics
export async function getLicenseUsage(): Promise<{
  totalUsers: number;
  activeUsers: number;
  maxUsers: number;
  usagePercentage: number;
}> {
  try {
    const db = getDatabase();
    const users = await db.select().from('users').all();
    const license = await getLicenseInfo();
    
    const totalUsers = users.length;
    const activeUsers = users.filter(user => user.isActive !== false).length;
    const maxUsers = license.maxUsers;
    const usagePercentage = Math.round((activeUsers / maxUsers) * 100);
    
    return {
      totalUsers,
      activeUsers,
      maxUsers,
      usagePercentage
    };
  } catch (error) {
    console.error('Error fetching license usage:', error);
    return {
      totalUsers: 0,
      activeUsers: 0,
      maxUsers: 0,
      usagePercentage: 0
    };
  }
}

// Check feature access
export async function hasFeatureAccess(feature: string): Promise<boolean> {
  try {
    const license = await getLicenseInfo();
    return license.features.includes(feature);
  } catch (error) {
    console.error('Error checking feature access:', error);
    return false;
  }
}
