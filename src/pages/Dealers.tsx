import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Building2, Plus, Search, Filter, Edit, Trash2, Eye, Phone, MapPin, Package, DollarSign } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface Dealer {
  id: number
  name: string
  phone: string
  address: string
  createdAt: string
  jewelryCount: number
  totalValue: number
  status: 'active' | 'inactive'
}

const Dealers: React.FC = () => {
  const [dealers, setDealers] = useState<Dealer[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedDealer, setSelectedDealer] = useState<Dealer | null>(null)

  useEffect(() => {
    // Initialize with empty state
  }, [])

  const handleAddDealer = (dealerData: Omit<Dealer, 'id' | 'createdAt' | 'jewelryCount' | 'totalValue'>) => {
    // Check for duplicate name
    const existingDealer = dealers.find(dealer => 
      dealer.name.toLowerCase().trim() === dealerData.name.toLowerCase().trim()
    )
    
    if (existingDealer) {
      toast.error('A dealer with this name already exists!')
      return
    }

    // Check phone number length
    if (dealerData.phone && dealerData.phone.replace(/\D/g, '').length < 10) {
      toast.error('Phone number must be at least 10 digits long!')
      return
    }

    const newDealer: Dealer = {
      ...dealerData,
      id: Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
      jewelryCount: 0,
      totalValue: 0
    }
    setDealers([...dealers, newDealer])
    setIsAddModalOpen(false)
    toast.success('Dealer added successfully!')
  }

  const handleEditDealer = (dealerData: Dealer) => {
    // Check for duplicate name (excluding the current dealer being edited)
    const existingDealer = dealers.find(dealer => 
      dealer.id !== dealerData.id && 
      dealer.name.toLowerCase().trim() === dealerData.name.toLowerCase().trim()
    )
    
    if (existingDealer) {
      toast.error('A dealer with this name already exists!')
      return
    }

    // Check phone number length
    if (dealerData.phone && dealerData.phone.replace(/\D/g, '').length < 10) {
      toast.error('Phone number must be at least 10 digits long!')
      return
    }

    setDealers(dealers.map(d => d.id === dealerData.id ? dealerData : d))
    setIsEditModalOpen(false)
    setSelectedDealer(null)
    toast.success('Dealer updated successfully!')
  }

  const handleDeleteDealer = (id: number) => {
    if (window.confirm('Are you sure you want to delete this dealer?')) {
      setDealers(dealers.filter(d => d.id !== id))
      toast.success('Dealer deleted successfully!')
    }
  }

  const handleViewDealer = (dealer: Dealer) => {
    setSelectedDealer(dealer)
    setIsViewModalOpen(true)
  }

  const handleEditClick = (dealer: Dealer) => {
    setSelectedDealer(dealer)
    setIsEditModalOpen(true)
  }

  const toggleDealerStatus = (id: number) => {
    setDealers(dealers.map(dealer => 
      dealer.id === id 
        ? { ...dealer, status: dealer.status === 'active' ? 'inactive' : 'active' }
        : dealer
    ))
    toast.success('Dealer status updated!')
  }

  const filteredDealers = dealers.filter(dealer =>
    dealer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dealer.phone.includes(searchTerm) ||
    dealer.address.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dealers</h1>
          <p className="text-gray-600">Manage your dealer network</p>
        </div>
        <Button 
          className="flex items-center"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Dealer
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Building2 className="w-8 h-8 text-blue-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Dealers</p>
                <p className="text-2xl font-bold text-gray-900">{dealers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Package className="w-8 h-8 text-green-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Active Dealers</p>
                <p className="text-2xl font-bold text-gray-900">{dealers.filter(d => d.status === 'active').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Phone className="w-8 h-8 text-purple-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Jewelry</p>
                <p className="text-2xl font-bold text-gray-900">{dealers.reduce((sum, d) => sum + d.jewelryCount, 0)}</p>
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
                <p className="text-2xl font-bold text-gray-900">₹{dealers.reduce((sum, d) => sum + d.totalValue, 0).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building2 className="w-5 h-5 mr-2" />
            Dealer Management
          </CardTitle>
          <CardDescription>
            View, add, edit, and manage dealer information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search dealers by name, phone, or address..."
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
          {dealers.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No dealers yet</h3>
              <p className="text-gray-600 mb-4">
                Get started by adding your first dealer to the system.
              </p>
              <Button onClick={() => setIsAddModalOpen(true)}>
                Add First Dealer
              </Button>
            </div>
          ) : (
            <>
              {/* Dealers Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dealer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Jewelry Count
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Value
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
                    {filteredDealers.map((dealer) => (
                      <tr key={dealer.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                              <span className="text-sm font-medium text-orange-700">
                                {dealer.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{dealer.name}</div>
                              <div className="text-sm text-gray-500">{dealer.address}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{dealer.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {dealer.jewelryCount} items
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{dealer.totalValue.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            dealer.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {dealer.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewDealer(dealer)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditClick(dealer)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleDealerStatus(dealer.id)}
                              className={dealer.status === 'active' ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'}
                            >
                              {dealer.status === 'active' ? 'Deactivate' : 'Activate'}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteDealer(dealer.id)}
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

      {/* Add Dealer Modal */}
      {isAddModalOpen && (
        <AddDealerModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddDealer}
        />
      )}

      {/* Edit Dealer Modal */}
      {isEditModalOpen && selectedDealer && (
        <EditDealerModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false)
            setSelectedDealer(null)
          }}
          dealer={selectedDealer}
          onEdit={handleEditDealer}
        />
      )}

      {/* View Dealer Modal */}
      {isViewModalOpen && selectedDealer && (
        <ViewDealerModal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false)
            setSelectedDealer(null)
          }}
          dealer={selectedDealer}
        />
      )}
    </div>
  )
}

