// Browser-compatible database simulation
// Using localStorage instead of SQLite for browser compatibility

import * as schema from './schema';

// Simulated database for demo purposes
const demoData = {
  users: [
    { id: 1, username: 'admin', passwordHash: 'admin123', role: 'admin', createdAt: new Date().toISOString(), isActive: true, lastLogin: new Date().toISOString() },
    { id: 2, username: 'clerk', passwordHash: 'clerk123', role: 'clerk', createdAt: new Date().toISOString(), isActive: true, lastLogin: new Date().toISOString() },
  ],
  customers: [
    { id: 1, name: 'John Doe', phone: '+1234567890', address: '123 Main St', photo: null, createdAt: new Date().toISOString() },
    { id: 2, name: 'Jane Smith', phone: '+0987654321', address: '456 Oak Ave', photo: null, createdAt: new Date().toISOString() },
  ],
  agents: [
    { id: 1, name: 'Agent 1', phone: '+1111111111', address: 'Agent Address 1', createdAt: new Date().toISOString() },
    { id: 2, name: 'Agent 2', phone: '+2222222222', address: 'Agent Address 2', createdAt: new Date().toISOString() },
  ],
  dealers: [
    { id: 1, name: 'Dealer 1', phone: '+3333333333', address: 'Dealer Address 1', createdAt: new Date().toISOString() },
    { id: 2, name: 'Dealer 2', phone: '+4444444444', address: 'Dealer Address 2', createdAt: new Date().toISOString() },
  ],
  jewelry: [],
  customerPayments: [],
  dealerPayments: [],
  settings: [
    { id: 1, key: 'theme', value: 'theme-pearl' },
    { id: 2, key: 'company_name', value: 'Jewelry Girvi System' },
    { id: 3, key: 'currency', value: 'INR' },
    { id: 4, key: 'default_interest_rate', value: '12.0' },
  ],
};

// Load data from localStorage or use demo data
function loadData() {
  try {
    const stored = localStorage.getItem('jewelry_girvi_data');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading data from localStorage:', error);
  }
  return demoData;
}

// Save data to localStorage
function saveData(data: any) {
  try {
    localStorage.setItem('jewelry_girvi_data', JSON.stringify(data));
  } catch (error) {
    console.error('Error saving data to localStorage:', error);
  }
}

// Get current data
let currentData = loadData();

export function initDatabase(dbPath: string = 'jewelry_girvi.db') {
  console.log('Database initialized (browser mode)');
  return {
    // Simulated database methods
    select: () => ({
      from: (table: any) => ({
        where: (condition: any) => ({
          get: async () => {
            const data = currentData[table as keyof typeof currentData] || [];
            if (Array.isArray(data)) {
              // Simple filtering for demo purposes
              if (condition.id) {
                return data.find((item: any) => item.id === condition.id) || null;
              }
              if (condition.username) {
                return data.find((item: any) => item.username === condition.username) || null;
              }
              if (condition.key) {
                return data.find((item: any) => item.key === condition.key) || null;
              }
            }
            return data[0] || null;
          },
          all: async () => currentData[table as keyof typeof currentData] || [],
        }),
        get: async () => currentData[table as keyof typeof currentData]?.[0] || null,
        all: async () => currentData[table as keyof typeof currentData] || [],
      }),
    }),
    insert: (table: any) => ({
      values: (data: any) => ({
        returning: (fields: any) => ({
          get: async () => {
            const newId = Date.now();
            const newItem = { id: newId, ...data };
            // Add to current data
            if (currentData[table as keyof typeof currentData] && Array.isArray(currentData[table as keyof typeof currentData])) {
              (currentData[table as keyof typeof currentData] as any[]).push(newItem);
              saveData(currentData);
            }
            return newItem;
          },
        }),
      }),
    }),
    update: (table: any) => ({
      set: (data: any) => ({
        where: (condition: any) => {
          // Update current data
          if (currentData[table as keyof typeof currentData] && Array.isArray(currentData[table as keyof typeof currentData])) {
            const items = currentData[table as keyof typeof currentData] as any[];
            const index = items.findIndex((item: any) => {
              if (condition.id) return item.id === condition.id;
              if (condition.username) return item.username === condition.username;
              if (condition.key) return item.key === condition.key;
              return false;
            });
            if (index !== -1) {
              items[index] = { ...items[index], ...data };
              saveData(currentData);
            }
          }
          return Promise.resolve();
        },
      }),
    }),
    delete: (table: any) => ({
      where: (condition: any) => {
        // Delete from current data
        if (currentData[table as keyof typeof currentData] && Array.isArray(currentData[table as keyof typeof currentData])) {
          const items = currentData[table as keyof typeof currentData] as any[];
          const index = items.findIndex((item: any) => {
            if (condition.id) return item.id === condition.id;
            if (condition.username) return item.username === condition.username;
            if (condition.key) return item.key === condition.key;
            return false;
          });
          if (index !== -1) {
            items.splice(index, 1);
            saveData(currentData);
          }
        }
        return Promise.resolve();
      },
    }),
  };
}

