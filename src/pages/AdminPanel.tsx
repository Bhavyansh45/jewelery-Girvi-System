import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Modal from '@/components/ui/modal';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import Select from '@/components/ui/select';
import Textarea from '@/components/ui/textarea';
import { 
  Shield, 
  Users, 
  Key, 
  Activity, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Download,
  Settings,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Info,
  RefreshCw,
  Lock,
  Unlock
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { 
  getAllUsers, 
  createUser, 
  updateUser, 
  deleteUser, 
  toggleUserStatus,
  changeUserPassword,
  type AdminUser,
  type CreateUserData,
  type UpdateUserData
} from '@/lib/admin/users';
import { licenseValidationService } from '@/lib/auth/license';
import { getNetworkStatus } from '@/lib/auth/network';
import type { FirebaseLicense, LicenseValidationResult } from '@/lib/firebase/admin';
import {
  getSystemLogs,
  getLogStats,
  clearOldLogs,
  exportLogs,
  type SystemLog,
  type LogFilter
} from '@/lib/admin/logs';
import {
  getSecuritySettings,
  getPasswordPolicy,
  getSessionPolicy,
  getAccessPolicy,
  updatePasswordPolicy,
  updateSessionPolicy,
  updateAccessPolicy,
  type PasswordPolicy,
  type SessionPolicy,
  type AccessPolicy
} from '@/lib/admin/security';

const AdminPanel: React.FC = () => {
  // State management
  const [activeTab, setActiveTab] = useState<'users' | 'license' | 'logs' | 'security'>('users');
  const [isLoading, setIsLoading] = useState(false);
  
  // User management state
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [changingPasswordFor, setChangingPasswordFor] = useState<AdminUser | null>(null);
  
  // License management state
  const [licenseInfo, setLicenseInfo] = useState<FirebaseLicense | null>(null);
  const [licenseValidation, setLicenseValidation] = useState<LicenseValidationResult | null>(null);
  const [licenseUsage, setLicenseUsage] = useState<any>(null);
  const [showActivationModal, setShowActivationModal] = useState(false);
  const [activationKey, setActivationKey] = useState('');
  
  // System logs state
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [logStats, setLogStats] = useState<any>(null);
  const [logFilter, setLogFilter] = useState<LogFilter>({});
  const [showLogDetails, setShowLogDetails] = useState<SystemLog | null>(null);
  
  // Security settings state
  const [passwordPolicy, setPasswordPolicy] = useState<PasswordPolicy | null>(null);
  const [sessionPolicy, setSessionPolicy] = useState<SessionPolicy | null>(null);
  const [accessPolicy, setAccessPolicy] = useState<AccessPolicy | null>(null);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<'password' | 'session' | 'access' | null>(null);

  // Form state
  const [userForm, setUserForm] = useState<CreateUserData>({
    username: '',
    password: '',
    role: 'clerk'
  });
  const [passwordForm, setPasswordForm] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        loadUsers(),
        loadLicenseInfo(),
        loadLogs(),
        loadSecuritySettings()
      ]);
    } catch (error) {
      console.error('Error loading admin data:', error);
      toast.error('Failed to load admin data');
    } finally {
      setIsLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const userList = await getAllUsers();
      setUsers(userList);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Failed to load users');
    }
  };

  const loadLicenseInfo = async () => {
    try {
      const currentLicense = licenseValidationService.getCurrentLicense();
      if (currentLicense) {
        const validation = await licenseValidationService.validateLicenseKey(currentLicense.licenseKey);
        setLicenseInfo({
          licenseKey: currentLicense.licenseKey,
          expiryDate: currentLicense.expiryDate,
          status: currentLicense.status as any,
          createdAt: currentLicense.lastValidation,
          updatedAt: currentLicense.lastValidation,
          shopId: currentLicense.shopId,
          machineId: currentLicense.machineId,
          maxUsers: currentLicense.maxUsers,
          features: currentLicense.features,
          lastValidation: currentLicense.lastValidation
        });
        setLicenseValidation(validation);
        setLicenseUsage({
          activeUsers: 1,
          maxUsers: currentLicense.maxUsers,
          usagePercentage: Math.round((1 / currentLicense.maxUsers) * 100)
        });
      }
    } catch (error) {
      console.error('Error loading license info:', error);
      toast.error('Failed to load license information');
    }
  };

  const loadLogs = async () => {
    try {
      const [logList, stats] = await Promise.all([
        getSystemLogs(logFilter),
        getLogStats()
      ]);
      setLogs(logList);
      setLogStats(stats);
    } catch (error) {
      console.error('Error loading logs:', error);
      toast.error('Failed to load system logs');
    }
  };

  const loadSecuritySettings = async () => {
    try {
      const [password, session, access] = await Promise.all([
        getPasswordPolicy(),
        getSessionPolicy(),
        getAccessPolicy()
      ]);
      setPasswordPolicy(password);
      setSessionPolicy(session);
      setAccessPolicy(access);
    } catch (error) {
      console.error('Error loading security settings:', error);
      toast.error('Failed to load security settings');
    }
  };

  // User management functions
  const handleCreateUser = async () => {
    try {
      if (userForm.password.length < 8) {
        toast.error('Password must be at least 8 characters long');
        return;
      }
      
      await createUser(userForm);
      toast.success('User created successfully');
      setShowUserModal(false);
      setUserForm({ username: '', password: '', role: 'clerk' });
      loadUsers();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create user');
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;
    
    try {
      await updateUser(editingUser.id, {
        username: userForm.username,
        role: userForm.role as 'admin' | 'clerk'
      });
      toast.success('User updated successfully');
      setShowUserModal(false);
      setEditingUser(null);
      setUserForm({ username: '', password: '', role: 'clerk' });
      loadUsers();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update user');
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await deleteUser(userId);
      toast.success('User deleted successfully');
      loadUsers();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete user');
    }
  };

  const handleToggleUserStatus = async (userId: number) => {
    try {
      await toggleUserStatus(userId);
      toast.success('User status updated');
      loadUsers();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update user status');
    }
  };

  const handleChangePassword = async () => {
    if (!changingPasswordFor) return;
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (passwordForm.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }
    
    try {
      await changeUserPassword({
        userId: changingPasswordFor.id,
        newPassword: passwordForm.newPassword
      });
      toast.success('Password changed successfully');
      setShowPasswordModal(false);
      setChangingPasswordFor(null);
      setPasswordForm({ newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to change password');
    }
  };

  // License management functions
  const handleActivateLicense = async () => {
    if (!activationKey.trim()) {
      toast.error('Please enter an activation key');
      return;
    }
    
    try {
      const result = await licenseValidationService.activateLicense(activationKey);
      if (result.isValid) {
        toast.success('License activated successfully');
        setShowActivationModal(false);
        setActivationKey('');
        loadLicenseInfo();
      } else {
        toast.error(result.message || 'License activation failed');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to activate license');
    }
  };

  const handleRenewLicense = async (months: number) => {
    try {
      // For demo purposes, simulate license renewal
      toast.success(`License renewed for ${months} months`);
      loadLicenseInfo();
    } catch (error: any) {
      toast.error('Failed to renew license');
    }
  };

  // System logs functions
  const handleExportLogs = async (format: 'csv' | 'json') => {
    try {
      const data = await exportLogs(format);
      const blob = new Blob([data], { type: format === 'csv' ? 'text/csv' : 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `system-logs.${format}`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(`Logs exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Failed to export logs');
    }
  };

  const handleClearOldLogs = async () => {
    if (!confirm('Are you sure you want to clear old logs? This action cannot be undone.')) return;
    
    try {
      const result = await clearOldLogs(30);
      if (result.success) {
        toast.success(result.message);
        loadLogs();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to clear old logs');
    }
  };

  // Security settings functions
  const handleUpdatePasswordPolicy = async (policy: Partial<PasswordPolicy>) => {
    try {
      await updatePasswordPolicy(policy);
      toast.success('Password policy updated');
      loadSecuritySettings();
    } catch (error) {
      toast.error('Failed to update password policy');
    }
  };

  const handleUpdateSessionPolicy = async (policy: Partial<SessionPolicy>) => {
    try {
      await updateSessionPolicy(policy);
      toast.success('Session policy updated');
      loadSecuritySettings();
    } catch (error) {
      toast.error('Failed to update session policy');
    }
  };

  const handleUpdateAccessPolicy = async (policy: Partial<AccessPolicy>) => {
    try {
      await updateAccessPolicy(policy);
      toast.success('Access policy updated');
      loadSecuritySettings();
    } catch (error) {
      toast.error('Failed to update access policy');
    }
  };

  // Tab content components
  const renderUsersTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
        <Button onClick={() => setShowUserModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.isActive ? 'default' : 'destructive'}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingUser(user);
                          setUserForm({ username: user.username, password: '', role: user.role });
                          setShowUserModal(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setChangingPasswordFor(user);
                          setShowPasswordModal(true);
                        }}
                      >
                        <Lock className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleUserStatus(user.id)}
                      >
                        {user.isActive ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const renderLicenseTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">License Management</h2>
        <Button onClick={() => setShowActivationModal(true)}>
          <Key className="w-4 h-4 mr-2" />
          Activate License
        </Button>
      </div>

      {licenseInfo && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Key className="w-5 h-5 mr-2" />
                License Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                             <div className="flex justify-between">
                 <span className="text-gray-600">License Key:</span>
                 <span className="font-medium font-mono text-sm">{licenseInfo.licenseKey}</span>
               </div>
               <div className="flex justify-between">
                 <span className="text-gray-600">Shop ID:</span>
                 <Badge variant="default">{licenseInfo.shopId}</Badge>
               </div>
               <div className="flex justify-between">
                 <span className="text-gray-600">Status:</span>
                 <Badge 
                   variant={licenseInfo.status === 'active' ? 'default' : 'destructive'}
                 >
                   {licenseInfo.status}
                 </Badge>
               </div>
               <div className="flex justify-between">
                 <span className="text-gray-600">Machine ID:</span>
                 <span className="font-medium font-mono text-sm">{licenseInfo.machineId || 'Not bound'}</span>
               </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Expires:</span>
                <span className="font-medium">
                  {new Date(licenseInfo.expiryDate).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Usage Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {licenseUsage && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Active Users:</span>
                    <span className="font-medium">{licenseUsage.activeUsers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Max Users:</span>
                    <span className="font-medium">{licenseUsage.maxUsers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Usage:</span>
                    <span className="font-medium">{licenseUsage.usagePercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${licenseUsage.usagePercentage}%` }}
                    ></div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {licenseValidation && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
              License Validation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-3">
              {licenseValidation.isValid ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <XCircle className="w-6 h-6 text-red-600" />
              )}
              <div>
                <p className={`font-medium ${licenseValidation.isValid ? 'text-green-600' : 'text-red-600'}`}>
                  {licenseValidation.message}
                </p>
                {licenseValidation.expiresIn && (
                  <p className="text-sm text-gray-600">
                    Expires in {licenseValidation.expiresIn} days
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex space-x-4">
        <Button onClick={() => handleRenewLicense(12)}>
          Renew for 12 Months
        </Button>
        <Button onClick={() => handleRenewLicense(24)}>
          Renew for 24 Months
        </Button>
      </div>
    </div>
  );

  const renderLogsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">System Logs</h2>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => handleExportLogs('csv')}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={() => handleExportLogs('json')}>
            <Download className="w-4 h-4 mr-2" />
            Export JSON
          </Button>
          <Button variant="outline" onClick={handleClearOldLogs}>
            <Trash2 className="w-4 h-4 mr-2" />
            Clear Old Logs
          </Button>
        </div>
      </div>

      {logStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{logStats.totalLogs}</p>
                <p className="text-sm text-gray-600">Total Logs</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{logStats.errorCount}</p>
                <p className="text-sm text-gray-600">Errors</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">{logStats.warningCount}</p>
                <p className="text-sm text-gray-600">Warnings</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{logStats.infoCount}</p>
                <p className="text-sm text-gray-600">Info</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Level</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <Badge 
                      variant={
                        log.level === 'error' ? 'destructive' : 
                        log.level === 'warning' ? 'secondary' : 'default'
                      }
                    >
                      {log.level}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{log.category}</Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{log.message}</TableCell>
                  <TableCell>{log.username || 'N/A'}</TableCell>
                  <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowLogDetails(log)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Security Settings</h2>
        <Button onClick={() => setShowSecurityModal(true)}>
          <Settings className="w-4 h-4 mr-2" />
          Configure Security
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lock className="w-5 h-5 mr-2" />
              Password Policy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {passwordPolicy && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-600">Min Length:</span>
                  <span className="font-medium">{passwordPolicy.minLength}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Uppercase:</span>
                  <Badge variant={passwordPolicy.requireUppercase ? 'default' : 'secondary'}>
                    {passwordPolicy.requireUppercase ? 'Required' : 'Optional'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Numbers:</span>
                  <Badge variant={passwordPolicy.requireNumbers ? 'default' : 'secondary'}>
                    {passwordPolicy.requireNumbers ? 'Required' : 'Optional'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Max Age:</span>
                  <span className="font-medium">{passwordPolicy.maxAge} days</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Session Policy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {sessionPolicy && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-600">Max Duration:</span>
                  <span className="font-medium">{sessionPolicy.maxSessionDuration} min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Idle Timeout:</span>
                  <span className="font-medium">{sessionPolicy.idleTimeout} min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Max Sessions:</span>
                  <span className="font-medium">{sessionPolicy.maxConcurrentSessions}</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Access Policy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {accessPolicy && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-600">Max Login Attempts:</span>
                  <span className="font-medium">{accessPolicy.maxLoginAttempts}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Lockout Duration:</span>
                  <span className="font-medium">{accessPolicy.lockoutDuration} min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">MFA Required:</span>
                  <Badge variant={accessPolicy.requireMFA ? 'default' : 'secondary'}>
                    {accessPolicy.requireMFA ? 'Yes' : 'No'}
                  </Badge>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
        <p className="text-gray-600">System administration and management</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'users', label: 'User Management', icon: Users },
            { id: 'license', label: 'License Management', icon: Key },
            { id: 'logs', label: 'System Logs', icon: Activity },
            { id: 'security', label: 'Security Settings', icon: Shield }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-96">
        {activeTab === 'users' && renderUsersTab()}
        {activeTab === 'license' && renderLicenseTab()}
        {activeTab === 'logs' && renderLogsTab()}
        {activeTab === 'security' && renderSecurityTab()}
      </div>

      {/* User Modal */}
      <Modal
        isOpen={showUserModal}
        onClose={() => {
          setShowUserModal(false);
          setEditingUser(null);
          setUserForm({ username: '', password: '', role: 'clerk' });
        }}
        title={editingUser ? 'Edit User' : 'Add New User'}
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <Input
              value={userForm.username}
              onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
              placeholder="Enter username"
            />
          </div>
          
          {!editingUser && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <Input
                type="password"
                value={userForm.password}
                onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                placeholder="Enter password"
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <Select
              value={userForm.role}
              onChange={(value: string) => setUserForm({ ...userForm, role: value as 'admin' | 'clerk' })}
              options={[
                { value: 'clerk', label: 'Clerk' },
                { value: 'admin', label: 'Admin' }
              ]}
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowUserModal(false);
                setEditingUser(null);
                setUserForm({ username: '', password: '', role: 'clerk' });
              }}
            >
              Cancel
            </Button>
            <Button onClick={editingUser ? handleUpdateUser : handleCreateUser}>
              {editingUser ? 'Update User' : 'Create User'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Password Change Modal */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => {
          setShowPasswordModal(false);
          setChangingPasswordFor(null);
          setPasswordForm({ newPassword: '', confirmPassword: '' });
        }}
        title="Change Password"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <Input
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              placeholder="Enter new password"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <Input
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              placeholder="Confirm new password"
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowPasswordModal(false);
                setChangingPasswordFor(null);
                setPasswordForm({ newPassword: '', confirmPassword: '' });
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleChangePassword}>
              Change Password
            </Button>
          </div>
        </div>
      </Modal>

      {/* License Activation Modal */}
      <Modal
        isOpen={showActivationModal}
        onClose={() => {
          setShowActivationModal(false);
          setActivationKey('');
        }}
        title="Activate License"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Activation Key
            </label>
            <Input
              value={activationKey}
              onChange={(e) => setActivationKey(e.target.value)}
              placeholder="Enter your license activation key"
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowActivationModal(false);
                setActivationKey('');
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleActivateLicense}>
              Activate License
            </Button>
          </div>
        </div>
      </Modal>

      {/* Security Settings Modal */}
      <Modal
        isOpen={showSecurityModal}
        onClose={() => setShowSecurityModal(false)}
        title="Configure Security Settings"
        size="xl"
      >
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Password Policy</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Length
                </label>
                <Input
                  type="number"
                  value={passwordPolicy?.minLength || 8}
                  onChange={(e) => handleUpdatePasswordPolicy({ minLength: parseInt(e.target.value) })}
                  min="6"
                  max="20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Age (days)
                </label>
                <Input
                  type="number"
                  value={passwordPolicy?.maxAge || 90}
                  onChange={(e) => handleUpdatePasswordPolicy({ maxAge: parseInt(e.target.value) })}
                  min="30"
                  max="365"
                />
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Session Policy</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Duration (minutes)
                </label>
                <Input
                  type="number"
                  value={sessionPolicy?.maxSessionDuration || 480}
                  onChange={(e) => handleUpdateSessionPolicy({ maxSessionDuration: parseInt(e.target.value) })}
                  min="60"
                  max="1440"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Idle Timeout (minutes)
                </label>
                <Input
                  type="number"
                  value={sessionPolicy?.idleTimeout || 30}
                  onChange={(e) => handleUpdateSessionPolicy({ idleTimeout: parseInt(e.target.value) })}
                  min="5"
                  max="120"
                />
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Access Policy</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Login Attempts
                </label>
                <Input
                  type="number"
                  value={accessPolicy?.maxLoginAttempts || 5}
                  onChange={(e) => handleUpdateAccessPolicy({ maxLoginAttempts: parseInt(e.target.value) })}
                  min="3"
                  max="10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lockout Duration (minutes)
                </label>
                <Input
                  type="number"
                  value={accessPolicy?.lockoutDuration || 15}
                  onChange={(e) => handleUpdateAccessPolicy({ lockoutDuration: parseInt(e.target.value) })}
                  min="5"
                  max="60"
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end pt-4">
            <Button onClick={() => setShowSecurityModal(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>

      {/* Log Details Modal */}
      <Modal
        isOpen={!!showLogDetails}
        onClose={() => setShowLogDetails(null)}
        title="Log Details"
        size="lg"
      >
        {showLogDetails && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Level</label>
                <Badge 
                  variant={
                    showLogDetails.level === 'error' ? 'destructive' : 
                    showLogDetails.level === 'warning' ? 'secondary' : 'default'
                  }
                >
                  {showLogDetails.level}
                </Badge>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <Badge variant="outline">{showLogDetails.category}</Badge>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">User</label>
                <span>{showLogDetails.username || 'N/A'}</span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">IP Address</label>
                <span>{showLogDetails.ipAddress || 'N/A'}</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Message</label>
              <p className="mt-1 p-3 bg-gray-50 rounded-md">{showLogDetails.message}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Timestamp</label>
              <p className="mt-1">{new Date(showLogDetails.timestamp).toLocaleString()}</p>
            </div>
            
            {showLogDetails.details && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Details</label>
                <pre className="mt-1 p-3 bg-gray-50 rounded-md text-sm overflow-auto">
                  {JSON.stringify(showLogDetails.details, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminPanel; 