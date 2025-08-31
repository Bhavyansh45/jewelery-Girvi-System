import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, 
  Download, 
  Filter, 
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Gem,
  BarChart3,
  PieChart,
  Download as DownloadIcon,
  Printer,
  Share2,
  Plus,
  Settings,
  BarChart,
  LineChart,
  Activity,
  Target,
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter as FilterIcon,
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronUp,
  X,
  Check,
  Save,
  RefreshCw,
  Zap,
  Star,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  BarChart3 as BarChart3Icon,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  Activity as ActivityIcon,
  Target as TargetIcon,
  Users as UsersIcon,
  Gem as GemIcon,
  DollarSign as DollarSignIcon,
  AlertCircle as AlertCircleIcon,
  CheckCircle as CheckCircleIcon,
  Clock as ClockIcon,
  Eye as EyeIcon,
  Edit as EditIcon,
  Trash2 as Trash2Icon,
  Search as SearchIcon,
  Filter as FilterIcon2,
  Calendar as CalendarIcon2,
  ChevronDown as ChevronDownIcon,
  ChevronUp as ChevronUpIcon,
  X as XIcon,
  Check as CheckIcon,
  Save as SaveIcon,
  RefreshCw as RefreshCwIcon,
  Zap as ZapIcon,
  Star as StarIcon
} from 'lucide-react'
import { toast } from 'react-hot-toast'

interface ReportData {
  id: string
  name: string
  type: 'financial' | 'inventory' | 'customer' | 'agent' | 'dealer' | 'profit_loss' | 'cash_flow' | 'interest_revenue'
  dateRange: string
  generatedAt: string
  status: 'completed' | 'processing' | 'failed'
  downloadUrl?: string
  format: 'pdf' | 'excel' | 'csv'
  filters: ReportFilters
  data: any
}

interface ReportFilters {
  dateFrom: string
  dateTo: string
  customers: string[]
  agents: string[]
  dealers: string[]
      jewelryCategories: string[]
  status: string[]
  amountRange: {
    min: number
    max: number
  }
}

interface AnalyticsData {
  totalRevenue: number
  totalExpenses: number
  netProfit: number
  activeJewelry: number
  totalCustomers: number
  totalAgents: number
  totalDealers: number
  pendingPayments: number
  overduePayments: number
  monthlyRevenue: number[]
  monthlyExpenses: number[]
  topCustomers: Array<{name: string, amount: number}>
  topAgents: Array<{name: string, totalValue: number}>
      jewelryDistribution: Array<{category: string, count: number, value: number}>
  paymentTrends: Array<{month: string, amount: number}>
}

// Custom Report Modal Component
interface CustomReportModalProps {
  isOpen: boolean
  onClose: () => void
  onGenerate: (reportConfig: CustomReportConfig) => void
}

interface CustomReportConfig {
  name: string
  type: string
  dateRange: {
    startDate: string
    endDate: string
  }
  filters: {
    customers: string[]
    agents: string[]
    dealers: string[]
    jewelryCategories: string[]
    status: string[]
    amountRange: {
      min: number
      max: number
    }
  }
  format: 'pdf' | 'excel' | 'csv'
  includeCharts: boolean
  includeSummary: boolean
  includeDetails: boolean
}