export function getDatabase() {
  return initDatabase();
}

export function closeDatabase() {
  console.log('Database closed (browser mode)');
}

// Database service class for common operations
export class DatabaseService {
  private data: any;

  constructor() {
    this.data = loadData(); // Load fresh data on initialization
  }

  // Get fresh data from localStorage
  private getFreshData() {
    this.data = loadData();
    return this.data;
  }

  // Generic CRUD operations
  async create(table: string, data: any): Promise<any> {
    try {
      const freshData = this.getFreshData();
      const newId = Date.now();
      const newItem = { id: newId, ...data };
      
      if (freshData[table] && Array.isArray(freshData[table])) {
        freshData[table].push(newItem);
        saveData(freshData);
        this.data = freshData; // Update local reference
      }
      
      return newItem;
    } catch (error) {
      console.error(`Error creating ${table}:`, error);
      throw error;
    }
  }

  async findById(table: string, id: number | string): Promise<any> {
    try {
      const freshData = this.getFreshData();
      const items = freshData[table] || [];
      return items.find((item: any) => item.id === id) || null;
    } catch (error) {
      console.error(`Error finding ${table} by id:`, error);
      throw error;
    }
  }

  async findAll(
    table: string,
    options?: {
      limit?: number;
      offset?: number;
      orderBy?: { column: string; direction: 'asc' | 'desc' };
    }
  ): Promise<any[]> {
    try {
      const freshData = this.getFreshData();
      let items = freshData[table] || [];

      if (options?.orderBy) {
        items = items.sort((a: any, b: any) => {
          const aVal = a[options.orderBy!.column];
          const bVal = b[options.orderBy!.column];
          
          if (options.orderBy!.direction === 'desc') {
            return bVal > aVal ? 1 : -1;
          } else {
            return aVal > bVal ? 1 : -1;
          }
        });
      }

      if (options?.offset) {
        items = items.slice(options.offset);
      }

      if (options?.limit) {
        items = items.slice(0, options.limit);
      }

      return items;
    } catch (error) {
      console.error(`Error finding all ${table}:`, error);
      throw error;
    }
  }

  async update(table: string, id: number | string, data: any): Promise<any> {
    try {
      const freshData = this.getFreshData();
      const items = freshData[table] || [];
      const index = items.findIndex((item: any) => item.id === id);
      
      if (index !== -1) {
        items[index] = { ...items[index], ...data };
        saveData(freshData);
        this.data = freshData; // Update local reference
        return items[index];
      }
      
      return null;
    } catch (error) {
      console.error(`Error updating ${table}:`, error);
      throw error;
    }
  }

  async delete(table: string, id: number | string): Promise<boolean> {
    try {
      const freshData = this.getFreshData();
      const items = freshData[table] || [];
      const index = items.findIndex((item: any) => item.id === id);
      
      if (index !== -1) {
        items.splice(index, 1);
        saveData(freshData);
        this.data = freshData; // Update local reference
        return true;
      }
      
      return false;
    } catch (error) {
      console.error(`Error deleting ${table}:`, error);
      throw error;
    }
  }

