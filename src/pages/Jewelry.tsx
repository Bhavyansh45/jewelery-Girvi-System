import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Gem, Plus, Search, Filter, Edit, Trash2, Eye, Scale, DollarSign, Package, ArrowRight, Truck, CheckCircle } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { defaultJewelryCategories, defaultMasterJewelryNames, defaultPurityStandards, type JewelryCategory, type MasterJewelryName } from '@/lib/utils/masterData'

interface Jewelry {
  id: string
  customerId: number
  agentId: number
  name: string
  category: string
  purity: string
  weight: number
  amount: number
  interestRate: number
  compoundingType: 'annually' | 'monthly' | 'quarterly' | 'daily'
  acquisitionDate: string
  notes: string
  photo: string | null
  inDealer: boolean
  isReleased: boolean
  addedOn: string
  customerName: string
  agentName: string
}

const Jewelry: React.FC = () => {
  const [jewelry, setJewelry] = useState<Jewelry[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false)
  const [isReleaseModalOpen, setIsReleaseModalOpen] = useState(false)
  const [selectedJewelry, setSelectedJewelry] = useState<Jewelry | null>(null)

  // Jewelry Categories from Settings
  const [jewelryCategories] = useState(defaultJewelryCategories)

  // Master Jewelry Names from Settings
  const [masterJewelryNames] = useState(defaultMasterJewelryNames)

  // Purity Standards from Settings
  const [purityStandards] = useState(defaultPurityStandards)

  useEffect(() => {
    // Initialize with empty state
  }, [])

  const handleAddJewelry = (jewelryData: Omit<Jewelry, 'id' | 'addedOn' | 'customerName' | 'agentName'>) => {
    const newJewelry: Jewelry = {
      ...jewelryData,
      id: `JWL${Date.now()}`,
      addedOn: new Date().toISOString().split('T')[0],
      customerName: 'Demo Customer',
      agentName: 'Demo Agent'
    }
    setJewelry([...jewelry, newJewelry])
    setIsAddModalOpen(false)
    toast.success('Jewelry added successfully!')
  }

  const handleEditJewelry = (jewelryData: Jewelry) => {
    setJewelry(jewelry.map(j => j.id === jewelryData.id ? jewelryData : j))
    setIsEditModalOpen(false)
    setSelectedJewelry(null)
    toast.success('Jewelry updated successfully!')
  }

  const handleDeleteJewelry = (id: string) => {
    if (window.confirm('Are you sure you want to delete this jewelry item?')) {
      setJewelry(jewelry.filter(j => j.id !== id))
      toast.success('Jewelry deleted successfully!')
    }
  }

  const handleViewJewelry = (item: Jewelry) => {
    setSelectedJewelry(item)
    setIsViewModalOpen(true)
  }

  const handleEditClick = (item: Jewelry) => {
    setSelectedJewelry(item)
    setIsEditModalOpen(true)
  }

  const handleTransferToDealer = (item: Jewelry) => {
    setSelectedJewelry(item)
    setIsTransferModalOpen(true)
  }

  const handleReleaseJewelry = (item: Jewelry) => {
    setSelectedJewelry(item)
    setIsReleaseModalOpen(true)
  }

  const confirmTransfer = () => {
    if (selectedJewelry) {
      setJewelry(jewelry.map(j => 
        j.id === selectedJewelry.id 
          ? { ...j, inDealer: true }
          : j
      ))
      setIsTransferModalOpen(false)
      setSelectedJewelry(null)
      toast.success('Jewelry transferred to dealer successfully!')
    }
  }

  const confirmRelease = () => {
    if (selectedJewelry) {
      setJewelry(jewelry.map(j => 
        j.id === selectedJewelry.id 
          ? { ...j, isReleased: true, inDealer: false }
          : j
      ))
      setIsReleaseModalOpen(false)
      setSelectedJewelry(null)
      toast.success('Jewelry released successfully!')
    }
  }

  const filteredJewelry = jewelry.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.agentName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Jewelry</h1>
          <p className="text-gray-600">Manage jewelry inventory and transactions</p>
        </div>
        <Button 
          className="flex items-center"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Jewelry
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Gem className="w-8 h-8 text-blue-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Jewelry</p>
                <p className="text-2xl font-bold text-gray-900">{jewelry.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Package className="w-8 h-8 text-green-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">In Hand</p>
                <p className="text-2xl font-bold text-gray-900">{jewelry.filter(j => !j.inDealer && !j.isReleased).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <ArrowRight className="w-8 h-8 text-purple-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">With Dealer</p>
                <p className="text-2xl font-bold text-gray-900">{jewelry.filter(j => j.inDealer).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 text-orange-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">₹{jewelry.reduce((sum, j) => sum + j.amount, 0).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Gem className="w-5 h-5 mr-2" />
            Jewelry Management
          </CardTitle>
          <CardDescription>
            View, add, edit, and manage jewelry inventory
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                 <Input
                   type="text"
                   placeholder="Search jewelry by name, customer, or agent..."
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="pl-10"
                 />
              </div>
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>

          {/* Empty State */}
          {jewelry.length === 0 ? (
            <div className="text-center py-12">
              <Gem className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No jewelry yet</h3>
              <p className="text-gray-600 mb-4">
                Get started by adding your first jewelry item to the system.
              </p>
              <Button onClick={() => setIsAddModalOpen(true)}>
                Add First Jewelry
              </Button>
            </div>
          ) : (
            <>
              {/* Jewelry Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Jewelry
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
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
                    {filteredJewelry.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                              <Gem className="w-5 h-5 text-yellow-600" />
                            </div>
                                                         <div className="ml-4">
                               <div className="text-sm font-medium text-gray-900">{item.name}</div>
                               <div className="text-sm text-gray-500">{item.category} - {item.purity}</div>
                             </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{item.customerName}</div>
                          <div className="text-sm text-gray-500">Agent: {item.agentName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            <div>{item.category} - {item.purity}</div>
                            <div className="text-gray-500">{item.weight}g</div>
                            <div className="text-gray-500">{item.interestRate}% p.a.</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{item.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.isReleased ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Released
                            </span>
                          ) : item.inDealer ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              With Dealer
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              In Hand
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewJewelry(item)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditClick(item)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            {!item.inDealer && !item.isReleased && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleTransferToDealer(item)}
                                className="text-purple-600 hover:text-purple-800"
                                title="Transfer to Dealer"
                              >
                                <Truck className="w-4 h-4" />
                              </Button>
                            )}
                            {!item.isReleased && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleReleaseJewelry(item)}
                                className="text-green-600 hover:text-green-800"
                                title="Release Jewelry"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteJewelry(item.id)}
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
            </>
          )}
        </CardContent>
      </Card>

      {/* Add Jewelry Modal */}
      {isAddModalOpen && (
        <AddJewelryModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddJewelry}
          masterJewelryNames={masterJewelryNames}
          jewelryCategories={jewelryCategories}
          purityStandards={purityStandards}
        />
      )}

      {/* Edit Jewelry Modal */}
      {isEditModalOpen && selectedJewelry && (
        <EditJewelryModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false)
            setSelectedJewelry(null)
          }}
          jewelry={selectedJewelry}
          onEdit={handleEditJewelry}
          masterJewelryNames={masterJewelryNames}
          jewelryCategories={jewelryCategories}
          purityStandards={purityStandards}
        />
      )}

      {/* View Jewelry Modal */}
      {isViewModalOpen && selectedJewelry && (
        <ViewJewelryModal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false)
            setSelectedJewelry(null)
          }}
          jewelry={selectedJewelry}
        />
      )}

      {/* Transfer to Dealer Modal */}
      {isTransferModalOpen && selectedJewelry && (
        <TransferModal
          isOpen={isTransferModalOpen}
          onClose={() => {
            setIsTransferModalOpen(false)
            setSelectedJewelry(null)
          }}
          jewelry={selectedJewelry}
          onConfirm={confirmTransfer}
        />
      )}

      {/* Release Jewelry Modal */}
      {isReleaseModalOpen && selectedJewelry && (
        <ReleaseModal
          isOpen={isReleaseModalOpen}
          onClose={() => {
            setIsReleaseModalOpen(false)
            setSelectedJewelry(null)
          }}
          jewelry={selectedJewelry}
          onConfirm={confirmRelease}
        />
      )}
    </div>
  )
}

