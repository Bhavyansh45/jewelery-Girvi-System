import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { UserCheck, Plus, Search, Filter, Edit, Trash2, Eye, Phone, MapPin, Users, TrendingUp } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface Agent {
  id: number
  name: string
  phone: string
  address: string
  createdAt: string
  customerCount: number
  jewelryCount: number
  totalValue: number
  status: 'active' | 'inactive'
}

const Agents: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)

  useEffect(() => {
    // Initialize with empty state
  }, [])

    const handleAddAgent = (agentData: Omit<Agent, 'id' | 'createdAt' | 'customerCount' | 'jewelryCount' | 'totalValue'>) => {
    // Check for duplicate name
    const existingAgent = agents.find(agent =>
      agent.name.toLowerCase().trim() === agentData.name.toLowerCase().trim()
    )

    if (existingAgent) {
      toast.error('An agent with this name already exists!')
      return
    }

    // Check phone number length
    if (agentData.phone && agentData.phone.replace(/\D/g, '').length < 10) {
      toast.error('Phone number must be at least 10 digits long!')
      return
    }

    const newAgent: Agent = {
      ...agentData,
      id: Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
      customerCount: 0,
      jewelryCount: 0,
      totalValue: 0
    }
    setAgents([...agents, newAgent])
    setIsAddModalOpen(false)
    toast.success('Agent added successfully!')
  }

    const handleEditAgent = (agentData: Agent) => {
    // Check for duplicate name (excluding the current agent being edited)
    const existingAgent = agents.find(agent =>
      agent.id !== agentData.id &&
      agent.name.toLowerCase().trim() === agentData.name.toLowerCase().trim()
    )

    if (existingAgent) {
      toast.error('An agent with this name already exists!')
      return
    }

    // Check phone number length
    if (agentData.phone && agentData.phone.replace(/\D/g, '').length < 10) {
      toast.error('Phone number must be at least 10 digits long!')
      return
    }

    setAgents(agents.map(a => a.id === agentData.id ? agentData : a))
    setIsEditModalOpen(false)
    setSelectedAgent(null)
    toast.success('Agent updated successfully!')
  }

  const handleDeleteAgent = (id: number) => {
    if (window.confirm('Are you sure you want to delete this agent?')) {
      setAgents(agents.filter(a => a.id !== id))
      toast.success('Agent deleted successfully!')
    }
  }

  const handleViewAgent = (agent: Agent) => {
    setSelectedAgent(agent)
    setIsViewModalOpen(true)
  }

  const handleEditClick = (agent: Agent) => {
    setSelectedAgent(agent)
    setIsEditModalOpen(true)
  }

  const toggleAgentStatus = (id: number) => {
    setAgents(agents.map(agent => 
      agent.id === id 
        ? { ...agent, status: agent.status === 'active' ? 'inactive' : 'active' }
        : agent
    ))
    toast.success('Agent status updated!')
  }

  const filteredAgents = agents.filter(agent =>
    agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.phone.includes(searchTerm) ||
    agent.address.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Agents</h1>
          <p className="text-gray-600">Manage your agent network</p>
        </div>
        <Button 
          className="flex items-center"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Agent
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <UserCheck className="w-8 h-8 text-blue-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Agents</p>
                <p className="text-2xl font-bold text-gray-900">{agents.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-green-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Active Agents</p>
                <p className="text-2xl font-bold text-gray-900">{agents.filter(a => a.status === 'active').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Phone className="w-8 h-8 text-purple-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900">{agents.reduce((sum, a) => sum + a.customerCount, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <UserCheck className="w-5 h-5 mr-2" />
            Agent Management
          </CardTitle>
          <CardDescription>
            View, add, edit, and manage agent information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search agents by name, phone, or address..."
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
          {agents.length === 0 ? (
            <div className="text-center py-12">
              <UserCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No agents yet</h3>
              <p className="text-gray-600 mb-4">
                Get started by adding your first agent to the system.
              </p>
              <Button onClick={() => setIsAddModalOpen(true)}>
                Add First Agent
              </Button>
            </div>
          ) : (
            <>
              {/* Agents Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Agent
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Performance
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
                    {filteredAgents.map((agent) => (
                      <tr key={agent.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-sm font-medium text-blue-700">
                                {agent.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{agent.name}</div>
                              <div className="text-sm text-gray-500">{agent.address}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{agent.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            <div>{agent.customerCount} customers</div>
                            <div className="text-gray-500">{agent.jewelryCount} items</div>
                            <div className="text-gray-500">₹{agent.totalValue.toLocaleString()}</div>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            agent.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {agent.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewAgent(agent)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditClick(agent)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleAgentStatus(agent.id)}
                              className={agent.status === 'active' ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'}
                            >
                              {agent.status === 'active' ? 'Deactivate' : 'Activate'}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteAgent(agent.id)}
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

      {/* Add Agent Modal */}
      {isAddModalOpen && (
        <AddAgentModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddAgent}
        />
      )}

      {/* Edit Agent Modal */}
      {isEditModalOpen && selectedAgent && (
        <EditAgentModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false)
            setSelectedAgent(null)
          }}
          agent={selectedAgent}
          onEdit={handleEditAgent}
        />
      )}

      {/* View Agent Modal */}
      {isViewModalOpen && selectedAgent && (
        <ViewAgentModal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false)
            setSelectedAgent(null)
          }}
          agent={selectedAgent}
        />
      )}
    </div>
  )
}

// Modal Components
interface AddAgentModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (agent: Omit<Agent, 'id' | 'createdAt' | 'customerCount' | 'jewelryCount' | 'totalValue'>) => void
}

const AddAgentModal: React.FC<AddAgentModalProps> = ({ isOpen, onClose, onAdd }) => {
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
        <h2 className="text-xl font-bold mb-4">Add New Agent</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter agent name"
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
            <Button type="submit" className="flex-1">Add Agent</Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

interface EditAgentModalProps {
  isOpen: boolean
  onClose: () => void
  agent: Agent
  onEdit: (agent: Agent) => void
}

const EditAgentModal: React.FC<EditAgentModalProps> = ({ isOpen, onClose, agent, onEdit }) => {
  const [formData, setFormData] = useState({
    name: agent.name,
    phone: agent.phone,
    address: agent.address,
    status: agent.status
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name && formData.phone) {
      onEdit({ ...agent, ...formData })
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit Agent</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter agent name"
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
            <Button type="submit" className="flex-1">Update Agent</Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

interface ViewAgentModalProps {
  isOpen: boolean
  onClose: () => void
  agent: Agent
}

const ViewAgentModal: React.FC<ViewAgentModalProps> = ({ isOpen, onClose, agent }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Agent Details</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <p className="text-sm text-gray-900">{agent.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <p className="text-sm text-gray-900">{agent.phone}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <p className="text-sm text-gray-900">{agent.address}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <p className="text-sm text-gray-900">{agent.status}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Performance</label>
            <p className="text-sm text-gray-900">{agent.customerCount} customers</p>
            <p className="text-sm text-gray-900">{agent.jewelryCount} jewelry items</p>
            <p className="text-sm text-gray-900">₹{agent.totalValue.toLocaleString()} total value</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Added On</label>
            <p className="text-sm text-gray-900">{new Date(agent.createdAt).toLocaleDateString()}</p>
          </div>
          <Button onClick={onClose} className="w-full">Close</Button>
        </div>
      </div>
    </div>
  )
}

export default Agents 