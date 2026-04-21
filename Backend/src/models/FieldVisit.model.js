import mongoose from 'mongoose'

const fieldVisitSchema = new mongoose.Schema({
    task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FieldTask',
        required: true
    },

    agent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TeamMember',
        required: true
    },

    check_in: {
        timestamp: { type: Date },
        location: {
            type: { type: String, enum: ['Point'], default: 'Point' },
            coordinates: { type: [Number], default: [0, 0] }
        },
        gps_accuracy: { type: Number, default: 0 },
        distance_from_target: { type: Number, default: 0 }
    },

    check_out: {
        timestamp: { type: Date },
        location: {
            type: { type: String, enum: ['Point'], default: 'Point' },
            coordinates: { type: [Number], default: [0, 0] }
        }
    },

    duration_minutes: { type: Number, default: 0 },

    business_info: {
        name: { type: String },
        type: {
            type: String,
            enum: ['kirana', 'restaurant', 'hotel', 'service', 'manufacturing', 'retail', 'other']
        },
        owner_name: { type: String },
        owner_phone: { type: String },
        whatsapp: { type: String },
        address: { type: String },
        staff_count: { type: Number, default: 0 },
        years_in_business: { type: Number, default: 0 }
    },

    hiring_needs: {
        looking_to_hire: {
            type: String,
            enum: ['urgent', 'soon', 'maybe', 'no'],
            default: 'maybe'
        },
        positions: { type: String, default: '' },
        budget_min: { type: Number, default: 0 },
        budget_max: { type: Number, default: 0 },
        timeline: { type: String, default: '' },
        previous_hiring_source: { type: String, default: '' }
    },

    pitch_outcome: {
        reaction: {
            type: String,
            enum: ['very_interested', 'interested', 'neutral', 'not_interested'],
            default: 'neutral'
        },
        next_action: {
            type: String,
            enum: ['signup_now', 'demo_scheduled', 'call_later', 'brochure', 'dead'],
            default: 'call_later'
        },
        objections: { type: String, default: '' },
        agent_notes: { type: String, default: '' },
        voice_note_url: { type: String, default: '' }
    },

    proofs: {
        shop_photo_url: { type: String, default: '' },
        owner_selfie_url: { type: String, default: '' },
        visiting_card_url: { type: String, default: '' }
    },

    quality_flags: [{
        type: String,
        enum: ['gps_mismatch', 'duplicate', 'phone_invalid', 'photo_unclear', 'duration_too_short', 'duration_too_long']
    }],

    review_status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'needs_verification'],
        default: 'pending'
    },

    reviewed_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TeamMember'
    },
    reviewed_at: { type: Date },
    review_notes: { type: String, default: '' },

    crm_lead_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CRM'
    },

    converted_employer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employer'
    },

    synced_at: { type: Date, default: Date.now },
    client_submission_id: { type: String, unique: true, sparse: true }
}, { timestamps: true })

fieldVisitSchema.index({ agent: 1, 'check_in.timestamp': -1 })
fieldVisitSchema.index({ review_status: 1, createdAt: -1 })
fieldVisitSchema.index({ 'check_in.location': '2dsphere' })
fieldVisitSchema.index({ 'business_info.owner_phone': 1 })

export default mongoose.model('FieldVisit', fieldVisitSchema)