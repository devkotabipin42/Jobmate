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
    enum: [
        'IT/Tech',
        'Hotel/Restaurant',
        'Sales/Marketing',
        'Driver',
        'Office/Admin',
        'Education',
        'Healthcare',
        'Finance/Banking',
        'Factory/Manufacturing',
        'Construction',
        'Security Guard',
        'Cleaner/Housekeeping',
        'Delivery/Rider',
        'Shop/Retail',
        'NGO/INGO',
        'Agriculture',
        'Beauty/Salon',
        'Cook/Kitchen Helper',
        'Customer Service',
        'Other'
    ],
    required: true
},
    type: {
    type: String,
    enum: [
        'full-time',
        'part-time',
        'remote',
        'internship',
        'contract',
        'temporary',
        'freelance'
    ],
    required: true
},
   experience: {
    type: String,
    enum: [
        'fresh',
        'below 1 year',
        '1-2 years',
        '3-5 years',
        '5+ years'
    ],
    required: true
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
    cv_required: {
    type: Boolean,
    default: false
},
    
}, { timestamps: true })
jobSchema.index({ title: 'text', description: 'text' })
jobSchema.index({ location: 1, category: 1, is_active: 1 })
jobSchema.index({ deadline: 1, is_active: 1 })
jobSchema.index({ is_featured: -1, createdAt: -1 })
export default mongoose.model('Job', jobSchema)