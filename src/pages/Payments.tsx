import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  DollarSign, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Calculator,
  TrendingUp,
  Calendar,
  User,
  Gem,
  Receipt,
  Users,
  Building,
  X
} from 'lucide-react'
import { toast } from 'react-hot-toast'

// Customer-Agent Payment Interface (Compound Interest)
interface CustomerPayment {
  id: string
  jewelryId: string
  interestPaid: number
  principalPaid: number
  paymentDate: string
  mode: 'cash' | 'bank' | 'upi' | 'cheque'
  remarks: string
  customerName: string
  agentName: string
  jewelryName: string
  lotNo: string
  compoundingType: 'annually' | 'monthly' | 'quarterly' | 'daily'
  interestRate: number
  totalOutstanding: number
  accruedInterest: number
}

// Dealer Payment Interface (Simple Interest)
interface DealerPayment {
  id: string
  jewelryId: string
  dealerId: number
  interestPaid: number
  principalPaid: number
  paidOn: string
  remarks: string
  dealerName: string
  jewelryName: string
  lotNo: string
  interestRate: number
  totalOutstanding: number
  accruedInterest: number
}

// Interest Calculation Interface
interface InterestCalculation {
  jewelryId: string
  customerId?: number
  agentId?: number
  dealerId?: number
  principalAmount: number
  interestRate: number
  compoundingType?: 'annually' | 'monthly' | 'quarterly' | 'daily'
  startDate: string
  lastPaymentDate?: string
  totalPaid: number
  outstandingAmount: number
  accruedInterest: number
  nextDueDate: string
  daysOverdue: number
  calculationType: 'compound' | 'simple'
}

