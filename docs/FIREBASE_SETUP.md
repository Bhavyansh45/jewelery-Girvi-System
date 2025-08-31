# Firebase Setup Guide

## Overview

This guide will help you set up Firebase for the Jewelry Girvi System with real-time license validation and management.

## Prerequisites

1. **Firebase Project**: You already have a Firebase project created
2. **Node.js**: Version 16 or higher installed
3. **npm**: Package manager for Node.js

## Your Firebase Configuration

Your Firebase project is already configured with the following details:

- **Project ID**: `jewelrygirvisystem`
- **Database URL**: `https://jewelrygirvisystem-default-rtdb.asia-southeast1.firebasedatabase.app`
- **Region**: Asia Southeast 1 (Singapore)

## Step 1: Install Dependencies

Make sure you have the required Firebase packages installed:

```bash
npm install firebase
```

## Step 2: Set Up Firebase Database

### Option A: Automatic Setup (Recommended)

Run the provided setup script to automatically create the database structure:

```bash
npm run firebase:setup
```

This script will:
- Create the `licenses` array in your database
- Add sample license data for testing
- Match your exact database structure

### Option B: Manual Setup

If you prefer to set up manually, follow these steps:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `jewelrygirvisystem`
3. Navigate to **Realtime Database**
4. Create the following structure:

```json
{
  "licenses": [
    null,
    {
      "licenseKey": "LICENSE-2024-001",
      "expiryDate": "2026-07-31",
      "startDate": "2025-07-31",
      "status": "active",
      "createdAt": 1753966927787,
      "updatedAt": 1753988437535,
      "shopId": "1",
      "shopName": "Your Shop Name",
      "ownerName": "Owner Name",
      "email": "your@email.com",
      "phone": "+1234567890",
      "isTrial": false
    }
  ]
}
```

**Important Notes:**
- The `licenses` node is an **array**, not an object
- The first element is `null` (as per your current structure)
- License objects start from index 1
- All timestamps are in milliseconds (Unix timestamp)

## Step 3: Configure Database Rules

Set up proper security rules for your Firebase Realtime Database:

```json
{
  "rules": {
    "licenses": {
      ".read": true,
      ".write": true,
      "$index": {
        ".validate": "newData.hasChildren(['licenseKey', 'expiryDate', 'status', 'shopId'])"
      }
    }
  }
}
```

## Step 4: Test the Integration

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Open the application** in your browser

3. **Test license activation** using one of the sample licenses:
   - `LICENSE-2024-001`
   - `LICENSE-2024-002`

## Database Structure

### Licenses Array

Your database uses an array structure for licenses:

```typescript
interface FirebaseLicense {
  licenseKey: string;           // Unique identifier (e.g., "XXxX-XX8X-X2XX-Xxx7")
  expiryDate: string;          // Date string (e.g., "2026-07-31")
  startDate: string;           // Start date string (e.g., "2025-07-31")
  status: 'active' | 'expired' | 'revoked' | 'suspended';
  createdAt: number;           // Unix timestamp in milliseconds
  updatedAt: number;           // Unix timestamp in milliseconds
  shopId: string;              // Shop identifier (e.g., "1")
  shopName: string;            // Shop display name
  ownerName: string;           // Owner's name
  email: string;               // Contact email
  phone: string;               // Contact phone
  isTrial: boolean;            // Trial license flag
  machineId?: string;          // Bound machine (set on activation)
  maxUsers?: number;           // Maximum users (optional)
  features?: string[];         // Enabled features (optional)
  lastValidation?: string;     // Last validation timestamp (optional)
}
```

### Array Structure

```
licenses: [
  null,                    // Index 0: null (as per your structure)
  { license1 },           // Index 1: First license
  { license2 },           // Index 2: Second license
  // ... more licenses
]
```

## Security Features

### Authentication

- **API Key**: Your Firebase API key is included in the configuration
- **Database Rules**: Restrict access based on your security requirements
- **Real-time Updates**: Secure real-time data synchronization

### Data Validation

- **Required Fields**: All license fields are validated
- **Status Validation**: Only valid status values are allowed
- **Date Validation**: Expiry dates must be valid date strings

## Monitoring & Management

### Firebase Console

Monitor your database through the Firebase Console:

1. **Realtime Database**: View live data changes
2. **Usage Analytics**: Monitor database usage
3. **Error Logs**: Check for any validation errors
4. **Performance**: Monitor response times

### Application Logs

The application provides detailed logging for:

- License validation attempts
- Database operations
- Error conditions
- Performance metrics

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check your internet connection
   - Verify Firebase project configuration
   - Check database rules

2. **License Not Found**
   - Verify license key exists in database
   - Check database structure (array vs object)
   - Ensure proper permissions

3. **Validation Errors**
   - Check license data format
   - Verify required fields
   - Check expiry dates

### Debug Mode

Enable debug logging in the browser console:

```javascript
localStorage.setItem('debug', 'jewelry-girvi:auth:*');
```

## Production Considerations

### Security

- **Environment Variables**: Store sensitive data in environment variables
- **API Key Restrictions**: Restrict API key usage to specific domains
- **Database Rules**: Implement strict access control
- **HTTPS**: Ensure all communications use HTTPS

### Performance

- **Array Indexing**: Consider using object keys for better performance
- **Caching**: Implement client-side caching strategies
- **Monitoring**: Set up performance monitoring and alerting

### Backup

- **Automated Backups**: Set up regular database backups
- **Export Strategy**: Implement data export procedures
- **Recovery Plan**: Document disaster recovery procedures

## Support

For Firebase-specific issues:

1. **Firebase Documentation**: [https://firebase.google.com/docs](https://firebase.google.com/docs)
2. **Firebase Console**: [https://console.firebase.google.com](https://console.firebase.google.com)
3. **Firebase Support**: [https://firebase.google.com/support](https://firebase.google.com/support)

## Next Steps

1. **Test the System**: Activate a sample license
2. **Create Real Licenses**: Add your actual business licenses
3. **Configure Monitoring**: Set up alerts and monitoring
4. **Scale Up**: Add more licenses and users as needed
5. **Backup Strategy**: Implement automated backup procedures

---

**Note**: This setup provides a production-ready Firebase integration for your Jewelry Girvi System. The system now matches your exact database structure with array-based licenses.
