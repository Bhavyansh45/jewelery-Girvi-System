import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { relations, sql } from 'drizzle-orm';

// Users table
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: text('role', { enum: ['admin', 'clerk'] }).notNull().default('clerk'),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Settings table
export const settings = sqliteTable('settings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  key: text('key').notNull().unique(),
  value: text('value').notNull(),
});



// Customers table
export const customers = sqliteTable('customers', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  phone: text('phone').unique(),
  address: text('address'),
  photo: text('photo'),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Agents table
export const agents = sqliteTable('agents', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  phone: text('phone').unique(),
  address: text('address'),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Dealers table
export const dealers = sqliteTable('dealers', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  phone: text('phone').unique(),
  address: text('address'),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Jewelry table
export const jewelry = sqliteTable('jewelry', {
  id: text('id').primaryKey(),
  customerId: integer('customer_id').references(() => customers.id),
  agentId: integer('agent_id').references(() => agents.id),
  name: text('name'),
  category: text('category'),
  purity: text('purity'),
  weight: real('weight'),
  amount: real('amount'),
  interestRate: real('interest_rate'),
  compoundingType: text('compounding_type', { enum: ['annually', 'monthly', 'quarterly', 'daily'] }).default('monthly'),
  lotNo: text('lot_no'),
  inDealer: integer('in_dealer').default(0),
  isReleased: integer('is_released').default(0),
  addedOn: text('added_on').notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Dealer payments table
export const dealerPayments = sqliteTable('dealer_payments', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  jewelryId: text('jewelry_id').references(() => jewelry.id),
  dealerId: integer('dealer_id').references(() => dealers.id),
  interestPaid: real('interest_paid'),
  principalPaid: real('principal_paid'),
  paidOn: text('paid_on').notNull().default(sql`CURRENT_TIMESTAMP`),
  remarks: text('remarks'),
});

// Dealer returns table
export const dealerReturns = sqliteTable('dealer_returns', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  jewelryId: text('jewelry_id').references(() => jewelry.id),
  dealerId: integer('dealer_id').references(() => dealers.id),
  returnedOn: text('returned_on').notNull().default(sql`CURRENT_TIMESTAMP`),
  remarks: text('remarks'),
});

// Customer payments table
export const customerPayments = sqliteTable('customer_payments', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  jewelryId: text('jewelry_id').references(() => jewelry.id),
  interestPaid: real('interest_paid'),
  principalPaid: real('principal_paid'),
  paymentDate: text('payment_date').notNull().default(sql`CURRENT_TIMESTAMP`),
  mode: text('mode'),
  remarks: text('remarks'),
});

// Customer releases table
export const customerReleases = sqliteTable('customer_releases', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  jewelryId: text('jewelry_id').references(() => jewelry.id),
  releaseDate: text('release_date').notNull().default(sql`CURRENT_TIMESTAMP`),
  finalInterest: real('final_interest'),
  finalPrincipal: real('final_principal'),
  remarks: text('remarks'),
});

// Backup logs table
export const backupLogs = sqliteTable('backup_logs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  filename: text('filename').notNull(),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Export logs table
export const exportLogs = sqliteTable('export_logs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  type: text('type').notNull(),
  fileName: text('file_name').notNull(),
  exportedOn: text('exported_on').notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Relations
export const customersRelations = relations(customers, ({ many }) => ({
  jewelry: many(jewelry),
}));

export const agentsRelations = relations(agents, ({ many }) => ({
  jewelry: many(jewelry),
}));

export const dealersRelations = relations(dealers, ({ many }) => ({
  payments: many(dealerPayments),
  returns: many(dealerReturns),
}));

export const jewelryRelations = relations(jewelry, ({ one, many }) => ({
  customer: one(customers, {
    fields: [jewelry.customerId],
    references: [customers.id],
  }),
  agent: one(agents, {
    fields: [jewelry.agentId],
    references: [agents.id],
  }),
  customerPayments: many(customerPayments),
  customerReleases: many(customerReleases),
  dealerPayments: many(dealerPayments),
  dealerReturns: many(dealerReturns),
}));

export const customerPaymentsRelations = relations(customerPayments, ({ one }) => ({
  jewelry: one(jewelry, {
    fields: [customerPayments.jewelryId],
    references: [jewelry.id],
  }),
}));

export const customerReleasesRelations = relations(customerReleases, ({ one }) => ({
  jewelry: one(jewelry, {
    fields: [customerReleases.jewelryId],
    references: [jewelry.id],
  }),
}));

export const dealerPaymentsRelations = relations(dealerPayments, ({ one }) => ({
  jewelry: one(jewelry, {
    fields: [dealerPayments.jewelryId],
    references: [jewelry.id],
  }),
  dealer: one(dealers, {
    fields: [dealerPayments.dealerId],
    references: [dealers.id],
  }),
}));

export const dealerReturnsRelations = relations(dealerReturns, ({ one }) => ({
  jewelry: one(jewelry, {
    fields: [dealerReturns.jewelryId],
    references: [jewelry.id],
  }),
  dealer: one(dealers, {
    fields: [dealerReturns.dealerId],
    references: [dealers.id],
  }),
})); 