const Payments: React.FC = () => {
  const [customerPayments, setCustomerPayments] = useState<CustomerPayment[]>([])
  const [dealerPayments, setDealerPayments] = useState<DealerPayment[]>([])
  const [calculations, setCalculations] = useState<InterestCalculation[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState<'customer' | 'dealer'>('customer')
  const [filterType, setFilterType] = useState<'all' | 'interest' | 'principal' | 'both'>('all')
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false)
  const [isAddDealerModalOpen, setIsAddDealerModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isCalculationModalOpen, setIsCalculationModalOpen] = useState(false)
  const [isBulkInterestModalOpen, setIsBulkInterestModalOpen] = useState(false)
  const [isBulkReleaseModalOpen, setIsBulkReleaseModalOpen] = useState(false)
  const [isDealerPaymentModalOpen, setIsDealerPaymentModalOpen] = useState(false)
  const [isBulkDealerPaymentModalOpen, setIsBulkDealerPaymentModalOpen] = useState(false)
  const [isBulkDealerReturnModalOpen, setIsBulkDealerReturnModalOpen] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<CustomerPayment | DealerPayment | null>(null)
  const [selectedCalculation, setSelectedCalculation] = useState<InterestCalculation | null>(null)
  const [selectedJewelry, setSelectedJewelry] = useState<any>(null)

  useEffect(() => {
    // Initialize with empty state
    // In real app, this would load from database
  }, [])

  // Customer-Agent Payment Handlers (Compound Interest)
  const handleAddCustomerPayment = (paymentData: Omit<CustomerPayment, 'id' | 'customerName' | 'agentName' | 'jewelryName' | 'lotNo' | 'compoundingType' | 'interestRate' | 'totalOutstanding' | 'accruedInterest'>) => {
    const newPayment: CustomerPayment = {
      ...paymentData,
      id: `CUST${Date.now()}`,
      customerName: 'Demo Customer',
      agentName: 'Demo Agent',
      jewelryName: 'Demo Jewelry',
      lotNo: 'LOT001',
      compoundingType: 'monthly',
      interestRate: 12,
      totalOutstanding: 0,
      accruedInterest: 0
    }
    setCustomerPayments([...customerPayments, newPayment])
    setIsAddCustomerModalOpen(false)
    toast.success('Customer payment recorded successfully!')
  }

  const handleDeleteCustomerPayment = (id: string) => {
    if (window.confirm('Are you sure you want to delete this customer payment record?')) {
      setCustomerPayments(customerPayments.filter(p => p.id !== id))
      toast.success('Customer payment deleted successfully!')
    }
  }

  // Dealer Payment Handlers (Simple Interest)
  const handleAddDealerPayment = (paymentData: Omit<DealerPayment, 'id' | 'dealerName' | 'jewelryName' | 'lotNo' | 'interestRate' | 'totalOutstanding' | 'accruedInterest'>) => {
    const newPayment: DealerPayment = {
      ...paymentData,
      id: `DEAL${Date.now()}`,
      dealerName: 'Demo Dealer',
      jewelryName: 'Demo Jewelry',
      lotNo: 'LOT001',
      interestRate: 12,
      totalOutstanding: 0,
      accruedInterest: 0
    }
    setDealerPayments([...dealerPayments, newPayment])
    setIsAddDealerModalOpen(false)
    toast.success('Dealer payment recorded successfully!')
  }

  const handleDeleteDealerPayment = (id: string) => {
    if (window.confirm('Are you sure you want to delete this dealer payment record?')) {
      setDealerPayments(dealerPayments.filter(p => p.id !== id))
      toast.success('Dealer payment deleted successfully!')
    }
  }

  const handleViewPayment = (payment: CustomerPayment | DealerPayment) => {
    setSelectedPayment(payment)
    setIsViewModalOpen(true)
  }

  const handleCalculateInterest = (calculation: InterestCalculation) => {
    setSelectedCalculation(calculation)
    setIsCalculationModalOpen(true)
  }

  // Bulk operations for Customer-Agent payments
  const handleBulkInterestPayment = (data: any) => {
    // Process bulk interest payments for multiple customers
    toast.success('Bulk interest payments processed successfully!')
  }

  const handleBulkJewelryRelease = (data: any) => {
    // Process bulk jewelry releases for multiple customers
    toast.success('Bulk jewelry releases processed successfully!')
  }

  // Dealer payment processing
  const handleDealerPayment = (data: any) => {
    // Process dealer payment with lot-based tracking
    toast.success('Dealer payment processed successfully!')
  }

  // Bulk dealer payment processing
  const handleBulkDealerPayment = (data: any) => {
    console.log('Bulk dealer payment processed:', data)
    toast.success('Bulk dealer payment processed successfully')
    setIsBulkDealerPaymentModalOpen(false)
  }

  // Bulk dealer return processing
  const handleBulkDealerReturn = (data: any) => {
    console.log('Bulk dealer return processed:', data)
    toast.success('Bulk dealer return processed successfully')
    setIsBulkDealerReturnModalOpen(false)
  }

  // Calculate compound interest for customer-agent transactions
  const calculateCompoundInterest = (principal: number, rate: number, time: number, compounding: string): number => {
    const r = rate / 100
    let n = 1
    
    switch (compounding) {
      case 'daily':
        n = 365
        break
      case 'monthly':
        n = 12
        break
      case 'quarterly':
        n = 4
        break
      case 'annually':
        n = 1
        break
    }
    
    return principal * Math.pow(1 + r/n, n * time) - principal
  }

  // Calculate simple interest for dealer transactions
  const calculateSimpleInterest = (principal: number, rate: number, time: number): number => {
    return (principal * rate * time) / 100
  }

  // Filter payments based on active tab
  const filteredCustomerPayments = customerPayments.filter(payment => {
    const matchesSearch = 
      payment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.jewelryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.lotNo.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = filterType === 'all' || 
      (filterType === 'interest' && payment.interestPaid > 0) ||
      (filterType === 'principal' && payment.principalPaid > 0) ||
      (filterType === 'both' && payment.interestPaid > 0 && payment.principalPaid > 0)
    
    return matchesSearch && matchesType
  })

  const filteredDealerPayments = dealerPayments.filter(payment => {
    const matchesSearch = 
      payment.dealerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.jewelryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.lotNo.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = filterType === 'all' || 
      (filterType === 'interest' && payment.interestPaid > 0) ||
      (filterType === 'principal' && payment.principalPaid > 0) ||
      (filterType === 'both' && payment.interestPaid > 0 && payment.principalPaid > 0)
    
    return matchesSearch && matchesType
  })

  const totalCustomerPayments = customerPayments.reduce((sum, p) => sum + p.interestPaid + p.principalPaid, 0)
  const totalDealerPayments = dealerPayments.reduce((sum, p) => sum + p.interestPaid + p.principalPaid, 0)
  const totalOutstanding = calculations.reduce((sum, c) => sum + c.outstandingAmount + c.accruedInterest, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-600">Manage customer-agent and dealer payment transactions</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline"
            onClick={() => setIsCalculationModalOpen(true)}
          >
            <Calculator className="w-4 h-4 mr-2" />
            Calculate Interest
          </Button>
          {activeTab === 'customer' ? (
            <>
              <Button 
                variant="outline"
                onClick={() => setIsBulkInterestModalOpen(true)}
              >
                <Users className="w-4 h-4 mr-2" />
                Bulk Interest
              </Button>
              <Button 
                variant="outline"
                onClick={() => setIsBulkReleaseModalOpen(true)}
              >
                <Gem className="w-4 h-4 mr-2" />
                Bulk Release
              </Button>
              <Button 
                className="flex items-center"
                onClick={() => setIsAddCustomerModalOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Record Payment
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="outline"
                onClick={() => setIsBulkDealerPaymentModalOpen(true)}
              >
                <Users className="w-4 h-4 mr-2" />
                Bulk Payment
              </Button>
              <Button 
                variant="outline"
                onClick={() => setIsBulkDealerReturnModalOpen(true)}
              >
                <Gem className="w-4 h-4 mr-2" />
                Bulk Return
              </Button>
              <Button 
                variant="outline"
                onClick={() => setIsDealerPaymentModalOpen(true)}
              >
                <Building className="w-4 h-4 mr-2" />
                Dealer Payment
              </Button>
              <Button 
                className="flex items-center"
                onClick={() => setIsAddDealerModalOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Record Payment
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Customer Payments</p>
                <p className="text-2xl font-bold text-gray-900">₹{totalCustomerPayments.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Building className="w-8 h-8 text-purple-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Dealer Payments</p>
                <p className="text-2xl font-bold text-gray-900">₹{totalDealerPayments.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-orange-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Outstanding</p>
                <p className="text-2xl font-bold text-gray-900">₹{totalOutstanding.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Receipt className="w-8 h-8 text-green-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Payments</p>
                <p className="text-2xl font-bold text-gray-900">₹{(totalCustomerPayments + totalDealerPayments).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('customer')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'customer'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Users className="w-4 h-4 inline mr-2" />
          Customer-Agent Payments
          <Badge variant="secondary" className="ml-2">{customerPayments.length}</Badge>
        </button>
        <button
          onClick={() => setActiveTab('dealer')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'dealer'
              ? 'bg-white text-purple-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Building className="w-4 h-4 inline mr-2" />
          Dealer Payments
          <Badge variant="secondary" className="ml-2">{dealerPayments.length}</Badge>
        </button>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="w-5 h-5 mr-2" />
            {activeTab === 'customer' ? 'Customer-Agent Payment Management' : 'Dealer Payment Management'}
          </CardTitle>
          <CardDescription>
            {activeTab === 'customer' 
              ? 'View and manage customer-agent payments with compound interest calculations'
              : 'View and manage dealer payments with simple interest calculations'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder={`Search ${activeTab === 'customer' ? 'customer/agent' : 'dealer'} payments...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="interest">Interest Only</option>
              <option value="principal">Principal Only</option>
              <option value="both">Both</option>
            </select>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>

          {/* Empty State */}
          {activeTab === 'customer' && customerPayments.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No customer payments yet</h3>
              <p className="text-gray-600 mb-4">
                Get started by recording your first customer-agent payment transaction.
              </p>
              <Button onClick={() => setIsAddCustomerModalOpen(true)}>
                Record First Customer Payment
              </Button>
            </div>
          ) : activeTab === 'dealer' && dealerPayments.length === 0 ? (
            <div className="text-center py-12">
              <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No dealer payments yet</h3>
              <p className="text-gray-600 mb-4">
                Get started by recording your first dealer payment transaction.
              </p>
              <Button onClick={() => setIsAddDealerModalOpen(true)}>
                Record First Dealer Payment
              </Button>
            </div>
          ) : (
            <>
              {/* Payments Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {activeTab === 'customer' ? 'Customer/Agent' : 'Dealer'}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Interest Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {activeTab === 'customer' ? 
                      filteredCustomerPayments.map((payment) => (
                        <tr key={payment.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <Users className="w-5 h-5 text-blue-600" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {payment.interestPaid > 0 && payment.principalPaid > 0 ? 'Both' : 
                                   payment.interestPaid > 0 ? 'Interest' : 'Principal'} Payment
                                </div>
                                <div className="text-sm text-gray-500">{payment.jewelryName} - {payment.lotNo}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{payment.customerName}</div>
                            <div className="text-sm text-gray-500">Agent: {payment.agentName}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              ₹{(payment.interestPaid + payment.principalPaid).toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-500">
                              {payment.interestPaid > 0 && `Interest: ₹${payment.interestPaid.toLocaleString()}`}
                              {payment.principalPaid > 0 && `Principal: ₹${payment.principalPaid.toLocaleString()}`}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {new Date(payment.paymentDate).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant="secondary">
                              Compound ({payment.compoundingType})
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewPayment(payment)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteCustomerPayment(payment.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      )) : 
                      filteredDealerPayments.map((payment) => (
                        <tr key={payment.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                                <Building className="w-5 h-5 text-purple-600" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {payment.interestPaid > 0 && payment.principalPaid > 0 ? 'Both' : 
                                   payment.interestPaid > 0 ? 'Interest' : 'Principal'} Payment
                                </div>
                                <div className="text-sm text-gray-500">{payment.jewelryName} - {payment.lotNo}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{payment.dealerName}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              ₹{(payment.interestPaid + payment.principalPaid).toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-500">
                              {payment.interestPaid > 0 && `Interest: ₹${payment.interestPaid.toLocaleString()}`}
                              {payment.principalPaid > 0 && `Principal: ₹${payment.principalPaid.toLocaleString()}`}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {new Date(payment.paidOn).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant="secondary">
                              Simple Interest
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewPayment(payment)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteDealerPayment(payment.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Add Customer Payment Modal */}
      {isAddCustomerModalOpen && (
        <AddCustomerPaymentModal
          isOpen={isAddCustomerModalOpen}
          onClose={() => setIsAddCustomerModalOpen(false)}
          onAdd={handleAddCustomerPayment}
        />
      )}

      {/* Add Dealer Payment Modal */}
      {isAddDealerModalOpen && (
        <AddDealerPaymentModal
          isOpen={isAddDealerModalOpen}
          onClose={() => setIsAddDealerModalOpen(false)}
          onAdd={handleAddDealerPayment}
        />
      )}

      {/* View Payment Modal */}
      {isViewModalOpen && selectedPayment && (
        <ViewPaymentModal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false)
            setSelectedPayment(null)
          }}
          payment={selectedPayment}
        />
      )}

      {/* Interest Calculation Modal */}
      {isCalculationModalOpen && (
        <InterestCalculationModal
          isOpen={isCalculationModalOpen}
          onClose={() => setIsCalculationModalOpen(false)}
          onCalculate={handleCalculateInterest}
        />
      )}

      {/* Bulk Interest Payment Modal */}
      {isBulkInterestModalOpen && (
        <BulkInterestPaymentModal
          isOpen={isBulkInterestModalOpen}
          onClose={() => setIsBulkInterestModalOpen(false)}
          onProcess={handleBulkInterestPayment}
        />
      )}

      {/* Bulk Jewelry Release Modal */}
      {isBulkReleaseModalOpen && (
        <BulkJewelryReleaseModal
          isOpen={isBulkReleaseModalOpen}
          onClose={() => setIsBulkReleaseModalOpen(false)}
          onProcess={handleBulkJewelryRelease}
        />
      )}

      {/* Dealer Payment Modal */}
      {isDealerPaymentModalOpen && (
        <DealerPaymentModal
          isOpen={isDealerPaymentModalOpen}
          onClose={() => setIsDealerPaymentModalOpen(false)}
          onProcess={handleDealerPayment}
        />
      )}

      {/* Bulk Dealer Payment Modal */}
      {isBulkDealerPaymentModalOpen && (
        <BulkDealerPaymentModal
          isOpen={isBulkDealerPaymentModalOpen}
          onClose={() => setIsBulkDealerPaymentModalOpen(false)}
          onProcess={handleBulkDealerPayment}
        />
      )}

      {/* Bulk Dealer Return Modal */}
      {isBulkDealerReturnModalOpen && (
        <BulkDealerReturnModal
          isOpen={isBulkDealerReturnModalOpen}
          onClose={() => setIsBulkDealerReturnModalOpen(false)}
          onProcess={handleBulkDealerReturn}
        />
      )}
    </div>
  )
}

// Customer Payment Modal Components
interface AddCustomerPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (payment: Omit<CustomerPayment, 'id' | 'customerName' | 'agentName' | 'jewelryName' | 'lotNo' | 'compoundingType' | 'interestRate' | 'totalOutstanding' | 'accruedInterest'>) => void
}

const AddCustomerPaymentModal: React.FC<AddCustomerPaymentModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    jewelryId: '',
    interestPaid: 0,
    principalPaid: 0,
    paymentDate: new Date().toISOString().split('T')[0],
    mode: 'cash' as 'cash' | 'bank' | 'upi' | 'cheque',
    remarks: ''
  })

  const [selectedJewelry, setSelectedJewelry] = useState<any>(null)
  const [calculatedInterest, setCalculatedInterest] = useState(0)
  const [outstandingPrincipal, setOutstandingPrincipal] = useState(0)

  // Demo jewelry data (in real app, this would come from database)
  const jewelryItems = [
    { id: 'JWL001', name: 'Gold Ring', amount: 50000, interestRate: 12.0, compoundingType: 'monthly', addedOn: '2024-01-15' },
    { id: 'JWL002', name: 'Gold Necklace', amount: 120000, interestRate: 15.0, compoundingType: 'quarterly', addedOn: '2024-02-20' },
    { id: 'JWL004', name: 'Gold Mangalsutra', amount: 40000, interestRate: 12.5, compoundingType: 'annually', addedOn: '2024-01-25' },
  ]

  const handleJewelryChange = (jewelryId: string) => {
    setFormData({ ...formData, jewelryId })
    const jewelry = jewelryItems.find(item => item.id === jewelryId)
    
    if (jewelry) {
      setSelectedJewelry(jewelry)
      
      // Calculate interest from acquisition date to payment date
      const startDate = jewelry.addedOn
      const endDate = formData.paymentDate
      const days = Math.max(1, Math.floor((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)))
      
      // Calculate compound interest
      const annualRate = jewelry.interestRate / 100
      let periodsPerYear: number
      let timeInYears: number
      
      switch (jewelry.compoundingType) {
        case 'daily':
          periodsPerYear = 365
          timeInYears = days / 365
          break
        case 'monthly':
          periodsPerYear = 12
          timeInYears = days / 365
          break
        case 'quarterly':
          periodsPerYear = 4
          timeInYears = days / 365
          break
        case 'annually':
          periodsPerYear = 1
          timeInYears = days / 365
          break
        default:
          periodsPerYear = 12
          timeInYears = days / 365
      }
      
      const ratePerPeriod = annualRate / periodsPerYear
      const numberOfPeriods = timeInYears * periodsPerYear
      
      const totalAmount = jewelry.amount * Math.pow(1 + ratePerPeriod, numberOfPeriods)
      const interest = totalAmount - jewelry.amount
      
      setCalculatedInterest(interest)
      setOutstandingPrincipal(jewelry.amount)
    } else {
      setSelectedJewelry(null)
      setCalculatedInterest(0)
      setOutstandingPrincipal(0)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.jewelryId) {
      toast.error('Please select a jewelry item')
      return
    }
    if (formData.interestPaid > 0 || formData.principalPaid > 0) {
      onAdd(formData)
      setFormData({
        jewelryId: '',
        interestPaid: 0,
        principalPaid: 0,
        paymentDate: new Date().toISOString().split('T')[0],
        mode: 'cash',
        remarks: ''
      })
      setSelectedJewelry(null)
      setCalculatedInterest(0)
      setOutstandingPrincipal(0)
    } else {
      toast.error('Please enter interest or principal amount')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Record Customer Payment</h2>
        <p className="text-sm text-gray-600 mb-4">Compound Interest Calculation</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Jewelry</label>
            <select
              value={formData.jewelryId}
              onChange={(e) => handleJewelryChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select jewelry item...</option>
              {jewelryItems.map(item => (
                <option key={item.id} value={item.id}>
                  {item.name} - ₹{item.amount.toLocaleString()} ({item.interestRate}% {item.compoundingType})
                </option>
              ))}
            </select>
          </div>

          {selectedJewelry && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Jewelry Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Principal Amount:</span>
                  <div className="font-semibold">₹{selectedJewelry.amount.toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-gray-600">Interest Rate:</span>
                  <div className="font-semibold">{selectedJewelry.interestRate}% ({selectedJewelry.compoundingType})</div>
                </div>
                <div>
                  <span className="text-gray-600">Accrued Interest:</span>
                  <div className="font-semibold text-green-600">₹{calculatedInterest.toFixed(2)}</div>
                </div>
                <div>
                  <span className="text-gray-600">Outstanding Principal:</span>
                  <div className="font-semibold">₹{outstandingPrincipal.toLocaleString()}</div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Interest Paid (₹)</label>
              <Input
                type="number"
                value={formData.interestPaid}
                onChange={(e) => setFormData({ ...formData, interestPaid: parseFloat(e.target.value) || 0 })}
                placeholder="0"
                max={calculatedInterest}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Principal Paid (₹)</label>
              <Input
                type="number"
                value={formData.principalPaid}
                onChange={(e) => setFormData({ ...formData, principalPaid: parseFloat(e.target.value) || 0 })}
                placeholder="0"
                max={outstandingPrincipal}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Date</label>
              <Input
                type="date"
                value={formData.paymentDate}
                onChange={(e) => {
                  setFormData({ ...formData, paymentDate: e.target.value })
                  if (formData.jewelryId) {
                    handleJewelryChange(formData.jewelryId)
                  }
                }}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Mode</label>
              <select
                value={formData.mode}
                onChange={(e) => setFormData({ ...formData, mode: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="cash">Cash</option>
                <option value="bank">Bank Transfer</option>
                <option value="upi">UPI</option>
                <option value="cheque">Cheque</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
            <textarea
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Additional remarks..."
            />
          </div>

          <div className="flex space-x-2 pt-4">
            <Button type="submit" className="flex-1">Record Payment</Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Dealer Payment Modal Components
interface AddDealerPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (payment: Omit<DealerPayment, 'id' | 'dealerName' | 'jewelryName' | 'lotNo' | 'interestRate' | 'totalOutstanding' | 'accruedInterest'>) => void
}

const AddDealerPaymentModal: React.FC<AddDealerPaymentModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    jewelryId: '',
    dealerId: 1,
    interestPaid: 0,
    principalPaid: 0,
    paidOn: new Date().toISOString().split('T')[0],
    remarks: ''
  })

  const [selectedJewelry, setSelectedJewelry] = useState<any>(null)
  const [calculatedInterest, setCalculatedInterest] = useState(0)
  const [outstandingPrincipal, setOutstandingPrincipal] = useState(0)

  // Demo jewelry data for dealers (in real app, this would come from database)
  const dealerJewelryItems = [
    { id: 'JWL003', name: 'Silver Bracelet', amount: 30000, interestRate: 10.0, addedOn: '2024-03-10' },
    { id: 'JWL005', name: 'Diamond Ring', amount: 80000, interestRate: 18.0, addedOn: '2024-02-15' },
  ]

  const handleJewelryChange = (jewelryId: string) => {
    setFormData({ ...formData, jewelryId })
    const jewelry = dealerJewelryItems.find(item => item.id === jewelryId)
    
    if (jewelry) {
      setSelectedJewelry(jewelry)
      
      // Calculate simple interest from acquisition date to payment date
      const startDate = jewelry.addedOn
      const endDate = formData.paidOn
      const days = Math.max(1, Math.floor((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)))
      
      // Calculate simple interest
      const annualRate = jewelry.interestRate / 100
      const interest = jewelry.amount * annualRate * (days / 365)
      
      setCalculatedInterest(interest)
      setOutstandingPrincipal(jewelry.amount)
    } else {
      setSelectedJewelry(null)
      setCalculatedInterest(0)
      setOutstandingPrincipal(0)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.jewelryId) {
      toast.error('Please select a jewelry item')
      return
    }
    if (formData.interestPaid > 0 || formData.principalPaid > 0) {
      onAdd(formData)
      setFormData({
        jewelryId: '',
        dealerId: 1,
        interestPaid: 0,
        principalPaid: 0,
        paidOn: new Date().toISOString().split('T')[0],
        remarks: ''
      })
      setSelectedJewelry(null)
      setCalculatedInterest(0)
      setOutstandingPrincipal(0)
    } else {
      toast.error('Please enter interest or principal amount')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Record Dealer Payment</h2>
        <p className="text-sm text-gray-600 mb-4">Simple Interest Calculation</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Jewelry</label>
            <select
              value={formData.jewelryId}
              onChange={(e) => handleJewelryChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select jewelry item...</option>
              {dealerJewelryItems.map(item => (
                <option key={item.id} value={item.id}>
                  {item.name} - ₹{item.amount.toLocaleString()} ({item.interestRate}% simple)
                </option>
              ))}
            </select>
          </div>

          {selectedJewelry && (
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">Jewelry Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Principal Amount:</span>
                  <div className="font-semibold">₹{selectedJewelry.amount.toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-gray-600">Interest Rate:</span>
                  <div className="font-semibold">{selectedJewelry.interestRate}% (simple)</div>
                </div>
                <div>
                  <span className="text-gray-600">Accrued Interest:</span>
                  <div className="font-semibold text-green-600">₹{calculatedInterest.toFixed(2)}</div>
                </div>
                <div>
                  <span className="text-gray-600">Outstanding Principal:</span>
                  <div className="font-semibold">₹{outstandingPrincipal.toLocaleString()}</div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Interest Paid (₹)</label>
              <Input
                type="number"
                value={formData.interestPaid}
                onChange={(e) => setFormData({ ...formData, interestPaid: parseFloat(e.target.value) || 0 })}
                placeholder="0"
                max={calculatedInterest}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Principal Paid (₹)</label>
              <Input
                type="number"
                value={formData.principalPaid}
                onChange={(e) => setFormData({ ...formData, principalPaid: parseFloat(e.target.value) || 0 })}
                placeholder="0"
                max={outstandingPrincipal}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Date</label>
              <Input
                type="date"
                value={formData.paidOn}
                onChange={(e) => {
                  setFormData({ ...formData, paidOn: e.target.value })
                  if (formData.jewelryId) {
                    handleJewelryChange(formData.jewelryId)
                  }
                }}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dealer ID</label>
              <Input
                type="number"
                value={formData.dealerId}
                onChange={(e) => setFormData({ ...formData, dealerId: parseInt(e.target.value) || 1 })}
                placeholder="1"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
            <textarea
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Additional remarks..."
            />
          </div>

          <div className="flex space-x-2 pt-4">
            <Button type="submit" className="flex-1">Record Payment</Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

// View Payment Modal
interface ViewPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  payment: CustomerPayment | DealerPayment
}

const ViewPaymentModal: React.FC<ViewPaymentModalProps> = ({ isOpen, onClose, payment }) => {
  if (!isOpen) return null

  const isCustomerPayment = 'customerName' in payment

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Payment Details</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Payment Type</label>
            <p className="text-sm text-gray-900">
              {isCustomerPayment ? 'Customer-Agent Payment' : 'Dealer Payment'}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Amount</label>
            <p className="text-sm text-gray-900">
              ₹{(payment.interestPaid + payment.principalPaid).toLocaleString()}
            </p>
          </div>
          {payment.interestPaid > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Interest Amount</label>
              <p className="text-sm text-gray-900">₹{payment.interestPaid.toLocaleString()}</p>
            </div>
          )}
          {payment.principalPaid > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Principal Amount</label>
              <p className="text-sm text-gray-900">₹{payment.principalPaid.toLocaleString()}</p>
            </div>
          )}
          {isCustomerPayment ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Customer</label>
                <p className="text-sm text-gray-900">{payment.customerName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Agent</label>
                <p className="text-sm text-gray-900">{payment.agentName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Interest Type</label>
                <p className="text-sm text-gray-900">Compound ({payment.compoundingType})</p>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Dealer</label>
                <p className="text-sm text-gray-900">{payment.dealerName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Interest Type</label>
                <p className="text-sm text-gray-900">Simple Interest</p>
              </div>
            </>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Jewelry</label>
            <p className="text-sm text-gray-900">{payment.jewelryName} - {payment.lotNo}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Payment Date</label>
            <p className="text-sm text-gray-900">
              {new Date(isCustomerPayment ? payment.paymentDate : payment.paidOn).toLocaleDateString()}
            </p>
          </div>
          {isCustomerPayment && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Payment Mode</label>
              <p className="text-sm text-gray-900">{payment.mode.charAt(0).toUpperCase() + payment.mode.slice(1)}</p>
            </div>
          )}
          {payment.remarks && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Remarks</label>
              <p className="text-sm text-gray-900">{payment.remarks}</p>
            </div>
          )}
          <Button onClick={onClose} className="w-full">Close</Button>
        </div>
      </div>
    </div>
  )
}

// Interest Calculation Modal
interface InterestCalculationModalProps {
  isOpen: boolean
  onClose: () => void
  onCalculate: (calculation: InterestCalculation) => void
}

const InterestCalculationModal: React.FC<InterestCalculationModalProps> = ({ isOpen, onClose, onCalculate }) => {
  const [formData, setFormData] = useState({
    jewelryId: '',
    customerId: undefined as number | undefined,
    agentId: undefined as number | undefined,
    dealerId: undefined as number | undefined,
    principalAmount: 0,
    interestRate: 12,
    compoundingType: 'monthly' as 'annually' | 'monthly' | 'quarterly' | 'daily',
    startDate: new Date().toISOString().split('T')[0],
    lastPaymentDate: undefined as string | undefined,
    totalPaid: 0,
    calculationType: 'compound' as 'compound' | 'simple'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.principalAmount > 0) {
      // Calculate outstanding and accrued interest
      const calculation: InterestCalculation = {
        ...formData,
        outstandingAmount: formData.principalAmount - formData.totalPaid,
        accruedInterest: 0, // Will be calculated based on business logic
        nextDueDate: new Date().toISOString().split('T')[0],
        daysOverdue: 0
      }
      onCalculate(calculation)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Calculate Interest</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Calculation Type</label>
            <select
              value={formData.calculationType}
              onChange={(e) => setFormData({ ...formData, calculationType: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="compound">Compound Interest (Customer-Agent)</option>
              <option value="simple">Simple Interest (Dealer)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Principal Amount (₹)</label>
            <Input
              type="number"
              value={formData.principalAmount}
              onChange={(e) => setFormData({ ...formData, principalAmount: parseFloat(e.target.value) || 0 })}
              placeholder="0"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (%)</label>
              <Input
                type="number"
                value={formData.interestRate}
                onChange={(e) => setFormData({ ...formData, interestRate: parseFloat(e.target.value) || 0 })}
                placeholder="12"
                required
              />
            </div>
            {formData.calculationType === 'compound' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Compounding</label>
                <select
                  value={formData.compoundingType}
                  onChange={(e) => setFormData({ ...formData, compoundingType: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="annually">Annually</option>
                  <option value="daily">Daily</option>
                </select>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <Input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Paid (₹)</label>
              <Input
                type="number"
                value={formData.totalPaid}
                onChange={(e) => setFormData({ ...formData, totalPaid: parseFloat(e.target.value) || 0 })}
                placeholder="0"
              />
            </div>
          </div>

          <div className="flex space-x-2 pt-4">
            <Button type="submit" className="flex-1">Calculate</Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Bulk Interest Payment Modal
interface BulkInterestPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onProcess: (data: any) => void
}

const BulkInterestPaymentModal: React.FC<BulkInterestPaymentModalProps> = ({ isOpen, onClose, onProcess }) => {
  const [formData, setFormData] = useState({
    selectedCustomers: [] as string[],
    interestAmount: 0,
    paymentDate: new Date().toISOString().split('T')[0],
    mode: 'cash' as 'cash' | 'bank' | 'upi' | 'cheque',
    remarks: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.selectedCustomers.length > 0 && formData.interestAmount > 0) {
      onProcess(formData)
      setFormData({
        selectedCustomers: [],
        interestAmount: 0,
        paymentDate: new Date().toISOString().split('T')[0],
        mode: 'cash',
        remarks: ''
      })
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Bulk Interest Payment</h2>
        <p className="text-sm text-gray-600 mb-4">Process interest payments for multiple customers</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Customers</label>
            <select
              multiple
              value={formData.selectedCustomers}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions, option => option.value)
                setFormData({ ...formData, selectedCustomers: selected })
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              size={4}
            >
              <option value="customer1">Demo Customer 1</option>
              <option value="customer2">Demo Customer 2</option>
              <option value="customer3">Demo Customer 3</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Interest Amount (₹)</label>
            <Input
              type="number"
              value={formData.interestAmount}
              onChange={(e) => setFormData({ ...formData, interestAmount: parseFloat(e.target.value) || 0 })}
              placeholder="0"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Date</label>
              <Input
                type="date"
                value={formData.paymentDate}
                onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Mode</label>
              <select
                value={formData.mode}
                onChange={(e) => setFormData({ ...formData, mode: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="cash">Cash</option>
                <option value="bank">Bank Transfer</option>
                <option value="upi">UPI</option>
                <option value="cheque">Cheque</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
            <textarea
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Additional remarks..."
            />
          </div>

          <div className="flex space-x-2 pt-4">
            <Button type="submit" className="flex-1">Process Bulk Payment</Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Bulk Jewelry Release Modal
interface BulkJewelryReleaseModalProps {
  isOpen: boolean
  onClose: () => void
  onProcess: (data: any) => void
}

const BulkJewelryReleaseModal: React.FC<BulkJewelryReleaseModalProps> = ({ isOpen, onClose, onProcess }) => {
  const [formData, setFormData] = useState({
    selectedJewelry: [] as string[],
    releaseDate: new Date().toISOString().split('T')[0],
    finalInterest: 0,
    finalPrincipal: 0,
    remarks: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.selectedJewelry.length > 0) {
      onProcess(formData)
      setFormData({
        selectedJewelry: [],
        releaseDate: new Date().toISOString().split('T')[0],
        finalInterest: 0,
        finalPrincipal: 0,
        remarks: ''
      })
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Bulk Jewelry Release</h2>
        <p className="text-sm text-gray-600 mb-4">Release multiple jewelry items to customers</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Jewelry</label>
            <select
              multiple
              value={formData.selectedJewelry}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions, option => option.value)
                setFormData({ ...formData, selectedJewelry: selected })
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              size={4}
            >
              <option value="jewelry1">Demo Jewelry 1 - LOT001</option>
              <option value="jewelry2">Demo Jewelry 2 - LOT002</option>
              <option value="jewelry3">Demo Jewelry 3 - LOT003</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Release Date</label>
              <Input
                type="date"
                value={formData.releaseDate}
                onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Final Interest (₹)</label>
              <Input
                type="number"
                value={formData.finalInterest}
                onChange={(e) => setFormData({ ...formData, finalInterest: parseFloat(e.target.value) || 0 })}
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Final Principal (₹)</label>
            <Input
              type="number"
              value={formData.finalPrincipal}
              onChange={(e) => setFormData({ ...formData, finalPrincipal: parseFloat(e.target.value) || 0 })}
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
            <textarea
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Additional remarks..."
            />
          </div>

          <div className="flex space-x-2 pt-4">
            <Button type="submit" className="flex-1">Process Bulk Release</Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Dealer Payment Modal
interface DealerPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onProcess: (data: any) => void
}

const DealerPaymentModal: React.FC<DealerPaymentModalProps> = ({ isOpen, onClose, onProcess }) => {
  const [formData, setFormData] = useState({
    dealerId: 1,
    lotNumber: '',
    jewelryId: '',
    interestPaid: 0,
    principalPaid: 0,
    paidOn: new Date().toISOString().split('T')[0],
    remarks: ''
  })

  const [selectedJewelry, setSelectedJewelry] = useState<any>(null)
  const [calculatedInterest, setCalculatedInterest] = useState(0)
  const [outstandingPrincipal, setOutstandingPrincipal] = useState(0)

  // Demo jewelry data for dealers (in real app, this would come from database)
  const dealerJewelryItems = [
    { id: 'JWL003', name: 'Silver Bracelet', amount: 30000, interestRate: 10.0, addedOn: '2024-03-10', lotNo: 'LOT003' },
    { id: 'JWL005', name: 'Diamond Ring', amount: 80000, interestRate: 18.0, addedOn: '2024-02-15', lotNo: 'LOT005' },
  ]

  const handleJewelryChange = (jewelryId: string) => {
    setFormData({ ...formData, jewelryId })
    const jewelry = dealerJewelryItems.find(item => item.id === jewelryId)
    
    if (jewelry) {
      setSelectedJewelry(jewelry)
      setFormData({ ...formData, jewelryId, lotNumber: jewelry.lotNo })
      
      // Calculate simple interest from acquisition date to payment date
      const startDate = jewelry.addedOn
      const endDate = formData.paidOn
      const days = Math.max(1, Math.floor((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)))
      
      // Calculate simple interest
      const annualRate = jewelry.interestRate / 100
      const interest = jewelry.amount * annualRate * (days / 365)
      
      setCalculatedInterest(interest)
      setOutstandingPrincipal(jewelry.amount)
    } else {
      setSelectedJewelry(null)
      setCalculatedInterest(0)
      setOutstandingPrincipal(0)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.jewelryId) {
      toast.error('Please select a jewelry item')
      return
    }
    if (formData.dealerId && formData.lotNumber && (formData.interestPaid > 0 || formData.principalPaid > 0)) {
      onProcess(formData)
      setFormData({
        dealerId: 1,
        lotNumber: '',
        jewelryId: '',
        interestPaid: 0,
        principalPaid: 0,
        paidOn: new Date().toISOString().split('T')[0],
        remarks: ''
      })
      setSelectedJewelry(null)
      setCalculatedInterest(0)
      setOutstandingPrincipal(0)
    } else {
      toast.error('Please fill all required fields and enter payment amounts')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Dealer Payment</h2>
        <p className="text-sm text-gray-600 mb-4">Process dealer payment with lot-based tracking</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Jewelry</label>
            <select
              value={formData.jewelryId}
              onChange={(e) => handleJewelryChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select jewelry item...</option>
              {dealerJewelryItems.map(item => (
                <option key={item.id} value={item.id}>
                  {item.name} - ₹{item.amount.toLocaleString()} ({item.interestRate}% simple) - {item.lotNo}
                </option>
              ))}
            </select>
          </div>

          {selectedJewelry && (
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">Jewelry Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Principal Amount:</span>
                  <div className="font-semibold">₹{selectedJewelry.amount.toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-gray-600">Interest Rate:</span>
                  <div className="font-semibold">{selectedJewelry.interestRate}% (simple)</div>
                </div>
                <div>
                  <span className="text-gray-600">Accrued Interest:</span>
                  <div className="font-semibold text-green-600">₹{calculatedInterest.toFixed(2)}</div>
                </div>
                <div>
                  <span className="text-gray-600">Outstanding Principal:</span>
                  <div className="font-semibold">₹{outstandingPrincipal.toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-gray-600">Lot Number:</span>
                  <div className="font-semibold">{selectedJewelry.lotNo}</div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dealer ID</label>
              <Input
                type="number"
                value={formData.dealerId}
                onChange={(e) => setFormData({ ...formData, dealerId: parseInt(e.target.value) || 1 })}
                placeholder="1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lot Number</label>
              <Input
                value={formData.lotNumber}
                onChange={(e) => setFormData({ ...formData, lotNumber: e.target.value })}
                placeholder="LOT001"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Interest Paid (₹)</label>
              <Input
                type="number"
                value={formData.interestPaid}
                onChange={(e) => setFormData({ ...formData, interestPaid: parseFloat(e.target.value) || 0 })}
                placeholder="0"
                max={calculatedInterest}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Principal Paid (₹)</label>
              <Input
                type="number"
                value={formData.principalPaid}
                onChange={(e) => setFormData({ ...formData, principalPaid: parseFloat(e.target.value) || 0 })}
                placeholder="0"
                max={outstandingPrincipal}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Date</label>
            <Input
              type="date"
              value={formData.paidOn}
              onChange={(e) => {
                setFormData({ ...formData, paidOn: e.target.value })
                if (formData.jewelryId) {
                  handleJewelryChange(formData.jewelryId)
                }
              }}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
            <textarea
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Additional remarks..."
            />
          </div>

          <div className="flex space-x-2 pt-4">
            <Button type="submit" className="flex-1">Process Payment</Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Bulk Dealer Payment Modal
interface BulkDealerPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onProcess: (data: any) => void
}

const BulkDealerPaymentModal: React.FC<BulkDealerPaymentModalProps> = ({ isOpen, onClose, onProcess }) => {
  const [formData, setFormData] = useState({
    dealerId: 1,
    lotNumber: '',
    paymentType: 'interest' as 'interest' | 'principal' | 'both',
    amount: 0,
    paymentDate: new Date().toISOString().split('T')[0],
    remarks: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onProcess(formData)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Bulk Dealer Payment</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dealer ID</label>
              <Input
                type="number"
                value={formData.dealerId}
                onChange={(e) => setFormData({ ...formData, dealerId: parseInt(e.target.value) || 1 })}
                placeholder="1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lot Number</label>
              <Input
                value={formData.lotNumber}
                onChange={(e) => setFormData({ ...formData, lotNumber: e.target.value })}
                placeholder="LOT001"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Type</label>
            <select
              value={formData.paymentType}
              onChange={(e) => setFormData({ ...formData, paymentType: e.target.value as 'interest' | 'principal' | 'both' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="interest">Interest Only</option>
              <option value="principal">Principal Only</option>
              <option value="both">Interest & Principal</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
            <Input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
              placeholder="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Date</label>
            <Input
              type="date"
              value={formData.paymentDate}
              onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
            <textarea
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Additional remarks..."
            />
          </div>

          <div className="flex space-x-2 pt-4">
            <Button type="submit" className="flex-1">Process Bulk Payment</Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Bulk Dealer Return Modal
interface BulkDealerReturnModalProps {
  isOpen: boolean
  onClose: () => void
  onProcess: (data: any) => void
}

const BulkDealerReturnModal: React.FC<BulkDealerReturnModalProps> = ({ isOpen, onClose, onProcess }) => {
  const [formData, setFormData] = useState({
    dealerId: 1,
    lotNumber: '',
    returnType: 'partial' as 'partial' | 'full',
    returnAmount: 0,
    returnDate: new Date().toISOString().split('T')[0],
    remarks: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onProcess(formData)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Bulk Dealer Return</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dealer ID</label>
              <Input
                type="number"
                value={formData.dealerId}
                onChange={(e) => setFormData({ ...formData, dealerId: parseInt(e.target.value) || 1 })}
                placeholder="1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lot Number</label>
              <Input
                value={formData.lotNumber}
                onChange={(e) => setFormData({ ...formData, lotNumber: e.target.value })}
                placeholder="LOT001"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Return Type</label>
            <select
              value={formData.returnType}
              onChange={(e) => setFormData({ ...formData, returnType: e.target.value as 'partial' | 'full' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="partial">Partial Return</option>
              <option value="full">Full Return</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Return Amount (₹)</label>
            <Input
              type="number"
              value={formData.returnAmount}
              onChange={(e) => setFormData({ ...formData, returnAmount: parseFloat(e.target.value) || 0 })}
              placeholder="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Return Date</label>
            <Input
              type="date"
              value={formData.returnDate}
              onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
            <textarea
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Additional remarks..."
            />
          </div>

          <div className="flex space-x-2 pt-4">
            <Button type="submit" className="flex-1">Process Bulk Return</Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Payments 