const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');

// Initialize database
const db = new Database('jewelry_girvi.db');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'clerk',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT NOT NULL UNIQUE,
    value TEXT NOT NULL
  );



  CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT UNIQUE,
    address TEXT,
    photo TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS agents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT UNIQUE,
    address TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS dealers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT UNIQUE,
    address TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS jewelry (
    id TEXT PRIMARY KEY,
    customer_id INTEGER,
    agent_id INTEGER,
    name TEXT,
    category TEXT,
    purity TEXT,
    weight REAL,
    amount REAL,
    interest_rate REAL,
    compounding_type TEXT DEFAULT 'monthly',
    lot_no TEXT,
    in_dealer BOOLEAN DEFAULT 0,
    is_released BOOLEAN DEFAULT 0,
    added_on TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (agent_id) REFERENCES agents(id)
  );

  CREATE TABLE IF NOT EXISTS dealer_payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    jewelry_id TEXT,
    dealer_id INTEGER,
    interest_paid REAL,
    principal_paid REAL,
    paid_on TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    remarks TEXT,
    FOREIGN KEY (jewelry_id) REFERENCES jewelry(id),
    FOREIGN KEY (dealer_id) REFERENCES dealers(id)
  );

  CREATE TABLE IF NOT EXISTS dealer_returns (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    jewelry_id TEXT,
    dealer_id INTEGER,
    returned_on TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    remarks TEXT,
    FOREIGN KEY (jewelry_id) REFERENCES jewelry(id),
    FOREIGN KEY (dealer_id) REFERENCES dealers(id)
  );

  CREATE TABLE IF NOT EXISTS customer_payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    jewelry_id TEXT,
    interest_paid REAL,
    principal_paid REAL,
    payment_date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    mode TEXT,
    remarks TEXT,
    FOREIGN KEY (jewelry_id) REFERENCES jewelry(id)
  );

  CREATE TABLE IF NOT EXISTS customer_releases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    jewelry_id TEXT,
    release_date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    final_interest REAL,
    final_principal REAL,
    remarks TEXT,
    FOREIGN KEY (jewelry_id) REFERENCES jewelry(id)
  );

  CREATE TABLE IF NOT EXISTS backup_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS export_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,
    file_name TEXT NOT NULL,
    exported_on TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`);

// Insert demo users
const adminPassword = bcrypt.hashSync('admin123', 12);
const clerkPassword = bcrypt.hashSync('clerk123', 12);

db.prepare(`
  INSERT OR IGNORE INTO users (username, password_hash, role) 
  VALUES (?, ?, ?)
`).run('admin', adminPassword, 'admin');

db.prepare(`
  INSERT OR IGNORE INTO users (username, password_hash, role) 
  VALUES (?, ?, ?)
`).run('clerk', clerkPassword, 'clerk');

// Insert demo customers
const customers = [
  { name: 'Rajesh Kumar', phone: '+91-9876543210', address: '123 Main Street, Mumbai' },
  { name: 'Priya Sharma', phone: '+91-9876543211', address: '456 Park Avenue, Delhi' },
  { name: 'Amit Patel', phone: '+91-9876543212', address: '789 Lake Road, Bangalore' },
  { name: 'Sneha Singh', phone: '+91-9876543213', address: '321 Garden Street, Chennai' },
  { name: 'Vikram Malhotra', phone: '+91-9876543214', address: '654 Hill Road, Hyderabad' }
];

customers.forEach(customer => {
  db.prepare(`
    INSERT OR IGNORE INTO customers (name, phone, address) 
    VALUES (?, ?, ?)
  `).run(customer.name, customer.phone, customer.address);
});

// Insert demo agents
const agents = [
  { name: 'Ramesh Verma', phone: '+91-9876543220', address: 'Agent Office 1, Mumbai' },
  { name: 'Lakshmi Devi', phone: '+91-9876543221', address: 'Agent Office 2, Delhi' },
  { name: 'Krishna Rao', phone: '+91-9876543222', address: 'Agent Office 3, Bangalore' },
  { name: 'Meera Iyer', phone: '+91-9876543223', address: 'Agent Office 4, Chennai' }
];

agents.forEach(agent => {
  db.prepare(`
    INSERT OR IGNORE INTO agents (name, phone, address) 
    VALUES (?, ?, ?)
  `).run(agent.name, agent.phone, agent.address);
});

// Insert demo dealers
const dealers = [
  { name: 'Gold Star Dealers', phone: '+91-9876543230', address: 'Dealer Office 1, Mumbai' },
  { name: 'Royal Jewelers', phone: '+91-9876543231', address: 'Dealer Office 2, Delhi' },
  { name: 'Prestige Gold', phone: '+91-9876543232', address: 'Dealer Office 3, Bangalore' },
  { name: 'Elite Diamonds', phone: '+91-9876543233', address: 'Dealer Office 4, Chennai' }
];

dealers.forEach(dealer => {
  db.prepare(`
    INSERT OR IGNORE INTO dealers (name, phone, address) 
    VALUES (?, ?, ?)
  `).run(dealer.name, dealer.phone, dealer.address);
});

// No demo jewelry data - starting with empty jewelry table



// Insert demo settings
const settings = [
  { key: 'theme', value: 'theme-pearl' },
  { key: 'company_name', value: 'Jewelry Girvi System' },
  { key: 'default_interest_rate', value: '12.0' },
  { key: 'default_compounding_type', value: 'monthly' },
  { key: 'backup_frequency', value: 'daily' }
];

settings.forEach(setting => {
  db.prepare(`
    INSERT OR IGNORE INTO settings (key, value) 
    VALUES (?, ?)
  `).run(setting.key, setting.value);
});

console.log('Database initialized successfully!');
console.log('Demo data added:');
console.log('- 2 users (admin/admin123, clerk/clerk123)');
console.log('- 5 customers');
console.log('- 4 agents');
console.log('- 4 dealers');
console.log('- 0 jewelry items (empty table)');

console.log('- 5 settings');

db.close(); 