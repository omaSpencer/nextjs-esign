import { pgTable, pgEnum, text, timestamp, index } from 'drizzle-orm/pg-core'
import { z } from 'zod'

export const contractStatus = pgEnum('contract_status', ['draft', 'sent', 'signed', 'completed', 'cancelled'])
export const contractType = pgEnum('contract_type', ['employment', 'nda', 'service', 'purchase', 'lease', 'other'])

export const contracts = pgTable(
  'contracts',
  {
    id: text('id').primaryKey(),
    recipient: text('recipient').notNull(),
    email: text('email').notNull(),
    contractType: contractType('contract_type').notNull(),
    subject: text('subject').notNull(),
    status: contractStatus('status').default('draft').notNull(),
    created: timestamp('created').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => new Date())
      .notNull(),
    // Additional useful fields
    content: text('content'), // Contract content/body
    envelopeId: text('envelope_id'), // DocuSign envelope ID
    signedAt: timestamp('signed_at'),
    expiresAt: timestamp('expires_at'),
    createdBy: text('created_by').notNull(), // User ID who created the contract
  },
  (t) => [
    index('idx_contracts_status').on(t.status),
    index('idx_contracts_created').on(t.created),
    index('idx_contracts_email').on(t.email),
    index('idx_contracts_contract_type').on(t.contractType),
    index('idx_contracts_created_by').on(t.createdBy),
  ],
)

export type Contract = typeof contracts.$inferSelect
export type NewContract = typeof contracts.$inferInsert

export const contractSchema = z.object({
  recipient: z.string().min(1, 'Recipient is required'),
  email: z.string().email('Valid email is required'),
  contractType: z.enum(['employment', 'nda', 'service', 'purchase', 'lease', 'other']),
  subject: z.string().min(1, 'Subject is required'),
  status: z.enum(['draft', 'sent', 'signed', 'completed', 'cancelled']).optional(),
  content: z.string().optional(),
  expiresAt: z.date().optional(),
  createdBy: z.string().min(1, 'Created by is required'),
})
