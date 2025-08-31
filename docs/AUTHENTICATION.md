# Authentication & License Management System

## Overview

The Jewelry Girvi System implements a comprehensive authentication and license management system that provides enterprise-grade security with offline capability. The system integrates with **Firebase Realtime Database** for real-time license validation and management.

## Architecture

The authentication system consists of several key components:

- **Firebase Integration**: Real-time license validation against Firebase Realtime Database
- **Machine Fingerprinting**: Unique device identification and binding
- **Secure Local Storage**: Encrypted local license storage with tamper protection
- **Network Monitoring**: Online/offline status detection and Firebase reachability
- **License Validation Service**: Central service for license management
- **License Guard Component**: React component protecting the entire application

## Features

### 🔐 License Validation
- **Real-time Validation**: Validates licenses against Firebase Realtime Database
- **Offline Support**: Continues working without internet connection using local storage
- **Machine Binding**: Licenses are bound to specific machines for security
- **Automatic Renewal**: Handles license expiration and renewal

### 🛡️ Security Features
- **Machine Fingerprinting**: Generates unique device identifiers using system characteristics
- **File-Based Encryption**: AES-256-GCM encryption stored in `notdelete.dat` file
- **Tamper Protection**: SHA256 hashing prevents unauthorized modifications
- **Secure Storage**: Uses encrypted file instead of browser localStorage
- **Machine Binding**: Licenses bound to specific devices for security

### 🌐 Network Capabilities
- **Online/Offline Detection**: Automatically detects network status changes
- **Firebase Reachability**: Monitors Firebase service availability
- **Smart Validation**: Prevents excessive network calls when offline
- **Automatic Sync**: Syncs local data when connection is restored
- **File Persistence**: License data persists across browser sessions and restarts

## Usage

### Basic Implementation

```tsx
import LicenseGuard from '@/components/auth/LicenseGuard';

function App() {
  return (
    <LicenseGuard>
      <Layout>
        <Routes>
          {/* Your application routes */}
        </Routes>
      </Layout>
    </LicenseGuard>
  );
}
```

### License Management

```tsx
import { licenseValidationService } from '@/lib/auth/license';

// Activate a license
const result = await licenseValidationService.activateLicense('YOUR-LICENSE-KEY');

// Check license validity
const isValid = await licenseValidationService.isLicenseValid();

// Get current license
const license = licenseValidationService.getCurrentLicense();
```

## Configuration

### Environment Variables

The system requires the following Firebase configuration:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT-default-rtdb.REGION.firebasedatabase.app",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.firebasestorage.app",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### Firebase Database Structure

Your Firebase Realtime Database should have the following structure:

