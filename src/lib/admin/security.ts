import { getDatabase } from '../db';

export interface SecuritySettings {
  id: number;
  key: string;
  value: string;
  description: string;
  category: 'authentication' | 'session' | 'password' | 'access' | 'audit';
}

export interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  maxAge: number; // days
  preventReuse: number; // number of previous passwords to prevent reuse
}

export interface SessionPolicy {
  maxSessionDuration: number; // minutes
  idleTimeout: number; // minutes
  maxConcurrentSessions: number;
  requireReauthForSensitive: boolean;
}

export interface AccessPolicy {
  maxLoginAttempts: number;
  lockoutDuration: number; // minutes
  ipWhitelist: string[];
  ipBlacklist: string[];
  requireMFA: boolean;
  allowedUserAgents: string[];
}

// Default security settings
const defaultSecuritySettings: SecuritySettings[] = [
  {
    id: 1,
    key: 'password_min_length',
    value: '8',
    description: 'Minimum password length',
    category: 'password'
  },
  {
    id: 2,
    key: 'password_require_uppercase',
    value: 'true',
    description: 'Require uppercase letters in password',
    category: 'password'
  },
  {
    id: 3,
    key: 'password_require_lowercase',
    value: 'true',
    description: 'Require lowercase letters in password',
    category: 'password'
  },
  {
    id: 4,
    key: 'password_require_numbers',
    value: 'true',
    description: 'Require numbers in password',
    category: 'password'
  },
  {
    id: 5,
    key: 'password_require_special',
    value: 'false',
    description: 'Require special characters in password',
    category: 'password'
  },
  {
    id: 6,
    key: 'password_max_age',
    value: '90',
    description: 'Maximum password age in days',
    category: 'password'
  },
  {
    id: 7,
    key: 'password_prevent_reuse',
    value: '5',
    description: 'Number of previous passwords to prevent reuse',
    category: 'password'
  },
  {
    id: 8,
    key: 'session_max_duration',
    value: '480',
    description: 'Maximum session duration in minutes',
    category: 'session'
  },
  {
    id: 9,
    key: 'session_idle_timeout',
    value: '30',
    description: 'Session idle timeout in minutes',
    category: 'session'
  },
  {
    id: 10,
    key: 'session_max_concurrent',
    value: '3',
    description: 'Maximum concurrent sessions per user',
    category: 'session'
  },
  {
    id: 11,
    key: 'session_require_reauth',
    value: 'true',
    description: 'Require re-authentication for sensitive operations',
    category: 'session'
  },
  {
    id: 12,
    key: 'access_max_login_attempts',
    value: '5',
    description: 'Maximum failed login attempts before lockout',
    category: 'access'
  },
  {
    id: 13,
    key: 'access_lockout_duration',
    value: '15',
    description: 'Account lockout duration in minutes',
    category: 'access'
  },
  {
    id: 14,
    key: 'access_require_mfa',
    value: 'false',
    description: 'Require multi-factor authentication',
    category: 'access'
  },
  {
    id: 15,
    key: 'audit_log_retention',
    value: '365',
    description: 'Audit log retention period in days',
    category: 'audit'
  },
  {
    id: 16,
    key: 'audit_sensitive_operations',
    value: 'true',
    description: 'Log all sensitive operations',
    category: 'audit'
  }
];

// Get all security settings
export async function getSecuritySettings(): Promise<SecuritySettings[]> {
  try {
    const db = getDatabase();
    const settings = await db.select().from('settings').where({ key: { like: '%password%' } }).all();
    
    if (settings.length === 0) {
      // Return default settings if none exist
      return defaultSecuritySettings;
    }
    
    return settings.map(setting => ({
      id: setting.id,
      key: setting.key,
      value: setting.value,
      description: setting.description || '',
      category: setting.category || 'authentication'
    }));
  } catch (error) {
    console.error('Error fetching security settings:', error);
    return defaultSecuritySettings;
  }
}

