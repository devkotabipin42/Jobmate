import mongoose from 'mongoose'

const leadFinderLeadSchema = new mongoose.Schema({
    company: {
        type: String,
        required: true,
        trim: true
    },
    normalizedCompany: {
        type: String,
        required: true,
        trim: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    normalizedCity: {
        type: String,
        required: true,
        trim: true
    },
    sector: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        default: '',
        trim: true
    },
    phoneType: {
        type: String,
        enum: ['mobile', 'landline', 'unknown'],
        default: 'unknown'
    },
    whatsappPossible: {
        type: Boolean,
        default: false
    },
    address: {
        type: String,
        default: '',
        trim: true
    },
    website: {
        type: String,
        default: '',
        trim: true
    },
    facebookUrl: {
        type: String,
        default: '',
        trim: true
    },
    source: {
        type: String,
        required: true,
        trim: true
    },
    sourceUrl: {
        type: String,
        default: '',
        trim: true
    },
    sourceType: {
        type: String,
        enum: ['external', 'dev_mock'],
        required: true
    },
    score: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'low'
    },
    outreachMessage: {
        type: String,
        default: ''
    },
    verificationStatus: {
        type: String,
        enum: ['unverified', 'needs_review', 'verified', 'rejected'],
        default: 'unverified'
    },
    contactStatus: {
        type: String,
        enum: ['new', 'reviewed', 'contacted', 'not_interested', 'converted', 'archived'],
        default: 'new'
    },
    duplicateWarning: {
        type: Boolean,
        default: false
    },
    duplicateOf: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LeadFinderLead'
    },
    searchCity: {
        type: String,
        default: '',
        trim: true
    },
    searchSector: {
        type: String,
        default: '',
        trim: true
    },
    outputLanguage: {
        type: String,
        enum: ['english', 'nepali', 'roman_nepali'],
        default: 'english'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId
    },
    createdByRole: {
        type: String,
        default: ''
    },
    statusUpdatedAt: {
        type: Date
    },
    verifiedAt: {
        type: Date
    },
    adminNotes: {
        type: String,
        default: ''
    }
}, { timestamps: true })

leadFinderLeadSchema.index({ normalizedCompany: 1, normalizedCity: 1 })
leadFinderLeadSchema.index({ city: 1, sector: 1, createdAt: -1 })
leadFinderLeadSchema.index({ duplicateWarning: 1, createdAt: -1 })

export default mongoose.model('LeadFinderLead', leadFinderLeadSchema)