const CustomReportModal: React.FC<CustomReportModalProps> = ({
  isOpen,
  onClose,
  onGenerate
}) => {
  const [reportConfig, setReportConfig] = useState<CustomReportConfig>({
    name: '',
    type: 'financial',
    dateRange: {
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0]
    },
    filters: {
      customers: [],
      agents: [],
      dealers: [],
      jewelryCategories: [],
      status: [],
      amountRange: { min: 0, max: 1000000 }
    },
    format: 'pdf',
    includeCharts: true,
    includeSummary: true,
    includeDetails: true
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!reportConfig.name.trim()) {
      toast.error('Please enter a report name')
      return
    }
    onGenerate(reportConfig)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Create Custom Report</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report Name *
              </label>
              <Input
                value={reportConfig.name}
                onChange={(e) => setReportConfig({...reportConfig, name: e.target.value})}
                placeholder="Enter report name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report Type
              </label>
              <select
                value={reportConfig.type}
                onChange={(e) => setReportConfig({...reportConfig, type: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="financial">Financial Report</option>
                <option value="inventory">Inventory Report</option>
                <option value="customer">Customer Report</option>
                <option value="agent">Agent Report</option>
                <option value="dealer">Dealer Report</option>
                <option value="profit_loss">Profit & Loss</option>
                <option value="cash_flow">Cash Flow</option>
                <option value="interest_revenue">Interest Revenue</option>
              </select>
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <Input
                type="date"
                value={reportConfig.dateRange.startDate}
                onChange={(e) => setReportConfig({
                  ...reportConfig, 
                  dateRange: {...reportConfig.dateRange, startDate: e.target.value}
                })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <Input
                type="date"
                value={reportConfig.dateRange.endDate}
                onChange={(e) => setReportConfig({
                  ...reportConfig, 
                  dateRange: {...reportConfig.dateRange, endDate: e.target.value}
                })}
              />
            </div>
          </div>

          {/* Amount Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Amount
              </label>
              <Input
                type="number"
                value={reportConfig.filters.amountRange.min}
                onChange={(e) => setReportConfig({
                  ...reportConfig,
                  filters: {
                    ...reportConfig.filters,
                    amountRange: {...reportConfig.filters.amountRange, min: Number(e.target.value)}
                  }
                })}
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Amount
              </label>
              <Input
                type="number"
                value={reportConfig.filters.amountRange.max}
                onChange={(e) => setReportConfig({
                  ...reportConfig,
                  filters: {
                    ...reportConfig.filters,
                    amountRange: {...reportConfig.filters.amountRange, max: Number(e.target.value)}
                  }
                })}
                placeholder="1000000"
              />
            </div>
          </div>

          {/* Report Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Report Format
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="pdf"
                  checked={reportConfig.format === 'pdf'}
                  onChange={(e) => setReportConfig({...reportConfig, format: e.target.value as 'pdf'})}
                  className="mr-2"
                />
                PDF
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="excel"
                  checked={reportConfig.format === 'excel'}
                  onChange={(e) => setReportConfig({...reportConfig, format: e.target.value as 'excel'})}
                  className="mr-2"
                />
                Excel
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="csv"
                  checked={reportConfig.format === 'csv'}
                  onChange={(e) => setReportConfig({...reportConfig, format: e.target.value as 'csv'})}
                  className="mr-2"
                />
                CSV
              </label>
            </div>
          </div>

          {/* Include Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Include in Report
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={reportConfig.includeCharts}
                  onChange={(e) => setReportConfig({...reportConfig, includeCharts: e.target.checked})}
                  className="mr-2"
                />
                Charts and Graphs
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={reportConfig.includeSummary}
                  onChange={(e) => setReportConfig({...reportConfig, includeSummary: e.target.checked})}
                  className="mr-2"
                />
                Executive Summary
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={reportConfig.includeDetails}
                  onChange={(e) => setReportConfig({...reportConfig, includeDetails: e.target.checked})}
                  className="mr-2"
                />
                Detailed Data
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              <Save className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Analytics Modal Component
interface AnalyticsModalProps {
  isOpen: boolean
  onClose: () => void
  analyticsData: AnalyticsData
}

const AnalyticsModal: React.FC<AnalyticsModalProps> = ({
  isOpen,
  onClose,
  analyticsData
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('6months')
  const [selectedMetric, setSelectedMetric] = useState('revenue')

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const calculateGrowthRate = (current: number, previous: number) => {
    if (previous === 0) return 0
    return ((current - previous) / previous) * 100
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Advanced Analytics Dashboard</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Timeframe and Metric Selectors */}
          <div className="flex items-center justify-between">
            <div className="flex space-x-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Timeframe</label>
                <select
                  value={selectedTimeframe}
                  onChange={(e) => setSelectedTimeframe(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="1month">Last Month</option>
                  <option value="3months">Last 3 Months</option>
                  <option value="6months">Last 6 Months</option>
                  <option value="1year">Last Year</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Metric</label>
                <select
                  value={selectedMetric}
                  onChange={(e) => setSelectedMetric(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="revenue">Revenue</option>
                  <option value="profit">Profit</option>
                  <option value="customers">Customers</option>
                  <option value="jewelry">Jewelry</option>
                </select>
              </div>
            </div>
            <Button variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Data
            </Button>
          </div>

          {/* Key Performance Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(analyticsData.totalRevenue)}</p>
                    <p className="text-sm text-green-600 flex items-center">
                      <TrendingUpIcon className="w-4 h-4 mr-1" />
                      +12.5% from last period
                    </p>
                  </div>
                  <DollarSignIcon className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Net Profit</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(analyticsData.netProfit)}</p>
                    <p className="text-sm text-green-600 flex items-center">
                      <TrendingUpIcon className="w-4 h-4 mr-1" />
                      +8.3% from last period
                    </p>
                  </div>
                  <TargetIcon className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Jewelry</p>
                    <p className="text-2xl font-bold text-gray-900">{analyticsData.activeJewelry}</p>
                    <p className="text-sm text-green-600 flex items-center">
                      <CheckCircleIcon className="w-4 h-4 mr-1" />
                      +5 new this period
                    </p>
                  </div>
                  <GemIcon className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Customers</p>
                    <p className="text-2xl font-bold text-gray-900">{analyticsData.totalCustomers}</p>
                    <p className="text-sm text-green-600 flex items-center">
                      <UsersIcon className="w-4 h-4 mr-1" />
                      +3 new this period
                    </p>
                  </div>
                  <UsersIcon className="w-8 h-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3Icon className="w-5 h-5 mr-2" />
                  Revenue Trends
                </CardTitle>
                <CardDescription>Monthly revenue performance over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.paymentTrends.map((trend, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">{trend.month}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{width: `${(trend.amount / 250000) * 100}%`}}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{formatCurrency(trend.amount)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Jewelry Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChartIcon className="w-5 h-5 mr-2" />
                  Jewelry Distribution
                </CardTitle>
                <CardDescription>Value distribution by jewelry category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.jewelryDistribution.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${
                          index === 0 ? 'bg-blue-500' :
                          index === 1 ? 'bg-green-500' :
                          index === 2 ? 'bg-yellow-500' :
                          index === 3 ? 'bg-purple-500' : 'bg-red-500'
                        }`}></div>
                        <span className="text-sm font-medium text-gray-600">{item.category}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">{item.count} items</div>
                        <div className="text-sm text-gray-500">{formatCurrency(item.value)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Performers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Customers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UsersIcon className="w-5 h-5 mr-2" />
                  Top Customers
                </CardTitle>
                <CardDescription>Highest value customers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.topCustomers.map((customer, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                          <div className="text-sm text-gray-500">{formatCurrency(customer.amount)}</div>
                        </div>
                      </div>
                      <Badge variant="secondary">{index + 1}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Agents */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ActivityIcon className="w-5 h-5 mr-2" />
                  Top Agents
                </CardTitle>
                <CardDescription>Top performing agents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.topAgents.map((agent, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-green-600">{index + 1}</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{agent.name}</div>
                          <div className="text-sm text-gray-500">{formatCurrency(agent.totalValue)}</div>
                        </div>
                      </div>
                      <Badge variant="secondary">{index + 1}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button variant="outline">
              <DownloadIcon className="w-4 h-4 mr-2" />
              Export Analytics
            </Button>
            <Button variant="outline">
              <Printer className="w-4 h-4 mr-2" />
              Print Report
            </Button>
            <Button onClick={onClose}>
              <CheckIcon className="w-4 h-4 mr-2" />
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

const Reports: React.FC = () => {
  const [reports, setReports] = useState<ReportData[]>([])
  const [selectedReportType, setSelectedReportType] = useState<string>('all')
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  })
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalRevenue: 2450000,
    totalExpenses: 1800000,
    netProfit: 650000,
    activeJewelry: 156,
    totalCustomers: 89,
    totalAgents: 12,
    totalDealers: 8,
    pendingPayments: 23,
    overduePayments: 7,
    monthlyRevenue: [180000, 195000, 210000, 225000, 240000, 245000],
    monthlyExpenses: [150000, 160000, 170000, 175000, 180000, 180000],
    topCustomers: [
      {name: 'Rajesh Kumar', amount: 450000},
      {name: 'Priya Sharma', amount: 380000},
      {name: 'Amit Patel', amount: 320000},
      {name: 'Sneha Singh', amount: 280000},
      {name: 'Vikram Mehta', amount: 250000}
    ],
    topAgents: [
      {name: 'Rahul Verma', totalValue: 450000},
      {name: 'Anita Desai', totalValue: 380000},
      {name: 'Suresh Kumar', totalValue: 320000},
      {name: 'Meera Patel', totalValue: 280000},
      {name: 'Rajesh Singh', totalValue: 250000}
    ],
    jewelryDistribution: [
      {category: 'Gold Rings', count: 45, value: 850000},
      {category: 'Gold Chains', count: 38, value: 720000},
      {category: 'Gold Bangles', count: 32, value: 580000},
      {category: 'Silver Items', count: 25, value: 180000},
      {category: 'Diamond Jewelry', count: 16, value: 120000}
    ],
    paymentTrends: [
      {month: 'Jan', amount: 180000},
      {month: 'Feb', amount: 195000},
      {month: 'Mar', amount: 210000},
      {month: 'Apr', amount: 225000},
      {month: 'May', amount: 240000},
      {month: 'Jun', amount: 245000}
    ]
  })
  const [isCustomReportModalOpen, setIsCustomReportModalOpen] = useState(false)
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false)
  const [selectedReport, setSelectedReport] = useState<ReportData | null>(null)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  useEffect(() => {
    // Initialize with demo data
    // In real app, this would load from database
  }, [])

  const handleGenerateReport = (type: string) => {
    const newReport: ReportData = {
      id: `REP${Date.now()}`,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} Report`,
      type: type as any,
      dateRange: `${dateRange.startDate} to ${dateRange.endDate}`,
      generatedAt: new Date().toISOString(),
      status: 'completed',
      format: 'pdf',
      filters: {
        dateFrom: dateRange.startDate,
        dateTo: dateRange.endDate,
        customers: [],
        agents: [],
        dealers: [],
        jewelryCategories: [],
        status: [],
        amountRange: { min: 0, max: 1000000 }
      },
      data: {}
    }
    setReports([...reports, newReport])
    toast.success('Report generated successfully!')
  }

  const handleDownloadReport = (report: ReportData) => {
    // Generate report content based on type
    let content = ''
    let filename = `${report.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}`

    if (report.format === 'csv') {
      content = generateCSVContent(report)
      filename += '.csv'
    } else if (report.format === 'excel') {
      content = generateExcelContent(report)
      filename += '.xlsx'
    } else {
      content = generatePDFContent(report)
      filename += '.pdf'
    }

    // Create and download file
    const blob = new Blob([content], { 
      type: report.format === 'csv' ? 'text/csv' : 
            report.format === 'excel' ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' : 
            'application/pdf' 
    })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    
    toast.success(`Downloaded ${report.name} as ${report.format.toUpperCase()}`)
  }

  const handlePrintReport = (report: ReportData) => {
    // Generate printable content
    const printContent = generatePrintContent(report)
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${report.name}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .report-title { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
            .report-info { font-size: 14px; color: #666; }
            .section { margin-bottom: 20px; }
            .section-title { font-size: 18px; font-weight: bold; margin-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; font-weight: bold; }
            .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          ${printContent}
          <div class="footer">
            Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
          </div>
        </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.focus()
      printWindow.print()
      printWindow.close()
    }
    
    toast.success('Print dialog opened!')
  }

  const handleShareReport = (report: ReportData) => {
    // Generate shareable content
    const shareContent = generateShareContent(report)
    
    // Try to use Web Share API if available
    if (navigator.share) {
      navigator.share({
        title: report.name,
        text: `Jewelry Girvi System Report: ${report.name}`,
        url: window.location.href
      }).then(() => {
        toast.success('Report shared successfully!')
      }).catch((error) => {
        console.log('Error sharing:', error)
        fallbackShare(report, shareContent)
      })
    } else {
      fallbackShare(report, shareContent)
    }
  }

  // Helper functions for generating content
  const generateCSVContent = (report: ReportData): string => {
    const headers = ['Report Name', 'Type', 'Date Range', 'Generated', 'Status']
    const data = [
      report.name,
      report.type,
      report.dateRange,
      new Date(report.generatedAt).toLocaleDateString(),
      report.status
    ]
    
    return [headers.join(','), data.join(',')].join('\n')
  }

  const generateExcelContent = (report: ReportData): string => {
    // Simplified Excel-like content (in real app, use a library like xlsx)
    const content = `
Report: ${report.name}
Type: ${report.type}
Date Range: ${report.dateRange}
Generated: ${new Date(report.generatedAt).toLocaleDateString()}
Status: ${report.status}

This is a placeholder for Excel content. In a real application, 
you would use a library like 'xlsx' to generate proper Excel files.
    `
    return content
  }

  const generatePDFContent = (report: ReportData): string => {
    // Simplified PDF-like content (in real app, use a library like jsPDF)
    const content = `
Report: ${report.name}
Type: ${report.type}
Date Range: ${report.dateRange}
Generated: ${new Date(report.generatedAt).toLocaleDateString()}
Status: ${report.status}

This is a placeholder for PDF content. In a real application, 
you would use a library like 'jsPDF' to generate proper PDF files.
    `
    return content
  }

  const generatePrintContent = (report: ReportData): string => {
    return `
      <div class="header">
        <div class="report-title">${report.name}</div>
        <div class="report-info">
          Type: ${report.type.charAt(0).toUpperCase() + report.type.slice(1)} | 
          Date Range: ${report.dateRange} | 
          Status: ${report.status.charAt(0).toUpperCase() + report.status.slice(1)}
        </div>
      </div>
      
      <div class="section">
        <div class="section-title">Report Summary</div>
        <table>
          <tr>
            <th>Metric</th>
            <th>Value</th>
          </tr>
          <tr>
            <td>Total Revenue</td>
            <td>${formatCurrency(analyticsData.totalRevenue)}</td>
          </tr>
          <tr>
            <td>Net Profit</td>
            <td>${formatCurrency(analyticsData.netProfit)}</td>
          </tr>
          <tr>
            <td>Active Jewelry</td>
            <td>${analyticsData.activeJewelry}</td>
          </tr>
          <tr>
            <td>Total Customers</td>
            <td>${analyticsData.totalCustomers}</td>
          </tr>
        </table>
      </div>
      
      <div class="section">
        <div class="section-title">Top Customers</div>
        <table>
          <tr>
            <th>Rank</th>
            <th>Customer</th>
            <th>Amount</th>
          </tr>
          ${analyticsData.topCustomers.map((customer, index) => `
            <tr>
              <td>${index + 1}</td>
              <td>${customer.name}</td>
              <td>${formatCurrency(customer.amount)}</td>
            </tr>
          `).join('')}
        </table>
      </div>
      
      <div class="section">
        <div class="section-title">Top Agents</div>
        <table>
          <tr>
            <th>Rank</th>
            <th>Agent</th>
                                    <th>Total Value</th>
          </tr>
          ${analyticsData.topAgents.map((agent, index) => `
            <tr>
              <td>${index + 1}</td>
              <td>${agent.name}</td>
              <td>${formatCurrency(agent.totalValue)}</td>
            </tr>
          `).join('')}
        </table>
      </div>
    `
  }

  const generateShareContent = (report: ReportData): string => {
    return `
Jewelry Girvi System Report

Report: ${report.name}
Type: ${report.type}
Date Range: ${report.dateRange}
Generated: ${new Date(report.generatedAt).toLocaleDateString()}

Key Metrics:
- Total Revenue: ${formatCurrency(analyticsData.totalRevenue)}
- Net Profit: ${formatCurrency(analyticsData.netProfit)}
- Active Jewelry: ${analyticsData.activeJewelry}
- Total Customers: ${analyticsData.totalCustomers}
    `
  }

  const fallbackShare = (report: ReportData, content: string) => {
    // Fallback: copy to clipboard
    navigator.clipboard.writeText(content).then(() => {
      toast.success('Report content copied to clipboard!')
    }).catch(() => {
      // Final fallback: show content in alert
      alert(`Report: ${report.name}\n\n${content}`)
      toast.success('Report shared via alert!')
    })
  }

  const handleCustomReport = () => {
    setIsCustomReportModalOpen(true)
  }

  const handleViewAnalytics = () => {
    setIsAnalyticsModalOpen(true)
  }

  const handleExportAll = () => {
    // Generate comprehensive export with all analytics data
    const exportData = {
      analytics: analyticsData,
      reports: reports,
      generatedAt: new Date().toISOString(),
      dateRange: `${dateRange.startDate} to ${dateRange.endDate}`
    }
    
    const content = JSON.stringify(exportData, null, 2)
    const filename = `Jewelry_Girvi_System_Export_${new Date().toISOString().split('T')[0]}.json`
    
    // Create and download file
    const blob = new Blob([content], { type: 'application/json' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    
    toast.success('All data exported successfully!')
  }

  const filteredReports = reports.filter(report => 
    selectedReportType === 'all' || report.type === selectedReportType
  )

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const calculateGrowthRate = (current: number, previous: number) => {
    if (previous === 0) return 0
    return ((current - previous) / previous) * 100
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Advanced financial reports and business analytics</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleViewAnalytics}>
            <BarChart className="w-4 h-4 mr-2" />
            View Analytics
          </Button>
          <Button variant="outline" onClick={handleExportAll}>
            <Download className="w-4 h-4 mr-2" />
            Export All
          </Button>
          <Button onClick={handleCustomReport}>
            <Plus className="w-4 h-4 mr-2" />
            Custom Report
          </Button>
        </div>
      </div>

      {/* Advanced Analytics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(analyticsData.totalRevenue)}</p>
                <p className="text-sm text-green-600 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +12.5% from last month
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Net Profit</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(analyticsData.netProfit)}</p>
                <p className="text-sm text-green-600 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +8.3% from last month
                </p>
              </div>
              <Target className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Jewelry</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.activeJewelry}</p>
                <p className="text-sm text-green-600 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  +5 new this month
                </p>
              </div>
              <Gem className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.totalCustomers}</p>
                <p className="text-sm text-green-600 flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  +3 new this month
                </p>
              </div>
              <Users className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Revenue Trends
            </CardTitle>
            <CardDescription>Monthly revenue performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.paymentTrends.map((trend, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">{trend.month}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{width: `${(trend.amount / 250000) * 100}%`}}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{formatCurrency(trend.amount)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="w-5 h-5 mr-2" />
              Jewelry Distribution
            </CardTitle>
                            <CardDescription>Value distribution by jewelry category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.jewelryDistribution.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${
                      index === 0 ? 'bg-blue-500' :
                      index === 1 ? 'bg-green-500' :
                      index === 2 ? 'bg-yellow-500' :
                      index === 3 ? 'bg-purple-500' : 'bg-red-500'
                    }`}></div>
                    <span className="text-sm font-medium text-gray-600">{item.category}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{item.count} items</div>
                    <div className="text-sm text-gray-500">{formatCurrency(item.value)}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Top Customers
            </CardTitle>
            <CardDescription>Highest value customers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.topCustomers.map((customer, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                      <div className="text-sm text-gray-500">{formatCurrency(customer.amount)}</div>
                    </div>
                  </div>
                  <Badge variant="secondary">{index + 1}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Top Agents
            </CardTitle>
            <CardDescription>Top performing agents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.topAgents.map((agent, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-green-600">{index + 1}</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{agent.name}</div>
                      <div className="text-sm text-gray-500">{formatCurrency(agent.totalValue)}</div>
                    </div>
                  </div>
                  <Badge variant="secondary">{index + 1}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <FilterIcon className="w-5 h-5 mr-2" />
              Report Filters
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              {showAdvancedFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </CardTitle>
          <CardDescription>Configure report parameters and filters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <Input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <Input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
              <select
                value={selectedReportType}
                onChange={(e) => setSelectedReportType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Reports</option>
                <option value="financial">Financial</option>
                <option value="inventory">Inventory</option>
                <option value="customer">Customer</option>
                <option value="agent">Agent</option>
                <option value="dealer">Dealer</option>
                <option value="profit_loss">Profit & Loss</option>
                <option value="cash_flow">Cash Flow</option>
                <option value="interest_revenue">Interest Revenue</option>
              </select>
            </div>
          </div>

          {showAdvancedFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount Range</label>
                <div className="flex space-x-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    className="flex-1"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jewelry Category</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">All Types</option>
                  <option value="gold">Gold</option>
                  <option value="silver">Silver</option>
                  <option value="diamond">Diamond</option>
                  <option value="platinum">Platinum</option>
                </select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Report Generation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Profit & Loss</h3>
                <p className="text-sm text-gray-600">Revenue, expenses, and profit analysis</p>
              </div>
              <BarChart3 className="w-8 h-8 text-green-500" />
            </div>
            <Button 
              className="w-full mt-4"
              onClick={() => handleGenerateReport('profit_loss')}
            >
              Generate Report
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Cash Flow</h3>
                <p className="text-sm text-gray-600">Cash inflow and outflow analysis</p>
              </div>
              <LineChart className="w-8 h-8 text-blue-500" />
            </div>
            <Button 
              className="w-full mt-4"
              onClick={() => handleGenerateReport('cash_flow')}
            >
              Generate Report
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Interest Revenue</h3>
                <p className="text-sm text-gray-600">Interest earnings and trends</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
            <Button 
              className="w-full mt-4"
              onClick={() => handleGenerateReport('interest_revenue')}
            >
              Generate Report
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Customer Analysis</h3>
                <p className="text-sm text-gray-600">Customer activity and payment history</p>
              </div>
              <Users className="w-8 h-8 text-orange-500" />
            </div>
            <Button 
              className="w-full mt-4"
              onClick={() => handleGenerateReport('customer')}
            >
              Generate Report
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Agent Performance</h3>
                <p className="text-sm text-gray-600">Agent performance and activity reports</p>
              </div>
              <Activity className="w-8 h-8 text-indigo-500" />
            </div>
            <Button 
              className="w-full mt-4"
              onClick={() => handleGenerateReport('agent')}
            >
              Generate Report
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Inventory Status</h3>
                <p className="text-sm text-gray-600">Jewelry inventory and valuation</p>
              </div>
              <Gem className="w-8 h-8 text-yellow-500" />
            </div>
            <Button 
              className="w-full mt-4"
              onClick={() => handleGenerateReport('inventory')}
            >
              Generate Report
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Generated Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Generated Reports
          </CardTitle>
          <CardDescription>
            View and manage your generated reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          {reports.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No reports generated yet</h3>
              <p className="text-gray-600 mb-4">
                Generate your first report using the options above.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Report Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date Range
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Generated
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
                  {filteredReports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{report.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="secondary">
                          {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {report.dateRange}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(report.generatedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge 
                          variant={
                            report.status === 'completed' ? 'default' :
                            report.status === 'processing' ? 'secondary' : 'destructive'
                          }
                        >
                          {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownloadReport(report)}
                            disabled={report.status !== 'completed'}
                          >
                            <DownloadIcon className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePrintReport(report)}
                            disabled={report.status !== 'completed'}
                          >
                            <Printer className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleShareReport(report)}
                            disabled={report.status !== 'completed'}
                          >
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Custom Report Modal */}
      {isCustomReportModalOpen && (
        <CustomReportModal
          isOpen={isCustomReportModalOpen}
          onClose={() => setIsCustomReportModalOpen(false)}
          onGenerate={(config) => {
            const newReport: ReportData = {
              id: `REP${Date.now()}`,
              name: config.name,
              type: config.type as any,
              dateRange: `${config.dateRange.startDate} to ${config.dateRange.endDate}`,
              generatedAt: new Date().toISOString(),
              status: 'completed',
              format: config.format,
              filters: {
                ...config.filters,
                dateFrom: config.dateRange.startDate,
                dateTo: config.dateRange.endDate
              },
              data: {}
            }
            setReports([...reports, newReport])
            toast.success('Custom report generated successfully!')
            setIsCustomReportModalOpen(false)
          }}
        />
      )}

      {/* Analytics Modal */}
      {isAnalyticsModalOpen && (
        <AnalyticsModal
          isOpen={isAnalyticsModalOpen}
          onClose={() => setIsAnalyticsModalOpen(false)}
          analyticsData={analyticsData}
        />
      )}
    </div>
  )
}

export default Reports 