import { getDatabase } from '../db';

export interface SystemLog {
  id: number;
  level: 'info' | 'warning' | 'error' | 'debug';
  category: 'auth' | 'user' | 'jewelry' | 'payment' | 'system' | 'security';
  message: string;
  userId?: number;
  username?: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
  details?: Record<string, any>;
}

export interface LogFilter {
  level?: 'info' | 'warning' | 'error' | 'debug';
  category?: 'auth' | 'user' | 'jewelry' | 'payment' | 'system' | 'security';
  startDate?: string;
  endDate?: string;
  userId?: number;
  search?: string;
}

export interface LogStats {
  totalLogs: number;
  errorCount: number;
  warningCount: number;
  infoCount: number;
  debugCount: number;
  todayLogs: number;
  thisWeekLogs: number;
  thisMonthLogs: number;
}

// Mock logs for demo purposes
const mockLogs: SystemLog[] = [
  {
    id: 1,
    level: 'info',
    category: 'auth',
    message: 'User admin logged in successfully',
    userId: 1,
    username: 'admin',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
    details: { action: 'login', success: true }
  },
  {
    id: 2,
    level: 'info',
    category: 'jewelry',
    message: 'New jewelry item added: Gold Jewelry (JWL001)',
    userId: 1,
    username: 'admin',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
    details: { jewelryId: 'JWL001', action: 'create' }
  },
  {
    id: 3,
    level: 'warning',
    category: 'payment',
    message: 'Payment overdue for jewelry JWL002',
    userId: 2,
    username: 'clerk',
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
    details: { jewelryId: 'JWL002', daysOverdue: 5 }
  },
  {
    id: 4,
    level: 'error',
    category: 'system',
    message: 'Database connection failed',
    userId: 1,
    username: 'admin',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    details: { error: 'Connection timeout', retryCount: 3 }
  },
  {
    id: 5,
    level: 'info',
    category: 'user',
    message: 'New user created: clerk2',
    userId: 1,
    username: 'admin',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
    details: { newUsername: 'clerk2', role: 'clerk' }
  },
  {
    id: 6,
    level: 'info',
    category: 'payment',
    message: 'Interest payment received: ₹5,000',
    userId: 2,
    username: 'clerk',
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
    details: { amount: 5000, jewelryId: 'JWL001', paymentType: 'interest' }
  },
  {
    id: 7,
    level: 'warning',
    category: 'security',
    message: 'Multiple failed login attempts detected',
    userId: undefined,
    username: 'unknown',
    ipAddress: '192.168.1.105',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    details: { failedAttempts: 5, ipAddress: '192.168.1.105' }
  },
  {
    id: 8,
    level: 'info',
    category: 'system',
    message: 'System backup completed successfully',
    userId: 1,
    username: 'admin',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
    details: { backupSize: '45.2 MB', duration: '2m 15s' }
  }
];

// Get all logs with filtering
export async function getSystemLogs(filter: LogFilter = {}): Promise<SystemLog[]> {
  try {
    // In a real app, this would query the database
    let filteredLogs = [...mockLogs];
    
    // Apply filters
    if (filter.level) {
      filteredLogs = filteredLogs.filter(log => log.level === filter.level);
    }
    
    if (filter.category) {
      filteredLogs = filteredLogs.filter(log => log.category === filter.category);
    }
    
    if (filter.startDate) {
      const startDate = new Date(filter.startDate);
      filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) >= startDate);
    }
    
    if (filter.endDate) {
      const endDate = new Date(filter.endDate);
      filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) <= endDate);
    }
    
    if (filter.userId) {
      filteredLogs = filteredLogs.filter(log => log.userId === filter.userId);
    }
    
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      filteredLogs = filteredLogs.filter(log => 
        log.message.toLowerCase().includes(searchLower) ||
        log.username?.toLowerCase().includes(searchLower) ||
        log.category.toLowerCase().includes(searchLower)
      );
    }
    
    // Sort by timestamp (newest first)
    return filteredLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  } catch (error) {
    console.error('Error fetching system logs:', error);
    return [];
  }
}

// Get log statistics
export async function getLogStats(): Promise<LogStats> {
  try {
    const logs = await getSystemLogs();
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    
    const todayLogs = logs.filter(log => new Date(log.timestamp) >= today).length;
    const thisWeekLogs = logs.filter(log => new Date(log.timestamp) >= weekAgo).length;
    const thisMonthLogs = logs.filter(log => new Date(log.timestamp) >= monthAgo).length;
    
    return {
      totalLogs: logs.length,
      errorCount: logs.filter(log => log.level === 'error').length,
      warningCount: logs.filter(log => log.level === 'warning').length,
      infoCount: logs.filter(log => log.level === 'info').length,
      debugCount: logs.filter(log => log.level === 'debug').length,
      todayLogs,
      thisWeekLogs,
      thisMonthLogs
    };
  } catch (error) {
    console.error('Error fetching log stats:', error);
    return {
      totalLogs: 0,
      errorCount: 0,
      warningCount: 0,
      infoCount: 0,
      debugCount: 0,
      todayLogs: 0,
      thisWeekLogs: 0,
      thisMonthLogs: 0
    };
  }
}

// Add new log entry
export async function addSystemLog(logData: Omit<SystemLog, 'id' | 'timestamp'>): Promise<void> {
  try {
    const newLog: SystemLog = {
      ...logData,
      id: Date.now(),
      timestamp: new Date().toISOString()
    };
    
    // In a real app, this would save to database
    mockLogs.unshift(newLog);
    
    // Keep only last 1000 logs
    if (mockLogs.length > 1000) {
      mockLogs.splice(1000);
    }
  } catch (error) {
    console.error('Error adding system log:', error);
  }
}

// Clear old logs
export async function clearOldLogs(daysToKeep: number = 30): Promise<{ success: boolean; message: string }> {
  try {
    const cutoffDate = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000);
    const initialCount = mockLogs.length;
    
    // Remove logs older than cutoff date
    const filteredLogs = mockLogs.filter(log => new Date(log.timestamp) >= cutoffDate);
    const removedCount = initialCount - filteredLogs.length;
    
    // In a real app, this would update the database
    mockLogs.splice(0, mockLogs.length, ...filteredLogs);
    
    return {
      success: true,
      message: `Cleared ${removedCount} old log entries`
    };
  } catch (error) {
    console.error('Error clearing old logs:', error);
    return {
      success: false,
      message: 'Failed to clear old logs'
    };
  }
}

// Export logs
export async function exportLogs(format: 'csv' | 'json' = 'csv'): Promise<string> {
  try {
    const logs = await getSystemLogs();
    
    if (format === 'json') {
      return JSON.stringify(logs, null, 2);
    }
    
    // CSV format
    const headers = ['ID', 'Level', 'Category', 'Message', 'User', 'IP Address', 'Timestamp', 'Details'];
    const csvRows = [headers.join(',')];
    
    logs.forEach(log => {
      const row = [
        log.id,
        log.level,
        log.category,
        `"${log.message.replace(/"/g, '""')}"`,
        log.username || 'N/A',
        log.ipAddress || 'N/A',
        log.timestamp,
        log.details ? `"${JSON.stringify(log.details).replace(/"/g, '""')}"` : 'N/A'
      ];
      csvRows.push(row.join(','));
    });
    
    return csvRows.join('\n');
  } catch (error) {
    console.error('Error exporting logs:', error);
    throw new Error('Failed to export logs');
  }
}
