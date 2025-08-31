import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set } from 'firebase/database';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDlhLhR87CMJ5lzMYrldBkC3-gkqqs7Vw0",
  authDomain: "jewelrygirvisystem.firebaseapp.com",
  databaseURL: "https://jewelrygirvisystem-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "jewelrygirvisystem",
  storageBucket: "jewelrygirvisystem.firebasestorage.app",
  messagingSenderId: "276774336900",
  appId: "1:276774336900:web:06002ad30f59809e9185d1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Sample license data - matches your actual structure
const sampleLicenses = [
  null, // First element is null as per your structure
  {
    licenseKey: "LICENSE-2024-001",
    expiryDate: "2026-07-31",
    startDate: "2025-07-31",
    status: "active",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    shopId: "1",
    shopName: "Sample Shop 1",
    ownerName: "Sample Owner",
    email: "shop1@example.com",
    phone: "+1234567890",
    isTrial: false
  },
  {
    licenseKey: "LICENSE-2024-002",
    expiryDate: "2026-12-31",
    startDate: "2025-12-31",
    status: "active",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    shopId: "2",
    shopName: "Sample Shop 2",
    ownerName: "Sample Owner 2",
    email: "shop2@example.com",
    phone: "+1234567891",
    isTrial: false
  }
];

async function setupFirebase() {
  try {
    console.log('Setting up Firebase database...');
    
    // Create licenses array
    const licensesRef = ref(database, 'licenses');
    await set(licensesRef, sampleLicenses);
    console.log('✅ Added licenses array with sample data');
    
    console.log('\n🎉 Firebase setup completed successfully!');
    console.log('\nSample licenses created:');
    console.log('- LICENSE-2024-001 (Shop 1, expires 2026-07-31)');
    console.log('- LICENSE-2024-002 (Shop 2, expires 2026-12-31)');
    console.log('\nYou can now use these license keys to test the system.');
    console.log('\nNote: The first array element is null as per your database structure.');
    
  } catch (error) {
    console.error('❌ Error setting up Firebase:', error);
    process.exit(1);
  }
}

// Run the setup
setupFirebase();
