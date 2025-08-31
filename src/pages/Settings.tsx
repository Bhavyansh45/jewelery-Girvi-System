import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Settings as SettingsIcon, 
  Key, 
  Database, 
  Save, 
  Plus, 
  X, 
  CheckCircle, 
  Gem, 
  Crown, 

  Download,
  Upload,
  MessageSquare,
  Keyboard,
  Users,
  Shield,
  Activity,
  FileText,
  Trash2,
  Edit,
  Eye,
  Bell,
  Mail,
  Phone,
  Calendar,
  Clock,
  AlertCircle,
  RefreshCw,
  Database as DatabaseIcon,
  HardDrive,
  Cloud,
  Lock,
  Unlock
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { defaultJewelryCategories, defaultMasterJewelryNames, defaultPurityStandards } from '@/lib/utils/masterData'

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'system' | 'master' | 'backup' | 'templates' | 'shortcuts' | 'admin'>('system')

  // Modal states for CRUD operations
  const [isAddJewelryCategoryModalOpen, setIsAddJewelryCategoryModalOpen] = useState(false)
  const [isEditJewelryCategoryModalOpen, setIsEditJewelryCategoryModalOpen] = useState(false)
  const [selectedJewelryCategory, setSelectedJewelryCategory] = useState<any>(null)
  
  const [isAddJewelryNameModalOpen, setIsAddJewelryNameModalOpen] = useState(false)
  const [isEditJewelryNameModalOpen, setIsEditJewelryNameModalOpen] = useState(false)
  const [selectedJewelryName, setSelectedJewelryName] = useState<any>(null)
  

  
  const [isAddPurityModalOpen, setIsAddPurityModalOpen] = useState(false)
  const [isEditPurityModalOpen, setIsEditPurityModalOpen] = useState(false)
  const [selectedPurity, setSelectedPurity] = useState<any>(null)
  

  
  const [isAddWhatsAppTemplateModalOpen, setIsAddWhatsAppTemplateModalOpen] = useState(false)
  const [isEditWhatsAppTemplateModalOpen, setIsEditWhatsAppTemplateModalOpen] = useState(false)
  const [selectedWhatsAppTemplate, setSelectedWhatsAppTemplate] = useState<any>(null)
  
  const [isAddShortcutModalOpen, setIsAddShortcutModalOpen] = useState(false)
  const [isEditShortcutModalOpen, setIsEditShortcutModalOpen] = useState(false)
  const [selectedShortcut, setSelectedShortcut] = useState<any>(null)

  // System Settings
  const [systemSettings, setSystemSettings] = useState([
    { key: 'default_interest_rate', value: '12', description: 'Default annual interest rate (%)' },
    { key: 'payment_reminder_days', value: '7', description: 'Days before payment due to send reminder' },
    { key: 'currency_symbol', value: '₹', description: 'Currency symbol for display' },
    { key: 'date_format', value: 'DD/MM/YYYY', description: 'Date format for display' },
    { key: 'whatsapp_enabled', value: 'true', description: 'Enable WhatsApp notifications' },
    { key: 'email_enabled', value: 'true', description: 'Enable email notifications' },
    { key: 'sms_enabled', value: 'false', description: 'Enable SMS notifications' },
    { key: 'auto_backup', value: 'true', description: 'Enable automatic backup' },
    { key: 'backup_frequency', value: 'daily', description: 'Backup frequency' },
    { key: 'session_timeout', value: '30', description: 'Session timeout (minutes)' }
  ])

  // Jewelry Categories
  const [jewelryCategories, setJewelryCategories] = useState(defaultJewelryCategories)

  // Master Jewelry Names
  const [masterJewelryNames, setMasterJewelryNames] = useState(defaultMasterJewelryNames)

  // Purity Standards
  const [purityStandards, setPurityStandards] = useState(defaultPurityStandards)



  // WhatsApp Templates
  const [whatsappTemplates, setWhatsappTemplates] = useState([
    {
      id: '1',
      name: 'Payment Reminder',
      message: 'Dear {customer_name}, your payment of ₹{amount} for jewelry {jewelry_id} is due on {due_date}. Please contact us for any queries.',
      variables: ['customer_name', 'amount', 'jewelry_id', 'due_date'],
      isActive: true
    },
    {
      id: '2',
      name: 'Interest Payment',
      message: 'Hello {customer_name}, your interest payment of ₹{interest_amount} for jewelry {jewelry_id} has been received. Thank you!',
      variables: ['customer_name', 'interest_amount', 'jewelry_id'],
      isActive: true
    },
    {
      id: '3',
      name: 'Jewelry Release',
      message: 'Dear {customer_name}, your jewelry {jewelry_id} has been released. Please collect it from our office. Thank you for your business!',
      variables: ['customer_name', 'jewelry_id'],
      isActive: true
    }
  ])

  // Keyboard Shortcuts
  const [keyboardShortcuts, setKeyboardShortcuts] = useState([
    { key: 'Ctrl + D', action: 'Dashboard', description: 'Navigate to Dashboard' },
    { key: 'Ctrl + C', action: 'Customers', description: 'Navigate to Customers' },
    { key: 'Ctrl + A', action: 'Agents', description: 'Navigate to Agents' },
    { key: 'Ctrl + Shift + D', action: 'Dealers', description: 'Navigate to Dealers' },
    { key: 'Ctrl + J', action: 'Jewelry', description: 'Navigate to Jewelry' },
    { key: 'Ctrl + I', action: 'Payments', description: 'Navigate to Payments' },
    { key: 'Ctrl + T', action: 'Transfers', description: 'Navigate to Transfers' },
    { key: 'Ctrl + R', action: 'Reports', description: 'Navigate to Reports' },
    { key: 'Ctrl + M', action: 'Communication', description: 'Navigate to Communication' },
    { key: 'Ctrl + ,', action: 'Settings', description: 'Navigate to Settings' },
    { key: 'Ctrl + Shift + A', action: 'Admin Panel', description: 'Navigate to Admin Panel' },
    { key: 'Ctrl + N', action: 'New Record', description: 'Create new record' },
    { key: 'Ctrl + S', action: 'Save', description: 'Save current record' },
    { key: 'Ctrl + F', action: 'Search', description: 'Open search' },
    { key: 'Ctrl + P', action: 'Print', description: 'Print current view' },
    { key: 'Ctrl + E', action: 'Export', description: 'Export data' },
    { key: 'Ctrl + B', action: 'Backup', description: 'Create backup' },
    { key: 'Ctrl + R', action: 'Restore', description: 'Restore from backup' },
    { key: 'Ctrl + L', action: 'Logout', description: 'Logout from system' },
    { key: 'F1', action: 'Help', description: 'Open help' }
  ])

  // Admin Users
  const [adminUsers, setAdminUsers] = useState([
    { id: '1', username: 'admin', name: 'System Administrator', role: 'admin', email: 'admin@jewelrygirvi.com', isActive: true, lastLogin: '2024-12-10T10:30:00Z' },
    { id: '2', username: 'clerk1', name: 'John Clerk', role: 'clerk', email: 'john@jewelrygirvi.com', isActive: true, lastLogin: '2024-12-10T09:15:00Z' },
    { id: '3', username: 'clerk2', name: 'Sarah Clerk', role: 'clerk', email: 'sarah@jewelrygirvi.com', isActive: false, lastLogin: '2024-12-09T16:45:00Z' }
  ])

  // System Health
  const [systemHealth, setSystemHealth] = useState({
    database: { status: 'healthy', lastBackup: '2024-12-10T08:00:00Z', size: '2.5 MB' },
    storage: { status: 'healthy', used: '15%', free: '85%' },
    memory: { status: 'healthy', used: '45%', free: '55%' },
    cpu: { status: 'healthy', usage: '25%' },
    network: { status: 'healthy', uptime: '99.9%' }
  })

  // Access Logs
  const [accessLogs, setAccessLogs] = useState([
    { id: '1', user: 'admin', action: 'Login', timestamp: '2024-12-10T10:30:00Z', ip: '192.168.1.100', status: 'success' },
    { id: '2', user: 'clerk1', action: 'Add Customer', timestamp: '2024-12-10T10:25:00Z', ip: '192.168.1.101', status: 'success' },
    { id: '3', user: 'admin', action: 'Export Report', timestamp: '2024-12-10T10:20:00Z', ip: '192.168.1.100', status: 'success' },
    { id: '4', user: 'clerk2', action: 'Login', timestamp: '2024-12-10T10:15:00Z', ip: '192.168.1.102', status: 'failed' },
    { id: '5', user: 'admin', action: 'Backup Database', timestamp: '2024-12-10T08:00:00Z', ip: '192.168.1.100', status: 'success' }
  ])

  const handleSaveSetting = (key: string, value: string) => {
    setSystemSettings(prev => 
      prev.map(setting => 
        setting.key === key ? { ...setting, value } : setting
      )
    )
    toast.success('Setting saved successfully!')
  }

  const handleBackup = () => {
    // Simulate backup process
    toast.success('Backup created successfully!')
  }

  const handleRestore = () => {
    // Simulate restore process
    toast.success('System restored successfully!')
  }

  const handleExportData = () => {
    // Simulate data export
    toast.success('Data exported successfully!')
  }

  const handleImportData = () => {
    // Simulate data import
    toast.success('Data imported successfully!')
  }

  // Master Data CRUD Functions
  const handleAddJewelryCategory = (name: string) => {
    const newJewelryCategory = {
      id: `JC${Date.now()}`,
      name,
      isActive: true
    }
    setJewelryCategories([...jewelryCategories, newJewelryCategory])
    toast.success('Jewelry category added successfully!')
  }

  const handleEditJewelryCategory = (id: string, name: string) => {
    setJewelryCategories(prev => 
      prev.map(category => 
        category.id === id ? { ...category, name } : category
      )
    )
    toast.success('Jewelry category updated successfully!')
  }

  const handleDeleteJewelryCategory = (id: string) => {
    setJewelryCategories(prev => prev.filter(category => category.id !== id))
    toast.success('Jewelry category deleted successfully!')
  }

  const handleToggleJewelryCategory = (id: string) => {
    setJewelryCategories(prev => 
      prev.map(category => 
        category.id === id ? { ...category, isActive: !category.isActive } : category
      )
    )
    toast.success('Jewelry category status updated!')
  }

  // Master Jewelry Names CRUD Functions
  const handleAddJewelryName = (name: string, category: string) => {
    const newJewelryName = {
      id: `JN${Date.now()}`,
      name,
      category,
      isActive: true
    }
    setMasterJewelryNames([...masterJewelryNames, newJewelryName])
    toast.success('Jewelry name added successfully!')
  }

  const handleEditJewelryName = (id: string, name: string, category: string) => {
    setMasterJewelryNames(prev => 
      prev.map(jewelryName => 
        jewelryName.id === id ? { ...jewelryName, name, category } : jewelryName
      )
    )
    toast.success('Jewelry name updated successfully!')
  }

  const handleDeleteJewelryName = (id: string) => {
    setMasterJewelryNames(prev => prev.filter(jewelryName => jewelryName.id !== id))
    toast.success('Jewelry name deleted successfully!')
  }

  const handleToggleJewelryName = (id: string) => {
    setMasterJewelryNames(prev => 
      prev.map(jewelryName => 
        jewelryName.id === id ? { ...jewelryName, isActive: !jewelryName.isActive } : jewelryName
      )
    )
    toast.success('Jewelry name status updated!')
  }



  const handleAddPurityStandard = (name: string, value: number, description: string, category: string) => {
    const newPurity = {
      id: `P${Date.now()}`,
      name,
      value,
      description,
      category,
      isActive: true
    }
    setPurityStandards([...purityStandards, newPurity])
    toast.success('Purity standard added successfully!')
  }

  const handleEditPurityStandard = (id: string, name: string, value: number, description: string, category: string) => {
    setPurityStandards(prev => 
      prev.map(purity => 
        purity.id === id ? { ...purity, name, value, description, category } : purity
      )
    )
    toast.success('Purity standard updated successfully!')
  }

  const handleDeletePurityStandard = (id: string) => {
    setPurityStandards(prev => prev.filter(purity => purity.id !== id))
    toast.success('Purity standard deleted successfully!')
  }



  // WhatsApp Templates CRUD Functions
  const handleAddWhatsAppTemplate = (name: string, message: string, variables: string[]) => {
    const newTemplate = {
      id: `WT${Date.now()}`,
      name,
      type: 'whatsapp' as const,
      message,
      variables,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setWhatsappTemplates([...whatsappTemplates, newTemplate])
    toast.success('WhatsApp template added successfully!')
  }

  const handleEditWhatsAppTemplate = (id: string, name: string, message: string, variables: string[]) => {
    setWhatsappTemplates(prev => 
      prev.map(template => 
        template.id === id ? { ...template, name, message, variables, updatedAt: new Date().toISOString() } : template
      )
    )
    toast.success('WhatsApp template updated successfully!')
  }

  const handleDeleteWhatsAppTemplate = (id: string) => {
    setWhatsappTemplates(prev => prev.filter(template => template.id !== id))
    toast.success('WhatsApp template deleted successfully!')
  }

  // Keyboard Shortcuts CRUD Functions
  const handleAddKeyboardShortcut = (key: string, action: string, description: string) => {
    const newShortcut = {
      key,
      action,
      description
    }
    setKeyboardShortcuts([...keyboardShortcuts, newShortcut])
    toast.success('Keyboard shortcut added successfully!')
  }

  const handleEditKeyboardShortcut = (index: number, key: string, action: string, description: string) => {
    setKeyboardShortcuts(prev => 
      prev.map((shortcut, i) => 
        i === index ? { key, action, description } : shortcut
      )
    )
    toast.success('Keyboard shortcut updated successfully!')
  }

  const handleDeleteKeyboardShortcut = (index: number) => {
    setKeyboardShortcuts(prev => prev.filter((_, i) => i !== index))
    toast.success('Keyboard shortcut deleted successfully!')
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Gold': 'bg-yellow-100 text-yellow-800',
      'Silver': 'bg-gray-100 text-gray-800',
      'Diamond': 'bg-blue-100 text-blue-800',
      'Platinum': 'bg-purple-100 text-purple-800'
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  const getHealthStatusColor = (status: string) => {
    return status === 'healthy' ? 'text-green-600' : 'text-red-600'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings & Configuration</h1>
          <p className="text-gray-600">Manage system settings and master data</p>
        </div>
        <Button onClick={() => toast.success('All settings saved!')}>
          <Save className="w-4 h-4 mr-2" />
          Save All
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'system', label: 'System Settings', icon: SettingsIcon },
            { id: 'master', label: 'Master Data', icon: Database },
            { id: 'backup', label: 'Backup & Restore', icon: HardDrive },
            { id: 'templates', label: 'WhatsApp Templates', icon: MessageSquare },
            { id: 'shortcuts', label: 'Keyboard Shortcuts', icon: Keyboard },
            { id: 'admin', label: 'Admin Panel', icon: Shield }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* System Settings Tab */}
      {activeTab === 'system' && (
        <div className="space-y-6">
          {/* License Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Key className="w-5 h-5 text-blue-500" />
                <span>License Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">License Type:</span>
                    <Badge variant="secondary">Trial</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Status:</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Expiry Date:</span>
                    <span className="text-sm text-gray-900">2024-12-31</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Days Remaining:</span>
                    <span className="text-sm text-gray-900">15 days</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Features:</h4>
                  <div className="space-y-1">
                    {['All Features', 'Unlimited Records', 'Backup & Restore', 'Reports & Analytics'].map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <SettingsIcon className="w-5 h-5 text-gray-500" />
                <span>System Settings</span>
              </CardTitle>
              <CardDescription>
                Configure default values and system preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {systemSettings.map((setting) => (
                  <div key={setting.key} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{setting.description}</h4>
                      <p className="text-xs text-gray-500">Key: {setting.key}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {setting.key.includes('enabled') ? (
                        <select
                          value={setting.value}
                          onChange={(e) => handleSaveSetting(setting.key, e.target.value)}
                          className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                        >
                          <option value="true">Enabled</option>
                          <option value="false">Disabled</option>
                        </select>
                      ) : setting.key === 'backup_frequency' ? (
                        <select
                          value={setting.value}
                          onChange={(e) => handleSaveSetting(setting.key, e.target.value)}
                          className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                        >
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                        </select>
                      ) : (
                        <Input
                          value={setting.value}
                          onChange={(e) => handleSaveSetting(setting.key, e.target.value)}
                          className="w-32"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-purple-500" />
                <span>Notification Settings</span>
              </CardTitle>
              <CardDescription>
                Configure notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { icon: MessageSquare, name: 'WhatsApp', enabled: true },
                  { icon: Mail, name: 'Email', enabled: true },
                  { icon: Phone, name: 'SMS', enabled: false }
                ].map((notification) => (
                  <div key={notification.name} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-2">
                      <notification.icon className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium">{notification.name}</span>
                    </div>
                    <Button
                      variant={notification.enabled ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toast.success(`${notification.name} ${notification.enabled ? 'disabled' : 'enabled'}!`)}
                    >
                      {notification.enabled ? 'Enabled' : 'Disabled'}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Master Data Tab */}
      {activeTab === 'master' && (
        <div className="space-y-6">
          {/* Jewelry Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Gem className="w-5 h-5 text-yellow-500" />
                                      <span>Jewelry Categories</span>
                </div>
                <Button onClick={() => setIsAddJewelryCategoryModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                                      Add Jewelry Category
                </Button>
              </CardTitle>
              <CardDescription>
                Manage jewelry categories
              </CardDescription>
            </CardHeader>
            <CardContent>
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                 {jewelryCategories.map((category) => (
                   <div key={category.id} className="flex items-center justify-between p-3 border rounded-lg">
                     <div className="flex items-center space-x-3">
                       <span className="text-sm font-medium text-gray-900">{category.name}</span>
                     </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleJewelryCategory(category.id)}
                      >
                        {category.isActive ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <X className="w-4 h-4 text-red-500" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedJewelryCategory(category)
                          setIsEditJewelryCategoryModalOpen(true)
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteJewelryCategory(category.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>



          {/* Purity Standards */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Crown className="w-5 h-5 text-yellow-500" />
                  <span>Purity Standards</span>
                </div>
                <Button onClick={() => setIsAddPurityModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Purity Standard
                </Button>
              </CardTitle>
              <CardDescription>
                Manage gold, silver, and other metal purity standards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Value
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {purityStandards.map((purity) => (
                      <tr key={purity.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {purity.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <Badge variant="outline">{purity.category}</Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {purity.value}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {purity.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={purity.isActive ? 'default' : 'secondary'}>
                            {purity.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedPurity(purity)
                                setIsEditPurityModalOpen(true)
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeletePurityStandard(purity.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Master Jewelry Names */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Gem className="w-5 h-5 text-purple-500" />
                  <span>Master Jewelry Names</span>
                </div>
                <Button onClick={() => setIsAddJewelryNameModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Jewelry Name
                </Button>
              </CardTitle>
              <CardDescription>
                Manage master jewelry names for different categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {masterJewelryNames.map((jewelryName) => (
                      <tr key={jewelryName.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {jewelryName.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className={getCategoryColor(jewelryName.category)}>
                            {jewelryName.category}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={jewelryName.isActive ? 'default' : 'secondary'}>
                            {jewelryName.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleJewelryName(jewelryName.id)}
                            >
                              {jewelryName.isActive ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : (
                                <X className="w-4 h-4 text-red-500" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedJewelryName(jewelryName)
                                setIsEditJewelryNameModalOpen(true)
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteJewelryName(jewelryName.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>


        </div>
      )}

      {/* Backup & Restore Tab */}
      {activeTab === 'backup' && (
        <div className="space-y-6">
          {/* Backup Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <HardDrive className="w-5 h-5 text-blue-500" />
                <span>Backup Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <DatabaseIcon className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium">Database</span>
                  </div>
                  <p className="text-xs text-gray-600">Last backup: {new Date(systemHealth.database.lastBackup).toLocaleString()}</p>
                  <p className="text-xs text-gray-600">Size: {systemHealth.database.size}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Cloud className="w-5 h-5 text-blue-500" />
                    <span className="text-sm font-medium">Storage</span>
                  </div>
                  <p className="text-xs text-gray-600">Used: {systemHealth.storage.used}</p>
                  <p className="text-xs text-gray-600">Free: {systemHealth.storage.free}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Activity className="w-5 h-5 text-purple-500" />
                    <span className="text-sm font-medium">System</span>
                  </div>
                  <p className="text-xs text-gray-600">Memory: {systemHealth.memory.used}</p>
                  <p className="text-xs text-gray-600">CPU: {systemHealth.cpu.usage}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Backup Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Download className="w-5 h-5 text-green-500" />
                <span>Backup & Restore</span>
              </CardTitle>
              <CardDescription>
                Create backups and restore your data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-gray-900">Backup</h4>
                  <div className="space-y-2">
                    <Button onClick={handleBackup} className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Create Backup
                    </Button>
                    <Button onClick={handleExportData} variant="outline" className="w-full">
                      <FileText className="w-4 h-4 mr-2" />
                      Export Data
                    </Button>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-gray-900">Restore</h4>
                  <div className="space-y-2">
                    <Button onClick={handleRestore} variant="outline" className="w-full">
                      <Upload className="w-4 h-4 mr-2" />
                      Restore from Backup
                    </Button>
                    <Button onClick={handleImportData} variant="outline" className="w-full">
                      <FileText className="w-4 h-4 mr-2" />
                      Import Data
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Backup History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-gray-500" />
                <span>Backup History</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { date: '2024-12-10 08:00', type: 'Auto', size: '2.5 MB', status: 'Success' },
                  { date: '2024-12-09 08:00', type: 'Auto', size: '2.4 MB', status: 'Success' },
                  { date: '2024-12-08 08:00', type: 'Auto', size: '2.3 MB', status: 'Success' },
                  { date: '2024-12-07 15:30', type: 'Manual', size: '2.2 MB', status: 'Success' }
                ].map((backup, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">{backup.date}</p>
                        <p className="text-xs text-gray-500">{backup.type} Backup • {backup.size}</p>
                      </div>
                    </div>
                    <Badge variant="default">{backup.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* WhatsApp Templates Tab */}
      {activeTab === 'templates' && (
        <div className="space-y-6">
                     <Card>
             <CardHeader>
               <CardTitle className="flex items-center justify-between">
                 <div className="flex items-center space-x-2">
                   <MessageSquare className="w-5 h-5 text-green-500" />
                   <span>WhatsApp Templates</span>
                 </div>
                 <Button onClick={() => setIsAddWhatsAppTemplateModalOpen(true)}>
                   <Plus className="w-4 h-4 mr-2" />
                   Add Template
                 </Button>
               </CardTitle>
               <CardDescription>
                 Manage WhatsApp message templates for communication
               </CardDescription>
             </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {whatsappTemplates.map((template) => (
                  <div key={template.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <MessageSquare className="w-4 h-4 text-green-500" />
                        <span className="font-medium">{template.name}</span>
                        <Badge variant={template.isActive ? 'default' : 'secondary'}>
                          {template.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedWhatsAppTemplate(template)
                            setIsEditWhatsAppTemplateModalOpen(true)
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteWhatsAppTemplate(template.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{template.message}</p>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">Variables:</span>
                      {template.variables.map((variable, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {variable}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Keyboard Shortcuts Tab */}
      {activeTab === 'shortcuts' && (
        <div className="space-y-6">
                     <Card>
             <CardHeader>
               <CardTitle className="flex items-center justify-between">
                 <div className="flex items-center space-x-2">
                   <Keyboard className="w-5 h-5 text-purple-500" />
                   <span>Keyboard Shortcuts</span>
                 </div>
                 <Button onClick={() => setIsAddShortcutModalOpen(true)}>
                   <Plus className="w-4 h-4 mr-2" />
                   Add Shortcut
                 </Button>
               </CardTitle>
               <CardDescription>
                 View and customize keyboard shortcuts
               </CardDescription>
             </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {keyboardShortcuts.map((shortcut, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{shortcut.action}</p>
                      <p className="text-xs text-gray-500">{shortcut.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="font-mono">
                        {shortcut.key}
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setSelectedShortcut({ ...shortcut, index })
                          setIsEditShortcutModalOpen(true)
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteKeyboardShortcut(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Admin Panel Tab */}
      {activeTab === 'admin' && (
        <div className="space-y-6">
          {/* System Health */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-green-500" />
                <span>System Health</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {Object.entries(systemHealth).map(([key, value]) => (
                  <div key={key} className="p-4 border rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className={`w-2 h-2 rounded-full ${getHealthStatusColor(value.status)}`}></div>
                      <span className="text-sm font-medium capitalize">{key}</span>
                    </div>
                    {key === 'database' && (
                      <div className="text-xs text-gray-600">
                        <p>Last backup: {new Date(value.lastBackup).toLocaleString()}</p>
                        <p>Size: {value.size}</p>
                      </div>
                    )}
                    {key === 'storage' && (
                      <div className="text-xs text-gray-600">
                        <p>Used: {value.used}</p>
                        <p>Free: {value.free}</p>
                      </div>
                    )}
                    {key === 'memory' && (
                      <div className="text-xs text-gray-600">
                        <p>Used: {value.used}</p>
                        <p>Free: {value.free}</p>
                      </div>
                    )}
                    {key === 'cpu' && (
                      <div className="text-xs text-gray-600">
                        <p>Usage: {value.usage}</p>
                      </div>
                    )}
                    {key === 'network' && (
                      <div className="text-xs text-gray-600">
                        <p>Uptime: {value.uptime}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* User Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-500" />
                <span>User Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Login
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {adminUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={user.isActive ? 'default' : 'secondary'}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(user.lastLogin).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Lock className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Access Logs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-gray-500" />
                <span>Access Logs</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {accessLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${log.status === 'success' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <div>
                        <p className="text-sm font-medium">{log.user}</p>
                        <p className="text-xs text-gray-500">{log.action} • {log.ip}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-900">{new Date(log.timestamp).toLocaleString()}</p>
                      <Badge variant={log.status === 'success' ? 'default' : 'destructive'}>
                        {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
                 </div>
       )}

       {/* Modal Components */}
       
             {/* Add Jewelry Category Modal */}
      {isAddJewelryCategoryModalOpen && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
           <div className="bg-white rounded-lg p-6 w-96">
             <div className="flex items-center justify-between mb-4">
                               <h3 className="text-lg font-semibold">Add Jewelry Category</h3>
               <Button variant="ghost" size="sm" onClick={() => setIsAddJewelryCategoryModalOpen(false)}>
                 <X className="w-4 h-4" />
               </Button>
             </div>
                           <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <Input placeholder="Enter jewelry category name" id="jewelryCategoryName" />
                </div>
                <div className="flex space-x-2">
                  <Button 
                    className="flex-1"
                    onClick={() => {
                                              const name = (document.getElementById('jewelryCategoryName') as HTMLInputElement)?.value
                      if (name) {
                        handleAddJewelryCategory(name)
                        setIsAddJewelryCategoryModalOpen(false)
                      }
                    }}
                  >
                    Add
                  </Button>
                 <Button variant="outline" className="flex-1" onClick={() => setIsAddJewelryCategoryModalOpen(false)}>
                   Cancel
                 </Button>
               </div>
             </div>
           </div>
         </div>
       )}

       {/* Edit Jewelry Category Modal */}
       {isEditJewelryCategoryModalOpen && selectedJewelryCategory && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
           <div className="bg-white rounded-lg p-6 w-96">
             <div className="flex items-center justify-between mb-4">
               <h3 className="text-lg font-semibold">Edit Jewelry Category</h3>
               <Button variant="ghost" size="sm" onClick={() => setIsEditJewelryCategoryModalOpen(false)}>
                 <X className="w-4 h-4" />
               </Button>
             </div>
                           <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <Input defaultValue={selectedJewelryCategory.name} id="editJewelryCategoryName" />
                </div>
                <div className="flex space-x-2">
                  <Button 
                    className="flex-1"
                    onClick={() => {
                      const name = (document.getElementById('editJewelryCategoryName') as HTMLInputElement)?.value
                      if (name) {
                        handleEditJewelryCategory(selectedJewelryCategory.id, name)
                        setIsEditJewelryCategoryModalOpen(false)
                      }
                    }}
                  >
                    Update
                  </Button>
                 <Button variant="outline" className="flex-1" onClick={() => setIsEditJewelryCategoryModalOpen(false)}>
                   Cancel
                 </Button>
               </div>
             </div>
           </div>
         </div>
       )}





       {/* Add Purity Standard Modal */}
       {isAddPurityModalOpen && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
           <div className="bg-white rounded-lg p-6 w-96">
             <div className="flex items-center justify-between mb-4">
               <h3 className="text-lg font-semibold">Add Purity Standard</h3>
               <Button variant="ghost" size="sm" onClick={() => setIsAddPurityModalOpen(false)}>
                 <X className="w-4 h-4" />
               </Button>
             </div>
             <div className="space-y-4">
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                 <Input placeholder="e.g., 24K" id="purityName" />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                 <Input type="number" placeholder="e.g., 24" id="purityValue" />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                 <select
                   id="purityCategory"
                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                 >
                   <option value="">Select Category</option>
                   {jewelryCategories
                     .filter(cat => cat.isActive)
                     .map(cat => (
                       <option key={cat.id} value={cat.name}>{cat.name}</option>
                     ))}
                 </select>
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                 <Input placeholder="e.g., Pure gold (99.9% pure)" id="purityDescription" />
               </div>
               <div className="flex space-x-2">
                 <Button 
                   className="flex-1"
                   onClick={() => {
                     const name = (document.getElementById('purityName') as HTMLInputElement)?.value
                     const value = parseInt((document.getElementById('purityValue') as HTMLInputElement)?.value || '0')
                     const description = (document.getElementById('purityDescription') as HTMLInputElement)?.value
                     const category = (document.getElementById('purityCategory') as HTMLSelectElement)?.value
                     if (name && value && description && category) {
                       handleAddPurityStandard(name, value, description, category)
                       setIsAddPurityModalOpen(false)
                     }
                   }}
                 >
                   Add
                 </Button>
                 <Button variant="outline" className="flex-1" onClick={() => setIsAddPurityModalOpen(false)}>
                   Cancel
                 </Button>
               </div>
             </div>
           </div>
         </div>
       )}

       {/* Edit Purity Standard Modal */}
       {isEditPurityModalOpen && selectedPurity && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
           <div className="bg-white rounded-lg p-6 w-96">
             <div className="flex items-center justify-between mb-4">
               <h3 className="text-lg font-semibold">Edit Purity Standard</h3>
               <Button variant="ghost" size="sm" onClick={() => setIsEditPurityModalOpen(false)}>
                 <X className="w-4 h-4" />
               </Button>
             </div>
             <div className="space-y-4">
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                 <Input defaultValue={selectedPurity.name} id="editPurityName" />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                 <Input type="number" defaultValue={selectedPurity.value} id="editPurityValue" />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                 <select
                   id="editPurityCategory"
                   defaultValue={selectedPurity.category}
                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                 >
                   <option value="">Select Category</option>
                   {jewelryCategories
                     .filter(cat => cat.isActive)
                     .map(cat => (
                       <option key={cat.id} value={cat.name}>{cat.name}</option>
                     ))}
                 </select>
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                 <Input defaultValue={selectedPurity.description} id="editPurityDescription" />
               </div>
               <div className="flex space-x-2">
                 <Button 
                   className="flex-1"
                   onClick={() => {
                     const name = (document.getElementById('editPurityName') as HTMLInputElement)?.value
                     const value = parseInt((document.getElementById('editPurityValue') as HTMLInputElement)?.value || '0')
                     const description = (document.getElementById('editPurityDescription') as HTMLInputElement)?.value
                     const category = (document.getElementById('editPurityCategory') as HTMLSelectElement)?.value
                     if (name && value && description && category) {
                       handleEditPurityStandard(selectedPurity.id, name, value, description, category)
                       setIsEditPurityModalOpen(false)
                     }
                   }}
                 >
                   Update
                 </Button>
                 <Button variant="outline" className="flex-1" onClick={() => setIsEditPurityModalOpen(false)}>
                   Cancel
                 </Button>
               </div>
             </div>
           </div>
         </div>
       )}

       {/* Add WhatsApp Template Modal */}
       {isAddWhatsAppTemplateModalOpen && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
           <div className="bg-white rounded-lg p-6 w-[600px] max-h-[80vh] overflow-y-auto">
             <div className="flex items-center justify-between mb-4">
               <h3 className="text-lg font-semibold">Add WhatsApp Template</h3>
               <Button variant="ghost" size="sm" onClick={() => setIsAddWhatsAppTemplateModalOpen(false)}>
                 <X className="w-4 h-4" />
               </Button>
             </div>
             <div className="space-y-4">
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Template Name</label>
                 <Input placeholder="e.g., Payment Reminder" id="templateName" />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                 <textarea 
                   className="w-full px-3 py-2 border border-gray-300 rounded-md h-32"
                   placeholder="Enter your message template with variables like {customer_name}, {amount}, etc."
                   id="templateMessage"
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Variables (comma separated)</label>
                 <Input placeholder="customer_name, amount, jewelry_id, due_date" id="templateVariables" />
               </div>
               <div className="flex space-x-2">
                 <Button 
                   className="flex-1"
                   onClick={() => {
                     const name = (document.getElementById('templateName') as HTMLInputElement)?.value
                     const message = (document.getElementById('templateMessage') as HTMLTextAreaElement)?.value
                     const variables = (document.getElementById('templateVariables') as HTMLInputElement)?.value.split(',').map(v => v.trim()).filter(v => v)
                     if (name && message && variables.length > 0) {
                       handleAddWhatsAppTemplate(name, message, variables)
                       setIsAddWhatsAppTemplateModalOpen(false)
                     }
                   }}
                 >
                   Add
                 </Button>
                 <Button variant="outline" className="flex-1" onClick={() => setIsAddWhatsAppTemplateModalOpen(false)}>
                   Cancel
                 </Button>
               </div>
             </div>
           </div>
         </div>
       )}

       {/* Add Keyboard Shortcut Modal */}
       {isAddShortcutModalOpen && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
           <div className="bg-white rounded-lg p-6 w-96">
             <div className="flex items-center justify-between mb-4">
               <h3 className="text-lg font-semibold">Add Keyboard Shortcut</h3>
               <Button variant="ghost" size="sm" onClick={() => setIsAddShortcutModalOpen(false)}>
                 <X className="w-4 h-4" />
               </Button>
             </div>
             <div className="space-y-4">
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
                 <Input placeholder="e.g., Save" id="shortcutAction" />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Shortcut</label>
                 <Input placeholder="e.g., Ctrl + S" id="shortcutKey" />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                 <Input placeholder="e.g., Save current record" id="shortcutDescription" />
               </div>
               <div className="flex space-x-2">
                 <Button 
                   className="flex-1"
                   onClick={() => {
                     const action = (document.getElementById('shortcutAction') as HTMLInputElement)?.value
                     const key = (document.getElementById('shortcutKey') as HTMLInputElement)?.value
                     const description = (document.getElementById('shortcutDescription') as HTMLInputElement)?.value
                     if (action && key && description) {
                       handleAddKeyboardShortcut(key, action, description)
                       setIsAddShortcutModalOpen(false)
                     }
                   }}
                 >
                   Add
                 </Button>
                 <Button variant="outline" className="flex-1" onClick={() => setIsAddShortcutModalOpen(false)}>
                   Cancel
                 </Button>
               </div>
             </div>
           </div>
         </div>
       )}

       {/* Edit WhatsApp Template Modal */}
       {isEditWhatsAppTemplateModalOpen && selectedWhatsAppTemplate && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
           <div className="bg-white rounded-lg p-6 w-[600px] max-h-[80vh] overflow-y-auto">
             <div className="flex items-center justify-between mb-4">
               <h3 className="text-lg font-semibold">Edit WhatsApp Template</h3>
               <Button variant="ghost" size="sm" onClick={() => setIsEditWhatsAppTemplateModalOpen(false)}>
                 <X className="w-4 h-4" />
               </Button>
             </div>
             <div className="space-y-4">
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Template Name</label>
                 <Input defaultValue={selectedWhatsAppTemplate.name} id="editTemplateName" />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                 <textarea 
                   className="w-full px-3 py-2 border border-gray-300 rounded-md h-32"
                   defaultValue={selectedWhatsAppTemplate.message}
                   id="editTemplateMessage"
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Variables (comma separated)</label>
                 <Input defaultValue={selectedWhatsAppTemplate.variables.join(', ')} id="editTemplateVariables" />
               </div>
               <div className="flex space-x-2">
                 <Button 
                   className="flex-1"
                   onClick={() => {
                     const name = (document.getElementById('editTemplateName') as HTMLInputElement)?.value
                     const message = (document.getElementById('editTemplateMessage') as HTMLTextAreaElement)?.value
                     const variables = (document.getElementById('editTemplateVariables') as HTMLInputElement)?.value.split(',').map(v => v.trim()).filter(v => v)
                     if (name && message && variables.length > 0) {
                       handleEditWhatsAppTemplate(selectedWhatsAppTemplate.id, name, message, variables)
                       setIsEditWhatsAppTemplateModalOpen(false)
                     }
                   }}
                 >
                   Update
                 </Button>
                 <Button variant="outline" className="flex-1" onClick={() => setIsEditWhatsAppTemplateModalOpen(false)}>
                   Cancel
                 </Button>
               </div>
             </div>
           </div>
         </div>
       )}

       {/* Edit Keyboard Shortcut Modal */}
       {isEditShortcutModalOpen && selectedShortcut && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
           <div className="bg-white rounded-lg p-6 w-96">
             <div className="flex items-center justify-between mb-4">
               <h3 className="text-lg font-semibold">Edit Keyboard Shortcut</h3>
               <Button variant="ghost" size="sm" onClick={() => setIsEditShortcutModalOpen(false)}>
                 <X className="w-4 h-4" />
               </Button>
             </div>
             <div className="space-y-4">
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
                 <Input defaultValue={selectedShortcut.action} id="editShortcutAction" />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Shortcut</label>
                 <Input defaultValue={selectedShortcut.key} id="editShortcutKey" />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                 <Input defaultValue={selectedShortcut.description} id="editShortcutDescription" />
               </div>
               <div className="flex space-x-2">
                 <Button 
                   className="flex-1"
                   onClick={() => {
                     const action = (document.getElementById('editShortcutAction') as HTMLInputElement)?.value
                     const key = (document.getElementById('editShortcutKey') as HTMLInputElement)?.value
                     const description = (document.getElementById('editShortcutDescription') as HTMLInputElement)?.value
                     if (action && key && description) {
                       handleEditKeyboardShortcut(selectedShortcut.index, key, action, description)
                       setIsEditShortcutModalOpen(false)
                     }
                   }}
                 >
                   Update
                 </Button>
                 <Button variant="outline" className="flex-1" onClick={() => setIsEditShortcutModalOpen(false)}>
                   Cancel
                 </Button>
               </div>
             </div>
           </div>
         </div>
               )}

        {/* Add Jewelry Name Modal */}
        {isAddJewelryNameModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Add Jewelry Name</h3>
                <Button variant="ghost" size="sm" onClick={() => setIsAddJewelryNameModalOpen(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <Input placeholder="Enter jewelry name" id="jewelryName" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    id="jewelryNameCategory"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Category</option>
                    {jewelryCategories.filter(cat => cat.isActive).map(category => (
                      <option key={category.id} value={category.name}>{category.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    className="flex-1"
                    onClick={() => {
                      const name = (document.getElementById('jewelryName') as HTMLInputElement)?.value
                      const category = (document.getElementById('jewelryNameCategory') as HTMLSelectElement)?.value
                      if (name && category) {
                        handleAddJewelryName(name, category)
                        setIsAddJewelryNameModalOpen(false)
                      }
                    }}
                  >
                    Add
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={() => setIsAddJewelryNameModalOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Jewelry Name Modal */}
        {isEditJewelryNameModalOpen && selectedJewelryName && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Edit Jewelry Name</h3>
                <Button variant="ghost" size="sm" onClick={() => setIsEditJewelryNameModalOpen(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <Input defaultValue={selectedJewelryName.name} id="editJewelryName" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    id="editJewelryNameCategory"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue={selectedJewelryName.category}
                  >
                    <option value="">Select Category</option>
                    {jewelryCategories.filter(cat => cat.isActive).map(category => (
                      <option key={category.id} value={category.name}>{category.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    className="flex-1"
                    onClick={() => {
                      const name = (document.getElementById('editJewelryName') as HTMLInputElement)?.value
                      const category = (document.getElementById('editJewelryNameCategory') as HTMLSelectElement)?.value
                      if (name && category) {
                        handleEditJewelryName(selectedJewelryName.id, name, category)
                        setIsEditJewelryNameModalOpen(false)
                      }
                    }}
                  >
                    Update
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={() => setIsEditJewelryNameModalOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }
 
 export default Settings 