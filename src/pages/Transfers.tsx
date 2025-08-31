import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Truck, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Package,
  User,
  Building2,
  Gem,
  Calendar,
  DollarSign,
  ArrowLeft as BackIcon
} from 'lucide-react'
import { toast } from 'react-hot-toast'

interface Jewelry {
  id: string
  customerName: string
  jewelryName: string
  type: string
  acquisitionDate: string
  agentName: string
  principalAmount: number
  isSelected?: boolean
  customerId?: string
  amountTakenFromDealer?: number
}

interface TransferDetails {
  dealer: string
  dealerInterestRate: number
  lotNumber: string
  transferDate: string
}

interface SelectedJewelry extends Jewelry {
  transferAmount: number
}

const Transfers: React.FC = () => {
  const [operationType, setOperationType] = useState<'transfer' | 'release'>('transfer')
  const [searchTerm, setSearchTerm] = useState('')
  const [availableJewelry, setAvailableJewelry] = useState<Jewelry[]>([])
  const [selectedJewelry, setSelectedJewelry] = useState<SelectedJewelry[]>([])
  const [transferDetails, setTransferDetails] = useState<TransferDetails>({
    dealer: '',
    dealerInterestRate: 12,
    lotNumber: '',
    transferDate: new Date().toISOString().split('T')[0]
  })
  const [selectedLot, setSelectedLot] = useState('')

  useEffect(() => {
    // Initialize with sample data based on operation type
    if (operationType === 'transfer') {
      // Available jewelry for transfer to dealer
      setAvailableJewelry([
        {
          id: '1',
          customerName: 'John Doe',
          jewelryName: 'Gold Ring',
          type: 'gold',
          acquisitionDate: '2024-01-15',
          agentName: 'Agent A',
          principalAmount: 25000
        },
        {
          id: '2',
          customerName: 'Jane Smith',
          jewelryName: 'Diamond Necklace',
          type: 'diamond',
          acquisitionDate: '2024-02-20',
          agentName: 'Agent B',
          principalAmount: 50000
        },
        {
          id: '3',
          customerName: 'Mike Johnson',
          jewelryName: 'Silver Bracelet',
          type: 'silver',
          acquisitionDate: '2024-03-10',
          agentName: 'Agent C',
          principalAmount: 15000
        }
      ])
         } else {
       // Jewelry currently with dealers for release
       setAvailableJewelry([
         {
           id: '1',
           customerName: 'bh',
           jewelryName: 'Ring',
           type: 'silver',
           acquisitionDate: '2024-03-19',
           agentName: 't',
           principalAmount: 15000,
           customerId: '1',
           amountTakenFromDealer: 12000
         },
         {
           id: '2',
           customerName: 'John Doe',
           jewelryName: 'Gold Chain',
           type: 'gold',
           acquisitionDate: '2024-02-15',
           agentName: 'Agent A',
           principalAmount: 25000,
           customerId: '2',
           amountTakenFromDealer: 20000
         },
         {
           id: '3',
           customerName: 'Jane Smith',
           jewelryName: 'Diamond Ring',
           type: 'diamond',
           acquisitionDate: '2024-01-20',
           agentName: 'Agent B',
           principalAmount: 45000,
           customerId: '3',
           amountTakenFromDealer: 36000
         }
       ])
     }
  }, [operationType])

  const handleJewelrySelection = (jewelry: Jewelry, isSelected: boolean) => {
    if (isSelected) {
      // Add to selected jewelry
      const newSelectedJewelry: SelectedJewelry = {
        ...jewelry,
        transferAmount: jewelry.principalAmount * 0.8 // Default to 80% of principal amount
      }
      setSelectedJewelry([...selectedJewelry, newSelectedJewelry])
      
      // Update available jewelry to show as selected
      setAvailableJewelry(availableJewelry.map(item => 
        item.id === jewelry.id ? { ...item, isSelected: true } : item
      ))
    } else {
      // Remove from selected jewelry
      setSelectedJewelry(selectedJewelry.filter(item => item.id !== jewelry.id))
      
      // Update available jewelry to show as not selected
      setAvailableJewelry(availableJewelry.map(item => 
        item.id === jewelry.id ? { ...item, isSelected: false } : item
      ))
    }
  }

  const handleRemoveJewelry = (jewelryId: string) => {
    setSelectedJewelry(selectedJewelry.filter(item => item.id !== jewelryId))
    setAvailableJewelry(availableJewelry.map(item => 
      item.id === jewelryId ? { ...item, isSelected: false } : item
    ))
  }

  const handleTransferAmountChange = (jewelryId: string, amount: number) => {
    setSelectedJewelry(selectedJewelry.map(item => 
      item.id === jewelryId ? { ...item, transferAmount: amount } : item
    ))
  }

  const handleTransferJewelry = () => {
    if (selectedJewelry.length === 0) {
      toast.error('Please select at least one jewelry item')
      return
    }
    
    if (!transferDetails.dealer || !transferDetails.lotNumber) {
      toast.error('Please fill in all transfer details')
      return
    }

    // Here you would typically send the data to your backend
    const transferData = {
      ...transferDetails,
      selectedJewelry,
      totalAmount: selectedJewelry.reduce((sum, item) => sum + item.transferAmount, 0),
      operationType
    }

    console.log('Transfer Data:', transferData)
    toast.success(operationType === 'transfer' ? 'Jewelry transferred successfully!' : 'Jewelry released successfully!')
    
    // Reset form
    setSelectedJewelry([])
    setAvailableJewelry(availableJewelry.map(item => ({ ...item, isSelected: false })))
    setTransferDetails({
      dealer: '',
      dealerInterestRate: 12,
      lotNumber: '',
      transferDate: new Date().toISOString().split('T')[0]
    })
  }

  const filteredJewelry = availableJewelry.filter(jewelry => {
    // For transfer mode, show all jewelry with search filter
    if (operationType === 'transfer') {
      return jewelry.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        jewelry.jewelryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        jewelry.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        jewelry.id.includes(searchTerm)
    }
    
    // For release mode, only show jewelry if dealer and lot are selected
    if (operationType === 'release') {
      if (!transferDetails.dealer || !selectedLot) {
        return false // Don't show any jewelry if dealer or lot not selected
      }
      
      // Here you would typically filter by dealer and lot from your backend
      // For now, we'll show all jewelry when dealer and lot are selected
      return jewelry.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        jewelry.jewelryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        jewelry.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        jewelry.id.includes(searchTerm)
    }
    
    return false
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {operationType === 'transfer' ? 'Transfer Jewelry to Dealer' : 'Release Jewelry from Dealer'}
          </h1>
          <p className="text-gray-600">
            {operationType === 'transfer' 
              ? 'Select jewelry items and transfer them to dealers' 
              : 'Select jewelry items to release from dealers back to inventory'
            }
          </p>
        </div>
      </div>

      {/* Operation Type Toggle */}
      <Card>
        <CardContent className="p-4">
          <div className="flex space-x-4">
            <Button
              variant={operationType === 'transfer' ? 'default' : 'outline'}
              onClick={() => setOperationType('transfer')}
              className="flex-1"
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              Transfer to Dealer
            </Button>
            <Button
              variant={operationType === 'release' ? 'default' : 'outline'}
              onClick={() => setOperationType('release')}
              className="flex-1"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Release from Dealer
            </Button>
          </div>
        </CardContent>
      </Card>

             {/* Search Jewelry Section - Only for Transfer */}
       {operationType === 'transfer' && (
         <Card>
           <CardHeader>
             <CardTitle>Search Available Jewelry</CardTitle>
           </CardHeader>
           <CardContent>
             <div className="relative">
               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
               <Input
                 type="text"
                 placeholder="Search by customer name, ID, or agent name"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="pl-10"
               />
             </div>
           </CardContent>
         </Card>
       )}

                           {/* Available Jewelry Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              {operationType === 'transfer' ? 'Available Jewelry' : 'Jewelry with Dealers'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {operationType === 'release' && (!transferDetails.dealer || !selectedLot) ? (
              <div className="text-center py-8">
                <p className="text-gray-500 text-lg">
                  Please select a dealer and lot number to view jewelry
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-blue-600 text-white">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          onChange={(e) => {
                            if (e.target.checked) {
                              filteredJewelry.forEach(jewelry => {
                                if (!jewelry.isSelected) {
                                  handleJewelrySelection(jewelry, true)
                                }
                              })
                            } else {
                              filteredJewelry.forEach(jewelry => {
                                if (jewelry.isSelected) {
                                  handleJewelrySelection(jewelry, false)
                                }
                              })
                            }
                          }}
                        />
                      </th>
                      {operationType === 'transfer' ? (
                        <>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                            Jewelry ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                            Customer Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                            Jewelry Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                            Type
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                            Acquisition Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                            Agent Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                            Principal Amount
                          </th>
                        </>
                      ) : (
                        <>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                            Customer Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                            Agent Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                            Acquisition Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                            Customer ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                            Jewelry Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                            Amount Taken from Dealer
                          </th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredJewelry.length === 0 ? (
                      <tr>
                        <td colSpan={operationType === 'transfer' ? 8 : 7} className="px-6 py-4 text-center text-gray-500">
                          {operationType === 'transfer' 
                            ? 'No jewelry found matching your search criteria'
                            : 'No jewelry found for the selected dealer and lot'
                          }
                        </td>
                      </tr>
                    ) : (
                      filteredJewelry.map((jewelry) => (
                        <tr key={jewelry.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="checkbox"
                              checked={jewelry.isSelected || false}
                              onChange={(e) => handleJewelrySelection(jewelry, e.target.checked)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                          </td>
                          {operationType === 'transfer' ? (
                            <>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {jewelry.id}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {jewelry.customerName}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {jewelry.jewelryName}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {jewelry.type}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {new Date(jewelry.acquisitionDate).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {jewelry.agentName}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                ₹{jewelry.principalAmount.toLocaleString()}
                              </td>
                            </>
                          ) : (
                            <>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {jewelry.customerName}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {jewelry.agentName}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {new Date(jewelry.acquisitionDate).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {jewelry.customerId}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {jewelry.jewelryName}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                ₹{jewelry.amountTakenFromDealer?.toLocaleString() || '0'}
                              </td>
                            </>
                          )}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

             {/* Transfer Details Section - Only for Transfer */}
       {operationType === 'transfer' && (
         <Card>
           <CardHeader>
             <CardTitle>Transfer Details</CardTitle>
           </CardHeader>
           <CardContent>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Dealer</label>
                 <select
                   value={transferDetails.dealer}
                   onChange={(e) => setTransferDetails({ ...transferDetails, dealer: e.target.value })}
                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                 >
                   <option value="">Select Dealer</option>
                   <option value="Test1">Test1</option>
                   <option value="Test2">Test2</option>
                   <option value="Test3">Test3</option>
                 </select>
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Dealer Interest Rate (%)</label>
                 <Input
                   type="number"
                   value={transferDetails.dealerInterestRate}
                   onChange={(e) => setTransferDetails({ ...transferDetails, dealerInterestRate: parseFloat(e.target.value) || 0 })}
                   placeholder="12"
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Lot Number</label>
                 <Input
                   type="text"
                   value={transferDetails.lotNumber}
                   onChange={(e) => setTransferDetails({ ...transferDetails, lotNumber: e.target.value })}
                   placeholder="1"
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Transfer Date</label>
                 <Input
                   type="date"
                   value={transferDetails.transferDate}
                   onChange={(e) => setTransferDetails({ ...transferDetails, transferDate: e.target.value })}
                 />
               </div>
             </div>
           </CardContent>
         </Card>
       )}

       {/* Release Details Section - Only for Release */}
       {operationType === 'release' && (
         <Card>
           <CardHeader>
             <CardTitle>Release Details</CardTitle>
           </CardHeader>
           <CardContent>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Select Dealer:</label>
                 <select
                   value={transferDetails.dealer}
                   onChange={(e) => setTransferDetails({ ...transferDetails, dealer: e.target.value })}
                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                 >
                   <option value="">Select Dealer</option>
                   <option value="Test1">Test1</option>
                   <option value="Test2">Test2</option>
                   <option value="Test3">Test3</option>
                 </select>
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Select Lot:</label>
                 <select
                   value={selectedLot}
                   onChange={(e) => setSelectedLot(e.target.value)}
                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                 >
                   <option value="">Select Lot</option>
                   <option value="1">1</option>
                   <option value="2">2</option>
                   <option value="3">3</option>
                 </select>
               </div>
             </div>
           </CardContent>
         </Card>
       )}

      {/* Selected Jewelry Section */}
      {selectedJewelry.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              {operationType === 'transfer' ? 'Selected Jewelry' : 'Jewelry to Release'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Jewelry ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Jewelry Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acquisition Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Agent Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedJewelry.map((jewelry) => (
                    <tr key={jewelry.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {jewelry.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {jewelry.customerName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {jewelry.jewelryName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {jewelry.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(jewelry.acquisitionDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {jewelry.agentName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Input
                          type="number"
                          value={jewelry.transferAmount}
                          onChange={(e) => handleTransferAmountChange(jewelry.id, parseFloat(e.target.value) || 0)}
                          className="w-24"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveJewelry(jewelry.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-4">
                 <Button 
           onClick={handleTransferJewelry}
           className={operationType === 'transfer' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'}
           disabled={selectedJewelry.length === 0}
         >
           {operationType === 'transfer' ? 'Transfer Jewelry' : 'Release Selected Jewelry'}
         </Button>
        <Button variant="outline" onClick={() => window.history.back()}>
          <BackIcon className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>
    </div>
  )
}

export default Transfers 