```json
{
  "licenses": {
    "LICENSE-KEY-1": {
      "licenseKey": "LICENSE-KEY-1",
      "expiryDate": "2025-12-31T23:59:59.000Z",
      "status": "active",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "shopId": "SHOP001",
      "machineId": "MACHINE-FINGERPRINT",
      "maxUsers": 10,
      "features": ["basic", "reports", "export"],
      "lastValidation": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

## Database Schema

### Firebase License Structure

```typescript
interface FirebaseLicense {
  licenseKey: string;           // Unique license identifier
  expiryDate: string;          // ISO date string for expiration
  status: 'active' | 'expired' | 'revoked' | 'suspended';
  createdAt: string;           // ISO date string for creation
  updatedAt: string;           // ISO date string for last update
  shopId: string;              // Shop/store identifier
  machineId?: string;          // Bound machine fingerprint
  maxUsers: number;            // Maximum allowed users
  features: string[];          // Enabled feature list
  lastValidation?: string;     // ISO date string for last validation
}
```

### Local Storage Structure

The system now uses **encrypted file storage** instead of localStorage:

```typescript
interface LocalLicenseData {
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
  encryptedHash: string;       // Tamper protection hash
  // Optional fields
  maxUsers?: number;
  features?: string[];
  lastValidation?: string;
}
```

**Storage Method**: Encrypted `notdelete.dat` file
- **Location**: User's chosen directory (usually application folder)
- **Format**: Binary encrypted data (AES-256-GCM)
- **Persistence**: Survives browser restarts, data clearing, etc.
- **Security**: Machine-bound and tamper-protected

## Security Features

### Machine Fingerprinting

The system generates a unique machine identifier using:

- **Platform**: Operating system (Windows, macOS, Linux)
- **Architecture**: CPU architecture (x64, x86, ARM)
- **Hostname**: Network hostname or domain
- **Timestamp**: Generation timestamp for uniqueness

```typescript
// Example machine fingerprint
{
  machineId: "a1b2c3d4e5f6g7h8",
  platform: "Win32",
  arch: "x64",
  hostname: "localhost",
  timestamp: 1704067200000,
  hash: "sha256-hash-of-all-data"
}
```

### Encryption & Tamper Protection

- **AES-256-GCM**: Advanced encryption standard with authenticated encryption
- **PBKDF2**: Key derivation with 100,000 iterations
- **SHA256 Hashing**: Tamper detection for license data
- **Random IV**: Unique initialization vector for each encryption

## Offline Capability

### How It Works

1. **Online Mode**: License is validated against Firebase in real-time
2. **Offline Mode**: System falls back to locally stored encrypted `notdelete.dat` file
3. **Sync on Reconnect**: Automatically syncs with Firebase when online
4. **Cache Management**: 5-minute validation cache prevents excessive calls
5. **File Persistence**: License data persists in encrypted file across sessions

### Benefits

- **Continuous Operation**: Works without internet connection
- **Data Integrity**: Local file is encrypted and tamper-protected
- **Performance**: Faster validation using local file storage
- **Reliability**: No single point of failure
- **Persistence**: Survives browser restarts, data clearing, and system updates
- **Professional**: File-based storage looks more like enterprise software

## Error Handling

### Common Errors

- **License Not Found**: Invalid or expired license key
- **Machine Bound**: License already bound to another device
- **Network Error**: Firebase connectivity issues
- **Validation Failed**: Local validation errors

### Recovery Strategies

- **Retry Logic**: Automatic retry for network issues
- **Fallback Validation**: Local validation when offline
- **Cache Management**: Intelligent caching reduces errors
- **User Notifications**: Clear error messages and recovery steps

## Performance Optimization

### Caching Strategy

- **Validation Cache**: 5-minute cache for license validation results
- **Network Cache**: 30-second network status cache
- **Local Storage**: Persistent encrypted license storage
- **Smart Validation**: Prevents unnecessary network calls

### Network Optimization

- **Batch Operations**: Groups multiple Firebase operations
- **Connection Pooling**: Efficient Firebase connection management
- **Offline Detection**: Prevents failed network requests
- **Retry Logic**: Exponential backoff for failed requests

## Monitoring & Logging

### System Logs

The system provides comprehensive logging for:

- License validation attempts and results
- Network connectivity changes
- Machine fingerprint generation
- Encryption/decryption operations
- Error conditions and recovery

### Performance Metrics

- Network latency to Firebase
- License validation response times
- Cache hit/miss ratios
- Offline/online duration

## Production Deployment

### Checklist

- [ ] Firebase project configured with Realtime Database
- [ ] Database rules set for security
- [ ] Environment variables configured
- [ ] SSL certificates installed
- [ ] Monitoring and alerting configured
- [ ] Backup and recovery procedures tested

### Security Considerations

- **Firebase Rules**: Restrict database access to authenticated users
- **API Keys**: Secure API key management
- **HTTPS**: Ensure all communications use HTTPS
- **Rate Limiting**: Implement rate limiting for license validation
- **Audit Logging**: Log all license operations for compliance

## Troubleshooting

### Common Issues

1. **License Not Activating**
   - Check Firebase database connectivity
   - Verify license key format
   - Check machine fingerprint generation

2. **Offline Mode Not Working**
   - Verify local storage permissions
   - Check encryption key generation
   - Validate local license data integrity

3. **Performance Issues**
   - Check network latency to Firebase
   - Review cache configuration
   - Monitor validation frequency

### Debug Mode

Enable debug logging by setting:

```typescript
localStorage.setItem('debug', 'jewelry-girvi:auth:*');
```

### Support

For technical support and issues:

1. Check the browser console for error messages
2. Verify Firebase project configuration
3. Test network connectivity to Firebase
4. Review local storage permissions
5. Check machine fingerprint generation

## Next Steps

1. **Test the System**: Use the license activation screen to test real Firebase integration
2. **Configure Firebase Rules**: Set up proper database security rules
3. **Monitor Performance**: Track validation times and network usage
4. **Scale Up**: Add more licenses and users as needed
5. **Backup Strategy**: Implement automated backup procedures