// Get password policy
export async function getPasswordPolicy(): Promise<PasswordPolicy> {
  try {
    const settings = await getSecuritySettings();
    const passwordSettings = settings.filter(s => s.category === 'password');
    
    return {
      minLength: parseInt(passwordSettings.find(s => s.key === 'password_min_length')?.value || '8'),
      requireUppercase: passwordSettings.find(s => s.key === 'password_require_uppercase')?.value === 'true',
      requireLowercase: passwordSettings.find(s => s.key === 'password_require_lowercase')?.value === 'true',
      requireNumbers: passwordSettings.find(s => s.key === 'password_require_numbers')?.value === 'true',
      requireSpecialChars: passwordSettings.find(s => s.key === 'password_require_special')?.value === 'true',
      maxAge: parseInt(passwordSettings.find(s => s.key === 'password_max_age')?.value || '90'),
      preventReuse: parseInt(passwordSettings.find(s => s.key === 'password_prevent_reuse')?.value || '5')
    };
  } catch (error) {
    console.error('Error fetching password policy:', error);
    return {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: false,
      maxAge: 90,
      preventReuse: 5
    };
  }
}

// Get session policy
export async function getSessionPolicy(): Promise<SessionPolicy> {
  try {
    const settings = await getSecuritySettings();
    const sessionSettings = settings.filter(s => s.category === 'session');
    
    return {
      maxSessionDuration: parseInt(sessionSettings.find(s => s.key === 'session_max_duration')?.value || '480'),
      idleTimeout: parseInt(sessionSettings.find(s => s.key === 'session_idle_timeout')?.value || '30'),
      maxConcurrentSessions: parseInt(sessionSettings.find(s => s.key === 'session_max_concurrent')?.value || '3'),
      requireReauthForSensitive: sessionSettings.find(s => s.key === 'session_require_reauth')?.value === 'true'
    };
  } catch (error) {
    console.error('Error fetching session policy:', error);
    return {
      maxSessionDuration: 480,
      idleTimeout: 30,
      maxConcurrentSessions: 3,
      requireReauthForSensitive: true
    };
  }
}

// Get access policy
export async function getAccessPolicy(): Promise<AccessPolicy> {
  try {
    const settings = await getSecuritySettings();
    const accessSettings = settings.filter(s => s.category === 'access');
    
    return {
      maxLoginAttempts: parseInt(accessSettings.find(s => s.key === 'access_max_login_attempts')?.value || '5'),
      lockoutDuration: parseInt(accessSettings.find(s => s.key === 'access_lockout_duration')?.value || '15'),
      ipWhitelist: [],
      ipBlacklist: [],
      requireMFA: accessSettings.find(s => s.key === 'access_require_mfa')?.value === 'true',
      allowedUserAgents: []
    };
  } catch (error) {
    console.error('Error fetching access policy:', error);
    return {
      maxLoginAttempts: 5,
      lockoutDuration: 15,
      ipWhitelist: [],
      ipBlacklist: [],
      requireMFA: false,
      allowedUserAgents: []
    };
  }
}

// Update security setting
export async function updateSecuritySetting(key: string, value: string): Promise<void> {
  try {
    const db = getDatabase();
    
    // Check if setting exists
    const existingSetting = await db.select().from('settings').where({ key }).get();
    
    if (existingSetting) {
      await db.update('settings').set({ value }).where({ key });
    } else {
      // Create new setting
      await db.insert('settings').values({
        key,
        value,
        description: '',
        category: 'authentication'
      }).returning(['id']).get();
    }
  } catch (error) {
    console.error('Error updating security setting:', error);
    throw error;
  }
}

