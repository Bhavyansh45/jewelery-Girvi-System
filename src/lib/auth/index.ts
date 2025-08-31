// Browser-compatible authentication system
// Using browser APIs instead of Node.js libraries

export interface User {
  id: number;
  username: string;
  role: 'admin' | 'clerk';
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResult {
  user: User;
  token: string;
}

// Simple browser-compatible JWT-like token generation
function generateToken(user: User): string {
  const tokenData = {
    userId: user.id,
    username: user.username,
    role: user.role,
    timestamp: Date.now(),
    exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
  };
  return btoa(JSON.stringify(tokenData)); // Base64 encode
}

// Verify token
function verifyTokenInternal(token: string): User | null {
  try {
    const decoded = JSON.parse(atob(token));
    
    // Check if token is expired
    if (Date.now() > decoded.exp) {
      return null;
    }
    
    return {
      id: decoded.userId,
      username: decoded.username,
      role: decoded.role
    };
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

// Simple password hashing (for demo purposes - not secure for production)
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'salt'); // Simple salt
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Verify password
async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const newHash = await hashPassword(password);
  return newHash === hash;
}

// Demo users (in real app, this would come from database)
const demoUsers = [
  {
    id: 1,
    username: 'admin',
    passwordHash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', // "admin123"
    role: 'admin' as const,
  },
  {
    id: 2,
    username: 'clerk',
    passwordHash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', // "clerk123"
    role: 'clerk' as const,
  },
];

export async function loginUser(credentials: LoginCredentials): Promise<LoginResult | null> {
  try {
    // Find user by username
    const user = demoUsers.find(u => u.username === credentials.username);
    
    if (!user) {
      console.log('User not found:', credentials.username);
      return null;
    }

    // Verify password
    const isValidPassword = await verifyPassword(credentials.password, user.passwordHash);
    
    if (!isValidPassword) {
      console.log('Invalid password for user:', credentials.username);
      return null;
    }

    // Create token
    const userData: User = {
      id: user.id,
      username: user.username,
      role: user.role
    };

    const token = generateToken(userData);

    return {
      user: userData,
      token
    };
  } catch (error) {
    console.error('Login error:', error);
    return null;
  }
}

export function verifyToken(token: string): User | null {
  return verifyTokenInternal(token);
}

export async function createUser(userData: {
  username: string;
  password: string;
  role: 'admin' | 'clerk';
}): Promise<User | null> {
  try {
    // Check if user already exists
    const existingUser = demoUsers.find(u => u.username === userData.username);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password
    const passwordHash = await hashPassword(userData.password);

    // Create user (in real app, this would save to database)
    const newUser: User = {
      id: Date.now(),
      username: userData.username,
      role: userData.role
    };

    // Add to demo users (in real app, this would be database insert)
    demoUsers.push({
      id: newUser.id,
      username: userData.username,
      passwordHash,
      role: userData.role
    });

    return newUser;
  } catch (error) {
    console.error('Create user error:', error);
    return null;
  }
}

export async function changePassword(userId: number, newPassword: string): Promise<boolean> {
  try {
    const passwordHash = await hashPassword(newPassword);
    
    // Update user password (in real app, this would update database)
    const userIndex = demoUsers.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      demoUsers[userIndex].passwordHash = passwordHash;
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Change password error:', error);
    return false;
  }
}

export async function isFirstUser(): Promise<boolean> {
  // For demo purposes, return false since we have demo users
  return false;
} 