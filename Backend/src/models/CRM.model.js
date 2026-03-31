import mongoose from 'mongoose'

const crmSchema = new mongoose.Schema({
    employer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employer',
        required: true
    },
    candidate: {
        name: String,
        email: String,
        phone: String,
        location: String,
        skills: String,
    },
    status: {
        type: String,
        enum: ['new', 'interested', 'follow_up', 'interview', 'hired', 'rejected'],
        default: 'new'
    },
    notes: [{
        text: String,
        createdAt: { type: Date, default: Date.now }
    }],
    follow_up_date: {
        type: Date
    },
    source: {
        type: String,
        enum: ['jobmate', 'linkedin', 'referral', 'direct', 'other'],
        default: 'jobmate'
    },
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job'
    }
}, { timestamps: true })

export default mongoose.model('CRM', crmSchema)