import mongoose from 'mongoose'

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    salary_min: {
        type: Number,
        required: true
    },
    salary_max: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: [
            'IT/Tech',
            'Finance/Banking',
            'NGO/INGO',
            'Healthcare',
            'Education',
            'Marketing',
            'Engineering',
            'Hospitality',
            'Other'
        ]
    },
    type: {
        type: String,
        required: true,
        enum: ['full-time', 'part-time', 'remote', 'contract', 'internship']
    },
    experience: {
        type: String,
        enum: ['fresh', '1-2 years', '3-5 years', '5+ years'],
        default: 'fresh'
    },
    deadline: {
        type: Date,
        required: true
    },
    is_featured: {
        type: Boolean,
        default: false
    },
    is_verified: {
        type: Boolean,
        default: false
    },
    is_active: {
        type: Boolean,
        default: true
    },
    application_count: {
        type: Number,
        default: 0
    },
    employer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employer',
        required: true
    },
    
}, { timestamps: true })
jobSchema.index({ title: 'text', description: 'text' })
jobSchema.index({ location: 1, category: 1, is_active: 1 })
export default mongoose.model('Job', jobSchema)