# Jewelry Girvi System

A comprehensive, offline-capable jewelry-backed lending management system built with modern web technologies and real-time Firebase integration.

## 🚀 Features

### Core Functionality
- **Customer-based Jewelry Girvi**: Compound interest calculations for jewelry-backed loans
- **Dealer-based Remortgaging**: Simple interest calculations for dealer transactions
- **Offline Capability**: SQLite WASM integration for offline operation
- **Real-time Sync**: Firebase Realtime Database integration for live data synchronization

### Authentication & Security
- **Real Firebase Integration**: Live license validation against Firebase Realtime Database
- **Machine Binding**: Licenses bound to specific devices for security
- **Encrypted Storage**: AES-256-GCM encryption with tamper protection
- **Offline Validation**: Continues working without internet connection

### User Management
- **Role-based Access**: Admin and Clerk roles with different permissions
- **User Management**: Create, edit, and manage system users
- **Session Management**: Secure login and logout functionality

### Business Operations
- **Customer Management**: Complete customer lifecycle management
- **Agent Management**: Agent tracking and performance monitoring
- **Dealer Management**: Dealer relationships and transactions
- **Jewelry Tracking**: Detailed jewelry item management and valuation
- **Payment Processing**: Automated payment calculations and tracking
- **Transfer Management**: Inter-branch and inter-entity transfers

### Reporting & Analytics
- **Comprehensive Reports**: Customer, agent, dealer, and financial reports
- **Data Export**: PDF and Excel export capabilities
- **Real-time Dashboard**: Live system overview and metrics

### Communication
- **WhatsApp Integration**: Direct communication with customers and agents
- **Document Management**: File sharing and document tracking

### System Features
- **Settings Management**: Configurable system parameters
- **Backup & Restore**: Automated data backup and recovery
- **Keyboard Shortcuts**: Power user productivity features
- **Responsive Design**: Works on desktop and mobile devices

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for modern, responsive styling
- **shadcn/ui** for beautiful, accessible components
- **React Router DOM** for client-side routing
- **React Hook Form + Zod** for form validation
- **TanStack Query** for data fetching and caching

### Backend & Database
- **Node.js + Express** (via Electron)
- **SQLite** with Drizzle ORM for local data storage
- **Firebase Realtime Database** for real-time synchronization
- **Firebase Authentication** for user management

### Desktop Application
- **Electron** for cross-platform desktop app
- **Tray Icon** for system integration
- **Native File System** access

### Security & Authentication
- **Firebase Admin SDK** for server-side operations
- **JWT + bcrypt** for secure authentication
- **Machine Fingerprinting** for device binding
- **Encrypted Local Storage** for offline data

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Firebase project with Realtime Database

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd jewelrygirvisystem
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
   - Enable Realtime Database
   - Update `src/lib/firebase/config.ts` with your Firebase config
   - Set up database rules (see Firebase Setup Guide)

4. **Initialize the database**
   ```bash
   npm run db:init
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **For Electron development**
   ```bash
   npm run electron-dev
   ```

## 🔧 Configuration

### Firebase Setup

1. **Database Rules**: Set up security rules in Firebase Console
2. **License Structure**: Create licenses node with proper structure
3. **Authentication**: Configure Firebase Authentication if needed

### Environment Variables

Create a `.env` file with your configuration:

```bash
# Firebase Configuration
FIREBASE_API_KEY=your_api_key
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_DATABASE_URL=your_database_url

# Security
LICENSE_ENCRYPTION_KEY=your_encryption_key
LICENSE_HASH_SALT=your_hash_salt
```

## 📚 Documentation

- **[Authentication Guide](docs/AUTHENTICATION.md)**: Complete authentication system documentation
- **[Firebase Setup Guide](docs/FIREBASE_SETUP.md)**: Firebase configuration and setup
- **[API Reference](docs/API.md)**: System API documentation
- **[Deployment Guide](docs/DEPLOYMENT.md)**: Production deployment instructions

## 🏗️ Project Structure

```
jewelrygirvisystem/
├── src/
│   ├── components/          # React components
│   ├── pages/              # Application pages
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility libraries
│   │   ├── auth/           # Authentication system
│   │   ├── db/             # Database operations
│   │   ├── firebase/       # Firebase integration
│   │   └── utils/          # Utility functions
│   └── main.tsx            # Application entry point
├── electron/                # Electron main process
├── scripts/                 # Build and setup scripts
├── docs/                    # Documentation
└── public/                  # Static assets
```

## 🔐 License Management

The system uses a sophisticated license management system:

- **Real-time Validation**: Against Firebase Realtime Database
- **Machine Binding**: Licenses bound to specific devices
- **Offline Operation**: Continues working without internet
- **Automatic Renewal**: Handles license expiration
- **Feature Control**: Dynamic feature enabling/disabling

### Sample Licenses

After Firebase setup, you can test with these sample licenses:
- `LICENSE-2024-001` (Shop 1, expires 2026-07-31)
- `LICENSE-2024-002` (Shop 2, expires 2026-12-31)

**Note**: Your Firebase database uses an array structure where licenses are stored as array elements, not as object keys.

## 🧪 Testing

### Development Testing
```bash
# Start development server
npm run dev

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format
```

### Electron Testing
```bash
# Start Electron in development mode
npm run electron-dev

# Build Electron app
npm run electron-build
```

## 📦 Building

### Web Application
```bash
npm run build
```

### Desktop Application
```bash
npm run electron-build
```

## 🚀 Deployment

### Web Deployment
1. Build the application: `npm run build`
2. Deploy the `dist/` folder to your web server
3. Configure Firebase rules and security

### Desktop Deployment
1. Build the Electron app: `npm run electron-build`
2. Distribute the generated installers
3. Configure auto-updates if needed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is proprietary software. All rights reserved.

## 🆘 Support

For support and questions:

1. Check the documentation in the `docs/` folder
2. Review the Firebase setup guide
3. Check browser console for error messages
4. Verify Firebase configuration and rules

## 🔄 Updates

The system automatically checks for updates and can sync data when online. Regular backups are recommended for production use.

---

**Built with ❤️ for the jewelry industry** 