import mongoose from 'mongoose'

const followUpLogSchema = new mongoose.Schema({
    source: {
        type: String,
        enum: ['jobmate_website'],
        default: 'jobmate_website'
    },

    applicationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Application'
    },

    taskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FieldTask'
    },

    type: {
        type: String,
        enum: [
            'candidate_reengagement',
            'candidate_hired_confirmation',
            'candidate_interview_confirmation',
            'employer_application_review',
            'general_followup'
        ],
        required: true
    },

    phone: {
        type: String,
        required: true,
        trim: true
    },

    recipientName: {
        type: String,
        default: ''
    },

    jobTitle: {
        type: String,
        default: ''
    },

    companyName: {
        type: String,
        default: ''
    },

    status: {
        type: String,
        enum: ['queued', 'sent', 'failed', 'replied', 'cancelled'],
        default: 'queued'
    },

    message: {
        type: String,
        default: ''
    },

    payload: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },

    externalFollowupId: {
        type: String,
        default: ''
    },

    sentAt: Date,
    failedAt: Date,
    repliedAt: Date,

    replyText: {
        type: String,
        default: ''
    },

    lastError: {
        type: String,
        default: ''
    }
}, { timestamps: true })

followUpLogSchema.index({ applicationId: 1, type: 1, status: 1 })
followUpLogSchema.index({ taskId: 1, type: 1, status: 1 })
followUpLogSchema.index({ phone: 1, type: 1, createdAt: -1 })

export default mongoose.model('FollowUpLog', followUpLogSchema)