// Update password policy
export async function updatePasswordPolicy(policy: Partial<PasswordPolicy>): Promise<void> {
  try {
    const updates = [];
    
    if (policy.minLength !== undefined) {
      updates.push(updateSecuritySetting('password_min_length', policy.minLength.toString()));
    }
    if (policy.requireUppercase !== undefined) {
      updates.push(updateSecuritySetting('password_require_uppercase', policy.requireUppercase.toString()));
    }
    if (policy.requireLowercase !== undefined) {
      updates.push(updateSecuritySetting('password_require_lowercase', policy.requireLowercase.toString()));
    }
    if (policy.requireNumbers !== undefined) {
      updates.push(updateSecuritySetting('password_require_numbers', policy.requireNumbers.toString()));
    }
    if (policy.requireSpecialChars !== undefined) {
      updates.push(updateSecuritySetting('password_require_special', policy.requireSpecialChars.toString()));
    }
    if (policy.maxAge !== undefined) {
      updates.push(updateSecuritySetting('password_max_age', policy.maxAge.toString()));
    }
    if (policy.preventReuse !== undefined) {
      updates.push(updateSecuritySetting('password_prevent_reuse', policy.preventReuse.toString()));
    }
    
    await Promise.all(updates);
  } catch (error) {
    console.error('Error updating password policy:', error);
    throw error;
  }
}

// Update session policy
export async function updateSessionPolicy(policy: Partial<SessionPolicy>): Promise<void> {
  try {
    const updates = [];
    
    if (policy.maxSessionDuration !== undefined) {
      updates.push(updateSecuritySetting('session_max_duration', policy.maxSessionDuration.toString()));
    }
    if (policy.idleTimeout !== undefined) {
      updates.push(updateSecuritySetting('session_idle_timeout', policy.idleTimeout.toString()));
    }
    if (policy.maxConcurrentSessions !== undefined) {
      updates.push(updateSecuritySetting('session_max_concurrent', policy.maxConcurrentSessions.toString()));
    }
    if (policy.requireReauthForSensitive !== undefined) {
      updates.push(updateSecuritySetting('session_require_reauth', policy.requireReauthForSensitive.toString()));
    }
    
    await Promise.all(updates);
  } catch (error) {
    console.error('Error updating session policy:', error);
    throw error;
  }
}

// Update access policy
export async function updateAccessPolicy(policy: Partial<AccessPolicy>): Promise<void> {
  try {
    const updates = [];
    
    if (policy.maxLoginAttempts !== undefined) {
      updates.push(updateSecuritySetting('access_max_login_attempts', policy.maxLoginAttempts.toString()));
    }
    if (policy.lockoutDuration !== undefined) {
      updates.push(updateSecuritySetting('access_lockout_duration', policy.lockoutDuration.toString()));
    }
    if (policy.requireMFA !== undefined) {
      updates.push(updateSecuritySetting('access_require_mfa', policy.requireMFA.toString()));
    }
    
    await Promise.all(updates);
  } catch (error) {
    console.error('Error updating access policy:', error);
    throw error;
  }
}

// Validate password against policy
export async function validatePassword(password: string): Promise<{ isValid: boolean; errors: string[] }> {
  try {
    const policy = await getPasswordPolicy();
    const errors: string[] = [];
    
    if (password.length < policy.minLength) {
      errors.push(`Password must be at least ${policy.minLength} characters long`);
    }
    
    if (policy.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (policy.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (policy.requireNumbers && !/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (policy.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  } catch (error) {
    console.error('Error validating password:', error);
    return {
      isValid: false,
      errors: ['Failed to validate password']
    };
  }
}

// Get security audit summary
export async function getSecurityAuditSummary(): Promise<{
  totalSettings: number;
  passwordPolicy: PasswordPolicy;
  sessionPolicy: SessionPolicy;
  accessPolicy: AccessPolicy;
  lastUpdated: string;
}> {
  try {
    const [passwordPolicy, sessionPolicy, accessPolicy] = await Promise.all([
      getPasswordPolicy(),
      getSessionPolicy(),
      getAccessPolicy()
    ]);
    
    const settings = await getSecuritySettings();
    
    return {
      totalSettings: settings.length,
      passwordPolicy,
      sessionPolicy,
      accessPolicy,
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching security audit summary:', error);
    throw error;
  }
}
