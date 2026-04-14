import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const employerSchema = new mongoose.Schema({
    company_name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    phone: { type: String },
    website: { type: String },
    logo_url: { type: String },
    description: { type: String },
    industry: {
        type: String,
        enum: ['IT/Tech', 'Finance/Banking', 'Healthcare', 'Education', 'NGO/INGO', 'Manufacturing', 'Hospitality', 'Other'],
    },
    company_size: {
        type: String,
        enum: ['1-10', '11-50', '51-200', '200+'],
    },
    founded_year: { type: String },
    social_links: {
        linkedin: { type: String },
        facebook: { type: String },
    },
    location: { type: String },
    is_verified: { type: Boolean, default: false },
    is_premium: { type: Boolean, default: false },

    // ── PLAN FIELDS ──────────────────────────────
    plan: {
        type: String,
        enum: ['free', 'basic', 'standard', 'premium'],
        default: 'free'
    },
    reset_password_token: { type: String },
    reset_password_expires: { type: Date },
    plan_activated_at: { type: Date },
    plan_expires_at: { type: Date },
    plan_duration_days: { type: Number, default: 30 },
    plan_activated_by: { type: String, default: 'admin' }, // manual now, can be extended to support other activators in future

    role: { type: String, default: 'employer' },
    is_email_verified: { type: Boolean, default: false },
    email_verify_token: { type: String },
    email_verify_expires: { type: Date },
}, { timestamps: true })

employerSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password)
}

// Helper — plan active check
employerSchema.methods.isPlanActive = function() {
    if (!this.is_premium) return false
    if (!this.plan_expires_at) return true
    return new Date() < new Date(this.plan_expires_at)
}

export default mongoose.model('Employer', employerSchema)