  // Specific business logic methods
  async findUserByUsername(username: string): Promise<any> {
    try {
      const freshData = this.getFreshData();
      const users = freshData.users || [];
      return users.find((user: any) => user.username === username) || null;
    } catch (error) {
      console.error('Error finding user by username:', error);
      throw error;
    }
  }

  async findJewelryByCustomer(customerId: number): Promise<any[]> {
    try {
      const freshData = this.getFreshData();
      const jewelry = freshData.jewelry || [];
      return jewelry.filter((item: any) => item.customerId === customerId);
    } catch (error) {
      console.error('Error finding jewelry by customer:', error);
      throw error;
    }
  }

  async findJewelryByAgent(agentId: number): Promise<any[]> {
    try {
      const freshData = this.getFreshData();
      const jewelry = freshData.jewelry || [];
      return jewelry.filter((item: any) => item.agentId === agentId);
    } catch (error) {
      console.error('Error finding jewelry by agent:', error);
      throw error;
    }
  }

  async findJewelryWithRelations(jewelryId: string): Promise<any> {
    try {
      const freshData = this.getFreshData();
      const jewelry = freshData.jewelry || [];
      const customers = freshData.customers || [];
      const agents = freshData.agents || [];
      
      const jewelryItem = jewelry.find((item: any) => item.id === jewelryId);
      if (!jewelryItem) return null;
      
      const customer = customers.find((c: any) => c.id === jewelryItem.customerId);
      const agent = agents.find((a: any) => a.id === jewelryItem.agentId);
      
      return {
        jewelry: jewelryItem,
        customer,
        agent
      };
    } catch (error) {
      console.error('Error finding jewelry with relations:', error);
      throw error;
    }
  }

  async getCustomerPayments(jewelryId: string): Promise<any[]> {
    try {
      const freshData = this.getFreshData();
      const payments = freshData.customerPayments || [];
      return payments
        .filter((payment: any) => payment.jewelryId === jewelryId)
        .sort((a: any, b: any) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime());
    } catch (error) {
      console.error('Error getting customer payments:', error);
      throw error;
    }
  }

  async getDealerPayments(jewelryId: string): Promise<any[]> {
    try {
      const freshData = this.getFreshData();
      const payments = freshData.dealerPayments || [];
      const dealers = freshData.dealers || [];
      
      return payments
        .filter((payment: any) => payment.jewelryId === jewelryId)
        .map((payment: any) => {
          const dealer = dealers.find((d: any) => d.id === payment.dealerId);
          return {
            payment,
            dealer
          };
        })
        .sort((a: any, b: any) => new Date(b.payment.paidOn).getTime() - new Date(a.payment.paidOn).getTime());
    } catch (error) {
      console.error('Error getting dealer payments:', error);
      throw error;
    }
  }

  async searchCustomers(searchTerm: string): Promise<any[]> {
    try {
      const freshData = this.getFreshData();
      const customers = freshData.customers || [];
      return customers.filter((customer: any) => 
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } catch (error) {
      console.error('Error searching customers:', error);
      throw error;
    }
  }

  async getDashboardStats(): Promise<any> {
    try {
      const freshData = this.getFreshData();
      const customers = freshData.customers || [];
      const agents = freshData.agents || [];
      const dealers = freshData.dealers || [];
      const jewelry = freshData.jewelry || [];
      
      const inHandJewelry = jewelry.filter((item: any) => !item.inDealer && !item.isReleased);
      const transferredJewelry = jewelry.filter((item: any) => item.inDealer && !item.isReleased);
      const releasedJewelry = jewelry.filter((item: any) => item.isReleased);

      return {
        totalCustomers: customers.length,
        totalAgents: agents.length,
        totalDealers: dealers.length,
        totalJewelry: jewelry.length,
        inHandJewelry: inHandJewelry.length,
        transferredJewelry: transferredJewelry.length,
        releasedJewelry: releasedJewelry.length
      };
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const dbService = new DatabaseService();

// Export schema for compatibility
export { schema }; 