// Modal Components
interface AddJewelryModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (jewelry: Omit<Jewelry, 'id' | 'addedOn' | 'customerName' | 'agentName'>) => void
  masterJewelryNames: MasterJewelryName[]
  jewelryCategories: JewelryCategory[]
  purityStandards: { id: string; name: string; description: string; category: string }[]
}

const AddJewelryModal: React.FC<AddJewelryModalProps> = ({ isOpen, onClose, onAdd, masterJewelryNames, jewelryCategories, purityStandards }) => {
  const [formData, setFormData] = useState({
    customerId: 1,
    agentId: 1,
    name: '',
    category: '',
    purity: '',
    weight: 0,
    amount: 0,
    interestRate: 12,
    compoundingType: 'monthly' as 'annually' | 'monthly' | 'quarterly' | 'daily',
    acquisitionDate: new Date().toISOString().split('T')[0],
    notes: '',
    photo: null as string | null,
    inDealer: false,
    isReleased: false
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.category) {
      onAdd({ ...formData, name: formData.category })
      setFormData({
        customerId: 1,
        agentId: 1,
        name: '',
        category: '',
        purity: '',
        weight: 0,
        amount: 0,
        interestRate: 12,
        compoundingType: 'monthly',
        acquisitionDate: new Date().toISOString().split('T')[0],
        notes: '',
        photo: null,
        inDealer: false,
        isReleased: false
      })
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add New Jewelry</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
              <select
                value={formData.customerId}
                onChange={(e) => setFormData({ ...formData, customerId: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Customer</option>
                <option value="1">Demo Customer</option>
                <option value="2">John Doe</option>
                <option value="3">Jane Smith</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Agent</label>
              <select
                value={formData.agentId}
                onChange={(e) => setFormData({ ...formData, agentId: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Agent</option>
                <option value="1">Demo Agent</option>
                <option value="2">Agent 1</option>
                <option value="3">Agent 2</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Jewelry Category</option>
                {jewelryCategories
                  .filter(cat => cat.isActive)
                  .map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jewelry Name</label>
              <select
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Jewelry Name</option>
                {masterJewelryNames
                  .filter(item => !formData.category || item.category === formData.category)
                  .filter(item => item.isActive)
                  .map(item => (
                    <option key={item.id} value={item.name}>{item.name}</option>
                  ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Purity</label>
              <select
                value={formData.purity}
                onChange={(e) => setFormData({ ...formData, purity: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Purity</option>
                {formData.category && purityStandards.filter(purity => purity.category === formData.category).map(purity => (
                  <option key={purity.id} value={purity.name}>{purity.name} - {purity.description}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Weight (g)</label>
              <Input
                type="number"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) || 0 })}
                placeholder="0.0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
              <Input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                placeholder="0"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (%)</label>
              <Input
                type="number"
                value={formData.interestRate}
                onChange={(e) => setFormData({ ...formData, interestRate: parseFloat(e.target.value) || 0 })}
                placeholder="12"
              />
            </div>
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
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Acquisition Date</label>
              <Input
                type="date"
                value={formData.acquisitionDate}
                onChange={(e) => setFormData({ ...formData, acquisitionDate: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Photo (Optional)</label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                      setFormData({ ...formData, photo: e.target?.result as string });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Enter any additional notes..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>
          <div className="flex space-x-2 pt-4">
            <Button type="submit" className="flex-1">Add Jewelry</Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

interface EditJewelryModalProps {
  isOpen: boolean
  onClose: () => void
  jewelry: Jewelry
  onEdit: (jewelry: Jewelry) => void
  masterJewelryNames: MasterJewelryName[]
  jewelryCategories: JewelryCategory[]
  purityStandards: { id: string; name: string; description: string; category: string }[]
}

const EditJewelryModal: React.FC<EditJewelryModalProps> = ({ isOpen, onClose, jewelry, onEdit, masterJewelryNames, jewelryCategories, purityStandards }) => {
  const [formData, setFormData] = useState({
    customerId: jewelry.customerId,
    agentId: jewelry.agentId,
    name: jewelry.name,
    category: jewelry.category,
    purity: jewelry.purity,
    weight: jewelry.weight,
    amount: jewelry.amount,
    interestRate: jewelry.interestRate,
    compoundingType: jewelry.compoundingType,
    acquisitionDate: jewelry.acquisitionDate || new Date().toISOString().split('T')[0],
    notes: jewelry.notes || '',
    photo: jewelry.photo
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.category) {
      onEdit({ ...jewelry, ...formData, name: formData.category })
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit Jewelry</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
              <select
                value={formData.customerId}
                onChange={(e) => setFormData({ ...formData, customerId: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Customer</option>
                <option value="1">Demo Customer</option>
                <option value="2">John Doe</option>
                <option value="3">Jane Smith</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Agent</label>
              <select
                value={formData.agentId}
                onChange={(e) => setFormData({ ...formData, agentId: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Agent</option>
                <option value="1">Demo Agent</option>
                <option value="2">Agent 1</option>
                <option value="3">Agent 2</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Jewelry Category</option>
                {jewelryCategories
                  .filter(cat => cat.isActive)
                  .map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jewelry Name</label>
              <select
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Jewelry Name</option>
                {masterJewelryNames
                  .filter(item => !formData.category || item.category === formData.category)
                  .filter(item => item.isActive)
                  .map(item => (
                    <option key={item.id} value={item.name}>{item.name}</option>
                  ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Purity</label>
              <select
                value={formData.purity}
                onChange={(e) => setFormData({ ...formData, purity: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Purity</option>
                {formData.category && purityStandards.filter(purity => purity.category === formData.category).map(purity => (
                  <option key={purity.id} value={purity.name}>{purity.name} - {purity.description}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Weight (g)</label>
              <Input
                type="number"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) || 0 })}
                placeholder="0.0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
              <Input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                placeholder="0"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (%)</label>
              <Input
                type="number"
                value={formData.interestRate}
                onChange={(e) => setFormData({ ...formData, interestRate: parseFloat(e.target.value) || 0 })}
                placeholder="12"
              />
            </div>
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
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Acquisition Date</label>
              <Input
                type="date"
                value={formData.acquisitionDate}
                onChange={(e) => setFormData({ ...formData, acquisitionDate: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Photo (Optional)</label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                      setFormData({ ...formData, photo: e.target?.result as string });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Enter any additional notes..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>
          <div className="flex space-x-2 pt-4">
            <Button type="submit" className="flex-1">Update Jewelry</Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

interface ViewJewelryModalProps {
  isOpen: boolean
  onClose: () => void
  jewelry: Jewelry
}

const ViewJewelryModal: React.FC<ViewJewelryModalProps> = ({ isOpen, onClose, jewelry }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Jewelry Details</h2>
        <div className="space-y-4">
                     <div>
             <label className="block text-sm font-medium text-gray-700">Name</label>
             <p className="text-sm text-gray-900">{jewelry.name}</p>
           </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Category & Purity</label>
            <p className="text-sm text-gray-900">{jewelry.category} - {jewelry.purity}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Acquisition Date</label>
            <p className="text-sm text-gray-900">{jewelry.acquisitionDate ? new Date(jewelry.acquisitionDate).toLocaleDateString() : 'Not specified'}</p>
          </div>
          {jewelry.notes && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Notes</label>
              <p className="text-sm text-gray-900">{jewelry.notes}</p>
            </div>
          )}
          {jewelry.photo && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Photo</label>
              <img src={jewelry.photo} alt="Jewelry" className="w-32 h-32 object-cover rounded-lg" />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Weight</label>
            <p className="text-sm text-gray-900">{jewelry.weight}g</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Amount</label>
            <p className="text-sm text-gray-900">₹{jewelry.amount.toLocaleString()}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Interest Rate</label>
            <p className="text-sm text-gray-900">{jewelry.interestRate}% p.a. ({jewelry.compoundingType})</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Customer</label>
            <p className="text-sm text-gray-900">{jewelry.customerName}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Agent</label>
            <p className="text-sm text-gray-900">{jewelry.agentName}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <p className="text-sm text-gray-900">
              {jewelry.isReleased ? 'Released' : jewelry.inDealer ? 'With Dealer' : 'In Hand'}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Added On</label>
            <p className="text-sm text-gray-900">{new Date(jewelry.addedOn).toLocaleDateString()}</p>
          </div>
          <Button onClick={onClose} className="w-full">Close</Button>
        </div>
      </div>
    </div>
  )
}

interface TransferModalProps {
  isOpen: boolean
  onClose: () => void
  jewelry: Jewelry
  onConfirm: () => void
}

const TransferModal: React.FC<TransferModalProps> = ({ isOpen, onClose, jewelry, onConfirm }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Transfer to Dealer</h2>
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to transfer this jewelry item to a dealer?
          </p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-medium">{jewelry.name}</p>
            <p className="text-sm text-gray-600">{jewelry.category} - {jewelry.purity}</p>
            <p className="text-sm text-gray-600">Amount: ₹{jewelry.amount.toLocaleString()}</p>
          </div>
          <div className="flex space-x-2 pt-4">
            <Button onClick={onConfirm} className="flex-1">Confirm Transfer</Button>
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

interface ReleaseModalProps {
  isOpen: boolean
  onClose: () => void
  jewelry: Jewelry
  onConfirm: () => void
}

const ReleaseModal: React.FC<ReleaseModalProps> = ({ isOpen, onClose, jewelry, onConfirm }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Release Jewelry</h2>
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to release this jewelry item back to the customer?
          </p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-medium">{jewelry.name}</p>
            <p className="text-sm text-gray-600">{jewelry.category} - {jewelry.purity}</p>
            <p className="text-sm text-gray-600">Amount: ₹{jewelry.amount.toLocaleString()}</p>
          </div>
          <div className="flex space-x-2 pt-4">
            <Button onClick={onConfirm} className="flex-1">Confirm Release</Button>
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Jewelry