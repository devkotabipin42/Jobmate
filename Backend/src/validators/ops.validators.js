import { z } from 'zod'

// ─── REUSABLE ──────────────────────────────────────────────────────
const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format')
const phoneNepal = z.string().regex(/^9\d{9}$/, 'Invalid Nepal phone (must be 10 digits starting with 9)')
const coordinates = z.tuple([
    z.number().min(-180).max(180),
    z.number().min(-90).max(90)
])

// ─── TEAM MEMBER ───────────────────────────────────────────────────
export const createTeamMemberSchema = z.object({
    user_id: objectId,
    full_name: z.string().min(2).max(100).trim(),
    phone: phoneNepal,
    whatsapp: z.string().optional(),
    ops_role: z.enum(['founder', 'field_agent', 'data_entry']),
    assigned_areas: z.array(z.string()).optional(),
    salary_config: z.object({
        base_type: z.enum(['monthly', 'daily']).optional(),
        base_amount: z.number().min(0).optional(),
        visit_incentive: z.number().min(0).optional(),
        conversion_bonus: z.number().min(0).optional(),
        retention_bonus: z.number().min(0).optional()
    }).optional(),
    bank_details: z.object({
        account_holder: z.string().optional(),
        bank_name: z.string().optional(),
        account_number: z.string().optional(),
        branch: z.string().optional()
    }).optional()
})

export const createAgentSchema = z.object({
    name: z.string().min(2).max(100).trim(),
    email: z.string().email().toLowerCase(),
    password: z.string().min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Must contain uppercase')
        .regex(/[0-9]/, 'Must contain number'),
    full_name: z.string().min(2).max(100).trim(),
    phone: phoneNepal,
    whatsapp: z.string().optional(),
    ops_role: z.enum(['founder', 'field_agent', 'data_entry']),
    assigned_areas: z.array(z.string()).optional(),
    salary_config: z.object({
        base_type: z.enum(['monthly', 'daily']).optional(),
        base_amount: z.number().min(0).optional(),
        visit_incentive: z.number().min(0).optional(),
        conversion_bonus: z.number().min(0).optional(),
        retention_bonus: z.number().min(0).optional()
    }).optional()
})

// ─── TASK ──────────────────────────────────────────────────────────
export const createTaskSchema = z.object({
    task_type: z.enum(['visit', 'survey', 'follow_up', 'demo']),
    assigned_to: objectId,
    target_business: z.object({
        name: z.string().min(1).max(200).trim(),
        address: z.string().min(1).max(500).trim(),
        area: z.string().optional(),
        location: z.object({
            type: z.literal('Point').optional(),
            coordinates: coordinates.optional()
        }).optional(),
        owner_name: z.string().max(100).optional(),
        owner_phone: z.string().optional()
    }),
    scheduled_date: z.string().datetime().or(z.string().min(1)),
    time_window: z.object({
        start: z.string().optional(),
        end: z.string().optional()
    }).optional(),
    priority: z.enum(['low', 'normal', 'urgent']).optional(),
    expected_outcome: z.enum(['lead', 'signup', 'demo_scheduled', 'info_only']).optional(),
    notes_for_agent: z.string().max(2000).optional(),
    checklist: z.array(z.object({
        item: z.string(),
        completed: z.boolean().optional()
    })).optional()
})

// ─── VISIT ─────────────────────────────────────────────────────────
export const submitVisitSchema = z.object({
    task_id: objectId,
    client_submission_id: z.string().optional(),
    check_in: z.object({
        timestamp: z.string().optional(),
        location: z.object({
            type: z.literal('Point').optional(),
            coordinates: coordinates.optional()
        }).optional(),
        gps_accuracy: z.number().optional()
    }).optional(),
    check_out: z.object({
        timestamp: z.string().optional(),
        location: z.object({
            type: z.literal('Point').optional(),
            coordinates: coordinates.optional()
        }).optional()
    }).optional(),
    business_info: z.object({
        name: z.string().max(200).optional(),
        type: z.enum(['kirana', 'restaurant', 'hotel', 'service', 'manufacturing', 'retail', 'other']).optional(),
        owner_name: z.string().max(100).optional(),
        owner_phone: z.string().optional(),
        whatsapp: z.string().optional(),
        address: z.string().max(500).optional(),
        staff_count: z.number().min(0).optional(),
        years_in_business: z.number().min(0).optional()
    }).optional(),
    hiring_needs: z.object({
        looking_to_hire: z.enum(['urgent', 'soon', 'maybe', 'no']).optional(),
        positions: z.string().max(500).optional(),
        budget_min: z.number().min(0).optional(),
        budget_max: z.number().min(0).optional(),
        timeline: z.string().max(200).optional(),
        previous_hiring_source: z.string().max(200).optional()
    }).optional(),
    pitch_outcome: z.object({
        reaction: z.enum(['very_interested', 'interested', 'neutral', 'not_interested']).optional(),
        next_action: z.enum(['signup_now', 'demo_scheduled', 'call_later', 'brochure', 'dead']).optional(),
        objections: z.string().max(2000).optional(),
        agent_notes: z.string().max(5000).optional(),
        voice_note_url: z.string().url().optional().or(z.literal(''))
    }).optional()
})

export const reviewVisitSchema = z.object({
    action: z.enum(['approve', 'reject']),
    review_notes: z.string().max(2000).optional(),
    updated_data: z.any().optional()
})

// ─── SALARY ────────────────────────────────────────────────────────
export const calculateSalarySchema = z.object({
    agent_id: objectId,
    month: z.number().int().min(1).max(12),
    year: z.number().int().min(2020).max(2100)
})