// Modal Components
interface AddDealerModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (dealer: Omit<Dealer, 'id' | 'createdAt' | 'jewelryCount' | 'totalValue'>) => void
}

const AddDealerModal: React.FC<AddDealerModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    status: 'active' as 'active' | 'inactive'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name && formData.phone) {
      onAdd(formData)
      setFormData({ name: '', phone: '', address: '', status: 'active' })
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add New Dealer</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter dealer name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <Input
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Enter phone number"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <Input
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Enter address"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="flex space-x-2 pt-4">
            <Button type="submit" className="flex-1">Add Dealer</Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

interface EditDealerModalProps {
  isOpen: boolean
  onClose: () => void
  dealer: Dealer
  onEdit: (dealer: Dealer) => void
}

const EditDealerModal: React.FC<EditDealerModalProps> = ({ isOpen, onClose, dealer, onEdit }) => {
  const [formData, setFormData] = useState({
    name: dealer.name,
    phone: dealer.phone,
    address: dealer.address,
    status: dealer.status
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name && formData.phone) {
      onEdit({ ...dealer, ...formData })
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit Dealer</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter dealer name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <Input
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Enter phone number"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <Input
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Enter address"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="flex space-x-2 pt-4">
            <Button type="submit" className="flex-1">Update Dealer</Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

interface ViewDealerModalProps {
  isOpen: boolean
  onClose: () => void
  dealer: Dealer
}

const ViewDealerModal: React.FC<ViewDealerModalProps> = ({ isOpen, onClose, dealer }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Dealer Details</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <p className="text-sm text-gray-900">{dealer.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <p className="text-sm text-gray-900">{dealer.phone}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <p className="text-sm text-gray-900">{dealer.address}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <p className="text-sm text-gray-900">{dealer.status}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Jewelry Count</label>
            <p className="text-sm text-gray-900">{dealer.jewelryCount} items</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Value</label>
            <p className="text-sm text-gray-900">₹{dealer.totalValue.toLocaleString()}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Added On</label>
            <p className="text-sm text-gray-900">{new Date(dealer.createdAt).toLocaleDateString()}</p>
          </div>
          <Button onClick={onClose} className="w-full">Close</Button>
        </div>
      </div>
    </div>
  )
}

export default Dealers 