import mongoose from 'mongoose'

const fieldTaskSchema = new mongoose.Schema({
    task_type: {
        type: String,
        enum: ['visit', 'survey', 'follow_up', 'demo'],
        required: true
    },

    assigned_to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TeamMember',
        required: true
    },

    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TeamMember',
        required: true
    },

    target_business: {
        name: { type: String, required: true },
        address: { type: String, required: true },
        area: { type: String },
        location: {
            type: { type: String, enum: ['Point'], default: 'Point' },
            coordinates: { type: [Number], default: [0, 0] }
        },
        owner_name: { type: String, default: '' },
        owner_phone: { type: String, default: '' }
    },

    scheduled_date: { type: Date, required: true },
    time_window: {
        start: { type: String, default: '09:00' },
        end: { type: String, default: '18:00' }
    },

    priority: {
        type: String,
        enum: ['low', 'normal', 'urgent'],
        default: 'normal'
    },

    checklist: [{
        item: { type: String },
        completed: { type: Boolean, default: false }
    }],

    previous_visit_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FieldVisit'
    },

    expected_outcome: {
        type: String,
        enum: ['lead', 'signup', 'demo_scheduled', 'info_only'],
        default: 'lead'
    },

    status: {
        type: String,
        enum: ['assigned', 'in_progress', 'completed', 'verified', 'cancelled'],
        default: 'assigned'
    },

    notes_for_agent: { type: String, default: '' },
    completed_at: { type: Date },

    visit_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FieldVisit'
    }
}, { timestamps: true })

fieldTaskSchema.index({ assigned_to: 1, scheduled_date: -1 })
fieldTaskSchema.index({ status: 1, scheduled_date: -1 })
fieldTaskSchema.index({ 'target_business.location': '2dsphere' })

export default mongoose.model('FieldTask', fieldTaskSchema)