import bcrypt from 'bcryptjs';
import { getDatabase } from '../db';

export interface AdminUser {
  id: number;
  username: string;
  role: 'admin' | 'clerk';
  createdAt: string;
  lastLogin?: string;
  isActive: boolean;
}

export interface CreateUserData {
  username: string;
  password: string;
  role: 'admin' | 'clerk';
}

export interface UpdateUserData {
  username?: string;
  role?: 'admin' | 'clerk';
  isActive?: boolean;
}

export interface ChangePasswordData {
  userId: number;
  newPassword: string;
}

// Get all users
export async function getAllUsers(): Promise<AdminUser[]> {
  try {
    const db = getDatabase();
    const users = await db.select().from('users').all();
    
    return users.map(user => ({
      id: user.id,
      username: user.username,
      role: user.role,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
      isActive: user.isActive !== false
    }));
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Failed to fetch users');
  }
}

// Create new user
export async function createUser(userData: CreateUserData): Promise<AdminUser> {
  try {
    const db = getDatabase();
    
    // Check if username already exists
    const existingUser = await db.select().from('users').where({ username: userData.username }).get();
    if (existingUser) {
      throw new Error('Username already exists');
    }
    
    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(userData.password, saltRounds);
    
    const newUser = await db.insert('users').values({
      username: userData.username,
      passwordHash,
      role: userData.role,
      createdAt: new Date().toISOString(),
      isActive: true
    }).returning(['id', 'username', 'role', 'createdAt']).get();
    
    return {
      id: newUser.id,
      username: newUser.username,
      role: newUser.role,
      createdAt: newUser.createdAt,
      isActive: true
    };
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

// Update user
export async function updateUser(userId: number, updateData: UpdateUserData): Promise<AdminUser> {
  try {
    const db = getDatabase();
    
    // Check if user exists
    const existingUser = await db.select().from('users').where({ id: userId }).get();
    if (!existingUser) {
      throw new Error('User not found');
    }
    
    // Check if username is being changed and if it already exists
    if (updateData.username && updateData.username !== existingUser.username) {
      const usernameExists = await db.select().from('users').where({ username: updateData.username }).get();
      if (usernameExists) {
        throw new Error('Username already exists');
      }
    }
    
    await db.update('users').set(updateData).where({ id: userId });
    
    // Return updated user
    const updatedUser = await db.select().from('users').where({ id: userId }).get();
    return {
      id: updatedUser.id,
      username: updatedUser.username,
      role: updatedUser.role,
      createdAt: updatedUser.createdAt,
      lastLogin: updatedUser.lastLogin,
      isActive: updatedUser.isActive !== false
    };
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

// Change user password
export async function changeUserPassword(changeData: ChangePasswordData): Promise<void> {
  try {
    const db = getDatabase();
    
    // Check if user exists
    const existingUser = await db.select().from('users').where({ id: changeData.userId }).get();
    if (!existingUser) {
      throw new Error('User not found');
    }
    
    // Hash new password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(changeData.newPassword, saltRounds);
    
    await db.update('users').set({ passwordHash }).where({ id: changeData.userId });
  } catch (error) {
    console.error('Error changing password:', error);
    throw error;
  }
}

// Delete user
export async function deleteUser(userId: number): Promise<void> {
  try {
    const db = getDatabase();
    
    // Check if user exists
    const existingUser = await db.select().from('users').where({ id: userId }).get();
    if (!existingUser) {
      throw new Error('User not found');
    }
    
    // Prevent deleting the last admin
    if (existingUser.role === 'admin') {
      const adminUsers = await db.select().from('users').where({ role: 'admin' }).all();
      if (adminUsers.length === 1) {
        throw new Error('Cannot delete the last admin user');
      }
    }
    
    await db.delete('users').where({ id: userId });
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}

// Toggle user active status
export async function toggleUserStatus(userId: number): Promise<AdminUser> {
  try {
    const db = getDatabase();
    
    const user = await db.select().from('users').where({ id: userId }).get();
    if (!user) {
      throw new Error('User not found');
    }
    
    const newStatus = !user.isActive;
    await db.update('users').set({ isActive: newStatus }).where({ id: userId });
    
    return {
      id: user.id,
      username: user.username,
      role: user.role,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
      isActive: newStatus
    };
  } catch (error) {
    console.error('Error toggling user status:', error);
    throw error;
  }
}
