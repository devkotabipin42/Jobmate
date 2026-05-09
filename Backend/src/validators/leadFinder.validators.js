import { z } from 'zod'

export const leadFinderRunSchema = z.object({
    city: z.string().min(2).max(100).trim(),
    sector: z.string().min(2).max(100).trim(),
    count: z.coerce.number().int().min(1).max(50),
    outputLanguage: z.enum(['english', 'nepali', 'roman_nepali']).default('english')
})

export const leadFinderStatusSchema = z.object({
    contactStatus: z.enum(['new', 'reviewed', 'contacted', 'not_interested', 'converted', 'archived']).optional(),
    verificationStatus: z.enum(['unverified', 'needs_review', 'verified', 'rejected']).optional(),
    adminNotes: z.string().max(2000).optional()
}).refine(
    data => data.contactStatus || data.verificationStatus || typeof data.adminNotes === 'string',
    { message: 'At least one status field is required' }
)
