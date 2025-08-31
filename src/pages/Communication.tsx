import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

import { 
  MessageSquare, 
  Mail, 
  Phone, 
  FileText, 
  Share2, 
  Send, 
  Settings,
  Plus,
  Edit,
  Eye,
  Activity,
  X,
  Download,
  Upload,
  Trash2,
  CheckCircle,
  AlertCircle,
  Clock,
  User,
  Calendar,
  Search,
  Filter
} from 'lucide-react'
import { toast } from 'react-hot-toast'

interface CommunicationTemplate {
  id: string
  name: string
  type: 'whatsapp' | 'email' | 'sms'
  subject?: string
  message: string
  variables: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface CommunicationLog {
  id: string
  type: 'whatsapp' | 'email' | 'sms'
  recipient: string
  subject?: string
  message: string
  status: 'sent' | 'delivered' | 'failed' | 'pending'
  sentAt: string
  deliveredAt?: string
  errorMessage?: string
}

interface DocumentShare {
  id: string
  name: string
  type: 'report' | 'invoice' | 'receipt' | 'contract'
  recipient: string
  method: 'email' | 'whatsapp' | 'link'
  status: 'shared' | 'viewed' | 'downloaded' | 'expired'
  sharedAt: string
  expiresAt?: string
  downloadUrl?: string
}

const Communication: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'whatsapp' | 'email' | 'sms' | 'documents' | 'templates' | 'logs'>('whatsapp')
  const [isSendModalOpen, setIsSendModalOpen] = useState(false)
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false)
  const [isDocumentShareModalOpen, setIsDocumentShareModalOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<CommunicationTemplate | null>(null)
  const [selectedDocument, setSelectedDocument] = useState<DocumentShare | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  // WhatsApp Templates
  const [whatsappTemplates, setWhatsappTemplates] = useState<CommunicationTemplate[]>([
    {
      id: '1',
      name: 'Payment Reminder',
      type: 'whatsapp',
      message: 'Dear {customer_name}, your payment of ₹{amount} for jewelry {jewelry_id} is due on {due_date}. Please contact us for any queries.',
      variables: ['customer_name', 'amount', 'jewelry_id', 'due_date'],
      isActive: true,
      createdAt: '2024-12-01T10:00:00Z',
      updatedAt: '2024-12-01T10:00:00Z'
    },
    {
      id: '2',
      name: 'Interest Payment',
      type: 'whatsapp',
      message: 'Hello {customer_name}, your interest payment of ₹{interest_amount} for jewelry {jewelry_id} has been received. Thank you!',
      variables: ['customer_name', 'interest_amount', 'jewelry_id'],
      isActive: true,
      createdAt: '2024-12-01T10:00:00Z',
      updatedAt: '2024-12-01T10:00:00Z'
    },
    {
      id: '3',
      name: 'Jewelry Release',
      type: 'whatsapp',
      message: 'Dear {customer_name}, your jewelry {jewelry_id} has been released. Please collect it from our office. Thank you for your business!',
      variables: ['customer_name', 'jewelry_id'],
      isActive: true,
      createdAt: '2024-12-01T10:00:00Z',
      updatedAt: '2024-12-01T10:00:00Z'
    }
  ])

  // Email Templates
  const [emailTemplates, setEmailTemplates] = useState<CommunicationTemplate[]>([
    {
      id: '4',
      name: 'Payment Reminder',
      type: 'email',
      subject: 'Payment Reminder - Jewelry Girvi System',
      message: 'Dear {customer_name},\n\nThis is a reminder that your payment of ₹{amount} for jewelry {jewelry_id} is due on {due_date}.\n\nPlease contact us if you have any questions.\n\nBest regards,\nJewelry Girvi System',
      variables: ['customer_name', 'amount', 'jewelry_id', 'due_date'],
      isActive: true,
      createdAt: '2024-12-01T10:00:00Z',
      updatedAt: '2024-12-01T10:00:00Z'
    },
    {
      id: '5',
      name: 'Monthly Statement',
      type: 'email',
      subject: 'Monthly Statement - {month_year}',
      message: 'Dear {customer_name},\n\nPlease find attached your monthly statement for {month_year}.\n\nTotal Amount: ₹{total_amount}\nInterest Paid: ₹{interest_paid}\nBalance: ₹{balance}\n\nBest regards,\nJewelry Girvi System',
      variables: ['customer_name', 'month_year', 'total_amount', 'interest_paid', 'balance'],
      isActive: true,
      createdAt: '2024-12-01T10:00:00Z',
      updatedAt: '2024-12-01T10:00:00Z'
    }
  ])

  // SMS Templates
  const [smsTemplates, setSmsTemplates] = useState<CommunicationTemplate[]>([
    {
      id: '6',
      name: 'Payment Reminder',
      type: 'sms',
      message: 'Dear {customer_name}, payment of ₹{amount} for jewelry {jewelry_id} due on {due_date}. Contact us for queries.',
      variables: ['customer_name', 'amount', 'jewelry_id', 'due_date'],
      isActive: true,
      createdAt: '2024-12-01T10:00:00Z',
      updatedAt: '2024-12-01T10:00:00Z'
    },
    {
      id: '7',
      name: 'Interest Payment',
      type: 'sms',
      message: 'Hello {customer_name}, interest payment of ₹{interest_amount} for jewelry {jewelry_id} received. Thank you!',
      variables: ['customer_name', 'interest_amount', 'jewelry_id'],
      isActive: true,
      createdAt: '2024-12-01T10:00:00Z',
      updatedAt: '2024-12-01T10:00:00Z'
    }
  ])

  // Communication Logs
  const [logs, setLogs] = useState<CommunicationLog[]>([
    {
      id: '1',
      type: 'whatsapp',
      recipient: '+91 98765 43210',
      message: 'Dear Rajesh Kumar, your payment of ₹50,000 for jewelry JG001 is due on 15/12/2024. Please contact us for any queries.',
      status: 'delivered',
      sentAt: '2024-12-10T10:30:00Z',
      deliveredAt: '2024-12-10T10:31:00Z'
    },
    {
      id: '2',
      type: 'email',
      recipient: 'rajesh.kumar@email.com',
      subject: 'Payment Reminder - Jewelry Girvi System',
      message: 'Dear Rajesh Kumar, your payment of ₹50,000 for jewelry JG001 is due on 15/12/2024.',
      status: 'sent',
      sentAt: '2024-12-10T10:30:00Z'
    },
    {
      id: '3',
      type: 'sms',
      recipient: '+91 98765 43210',
      message: 'Dear Rajesh Kumar, payment of ₹50,000 for jewelry JG001 due on 15/12/2024. Contact us for queries.',
      status: 'delivered',
      sentAt: '2024-12-10T10:30:00Z',
      deliveredAt: '2024-12-10T10:31:00Z'
    }
  ])

  // Document Shares
  const [documentShares, setDocumentShares] = useState<DocumentShare[]>([
    {
      id: '1',
      name: 'Payment Receipt - JG001',
      type: 'receipt',
      recipient: 'rajesh.kumar@email.com',
      method: 'email',
      status: 'viewed',
      sharedAt: '2024-12-10T10:30:00Z',
      downloadUrl: 'https://example.com/receipts/JG001.pdf'
    },
    {
      id: '2',
      name: 'Monthly Statement - December 2024',
      type: 'report',
      recipient: '+91 98765 43210',
      method: 'whatsapp',
      status: 'shared',
      sharedAt: '2024-12-10T10:30:00Z',
      downloadUrl: 'https://example.com/statements/dec2024.pdf'
    },
    {
      id: '3',
      name: 'Jewelry Contract - JG002',
      type: 'contract',
      recipient: 'priya.sharma@email.com',
      method: 'email',
      status: 'downloaded',
      sharedAt: '2024-12-09T14:20:00Z',
      downloadUrl: 'https://example.com/contracts/JG002.pdf'
    }
  ])

  const handleSendMessage = (template: CommunicationTemplate) => {
    setSelectedTemplate(template)
    setIsSendModalOpen(true)
  }

  const handleSendMessageSubmit = (variables: any) => {
    if (!selectedTemplate) return

    const newLog: CommunicationLog = {
      id: `LOG${Date.now()}`,
      type: selectedTemplate.type,
      recipient: variables.recipient || 'demo@example.com',
      subject: selectedTemplate.subject,
      message: selectedTemplate.message.replace(/\{(\w+)\}/g, (match, key) => variables[key] || match),
      status: 'sent',
      sentAt: new Date().toISOString()
    }

    setLogs([newLog, ...logs])
    setIsSendModalOpen(false)
    setSelectedTemplate(null)
    toast.success(`${selectedTemplate.type.charAt(0).toUpperCase() + selectedTemplate.type.slice(1)} message sent successfully!`)
  }

  const handleShareDocument = (document: DocumentShare) => {
    const newShare: DocumentShare = {
      id: `DOC${Date.now()}`,
      name: document.name,
      type: document.type,
      recipient: document.recipient,
      method: document.method,
      status: 'shared',
      sharedAt: new Date().toISOString(),
      downloadUrl: `https://example.com/documents/${document.id}.pdf`
    }

    setDocumentShares([newShare, ...documentShares])
    toast.success('Document shared successfully!')
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      sent: 'default',
      delivered: 'default',
      failed: 'destructive',
      pending: 'secondary',
      shared: 'default',
      viewed: 'default',
      downloaded: 'default',
      expired: 'destructive'
    } as const

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'whatsapp':
        return <MessageSquare className="w-4 h-4" />
      case 'email':
        return <Mail className="w-4 h-4" />
      case 'sms':
        return <Phone className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const getAllTemplates = () => [...whatsappTemplates, ...emailTemplates, ...smsTemplates]

  const getFilteredLogs = () => {
    return logs.filter(log => 
      log.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.type.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Communication & Integration</h1>
          <p className="text-gray-600">Manage WhatsApp, Email, SMS, and document sharing</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button onClick={() => setIsTemplateModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Template
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
            { id: 'email', label: 'Email', icon: Mail },
            { id: 'sms', label: 'SMS', icon: Phone },
            { id: 'documents', label: 'Documents', icon: FileText },
            { id: 'templates', label: 'Templates', icon: Edit },
            { id: 'logs', label: 'Communication Logs', icon: Activity }
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

      {/* WhatsApp Tab */}
      {activeTab === 'whatsapp' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whatsappTemplates.map((template) => (
              <Card key={template.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="w-5 h-5 text-green-500" />
                      <span>{template.name}</span>
                    </div>
                    <Badge variant={template.isActive ? 'default' : 'secondary'}>
                      {template.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    {template.variables.length} variables available
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {template.message}
                  </p>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleSendMessage(template)}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Email Tab */}
      {activeTab === 'email' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {emailTemplates.map((template) => (
              <Card key={template.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-5 h-5 text-blue-500" />
                      <span>{template.name}</span>
                    </div>
                    <Badge variant={template.isActive ? 'default' : 'secondary'}>
                      {template.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Subject: {template.subject}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {template.message}
                  </p>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleSendMessage(template)}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* SMS Tab */}
      {activeTab === 'sms' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {smsTemplates.map((template) => (
              <Card key={template.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Phone className="w-5 h-5 text-purple-500" />
                      <span>{template.name}</span>
                    </div>
                    <Badge variant={template.isActive ? 'default' : 'secondary'}>
                      {template.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    {template.variables.length} variables available
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {template.message}
                  </p>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleSendMessage(template)}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Documents Tab */}
      {activeTab === 'documents' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Document Sharing</h2>
            <Button onClick={() => setIsDocumentShareModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Share Document
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Document
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Recipient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Shared
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {documentShares.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{doc.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="secondary">
                        {doc.type.charAt(0).toUpperCase() + doc.type.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {doc.recipient}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="outline">
                        {doc.method.charAt(0).toUpperCase() + doc.method.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(doc.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(doc.sharedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleShareDocument(doc)}
                        >
                          <Share2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(doc.downloadUrl, '_blank')}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getAllTemplates().map((template) => (
              <Card key={template.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {template.type === 'whatsapp' ? (
                        <MessageSquare className="w-5 h-5 text-green-500" />
                      ) : template.type === 'email' ? (
                        <Mail className="w-5 h-5 text-blue-500" />
                      ) : (
                        <Phone className="w-5 h-5 text-purple-500" />
                      )}
                      <span>{template.name}</span>
                    </div>
                    <Badge variant={template.isActive ? 'default' : 'secondary'}>
                      {template.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    {template.variables.length} variables available
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {template.message}
                  </p>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleSendMessage(template)}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Communication Logs Tab */}
      {activeTab === 'logs' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Communication Logs</h2>
            <div className="flex space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Recipient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Delivered
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getFilteredLogs().map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(log.type)}
                        <Badge variant="outline">
                          {log.type.charAt(0).toUpperCase() + log.type.slice(1)}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.recipient}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.subject || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(log.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(log.sentAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.deliveredAt ? new Date(log.deliveredAt).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Send Message Modal */}
      {isSendModalOpen && selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">Send {selectedTemplate.type.charAt(0).toUpperCase() + selectedTemplate.type.slice(1)} Message</h2>
              <Button variant="ghost" size="sm" onClick={() => setIsSendModalOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipient
                </label>
                <Input
                  placeholder="Enter recipient"
                  className="w-full"
                />
              </div>
              
              {selectedTemplate.variables.map((variable) => (
                <div key={variable}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {variable.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </label>
                  <Input
                    placeholder={`Enter ${variable.replace(/_/g, ' ')}`}
                    className="w-full"
                  />
                </div>
              ))}
              
              <div className="flex justify-end space-x-3 pt-6 border-t">
                <Button variant="outline" onClick={() => setIsSendModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => handleSendMessageSubmit({ recipient: 'demo@example.com' })}>
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Document Share Modal */}
      {isDocumentShareModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">Share Document</h2>
              <Button variant="ghost" size="sm" onClick={() => setIsDocumentShareModalOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Name
                </label>
                <Input
                  placeholder="Enter document name"
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Type
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="report">Report</option>
                  <option value="invoice">Invoice</option>
                  <option value="receipt">Receipt</option>
                  <option value="contract">Contract</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipient
                </label>
                <Input
                  placeholder="Enter recipient email or phone"
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Share Method
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="email">Email</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="link">Link</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-3 pt-6 border-t">
                <Button variant="outline" onClick={() => setIsDocumentShareModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  handleShareDocument({
                    id: 'demo',
                    name: 'Demo Document',
                    type: 'report',
                    recipient: 'demo@example.com',
                    method: 'email',
                    status: 'shared',
                    sharedAt: new Date().toISOString()
                  })
                  setIsDocumentShareModalOpen(false)
                }}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Document
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Communication 