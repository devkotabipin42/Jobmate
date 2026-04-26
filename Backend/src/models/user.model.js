import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 ,select: false },
    phone: { type: String },
    location: { type: String },
    cv_url: { type: String },
    avatar_url: { type: String, default: '' },
    cv_text: { type: String, default: '' },

    // ── PROFILE FIELDS ──────────────────────────────────
    bio: { type: String, default: '' },
    skills: [{ type: String }],
    preferred_location: { type: String, default: '' },
    preferred_category: { type: String, default: '' },
    expected_salary: { type: Number, default: 0 },

    education: [{
        institution: { type: String },
        degree: { type: String },
        field: { type: String },
        start_year: { type: String },
        end_year: { type: String },
        is_current: { type: Boolean, default: false }
    }],

    experience: [{
        company: { type: String },
        position: { type: String },
        location: { type: String },
        start_year: { type: String },
        end_year: { type: String },
        is_current: { type: Boolean, default: false },
        description: { type: String }
    }],

    // ── DOCUMENT VERIFICATION ───────────────────────────
    citizenship_number: { type: String, unique: true, sparse: true },
    citizenship_url: { type: String, default: '' },
    citizenship_submitted_at: { type: Date },

    license_number: { type: String, unique: true, sparse: true },
    license_url: { type: String, default: '' },
    license_submitted_at: { type: Date },

    document_status: {
        type: String,
        enum: ['none', 'pending', 'verified', 'rejected'],
        default: 'none'
    },
    document_type: {
        type: String,
        enum: ['citizenship', 'license', 'none'],
        default: 'none'
    },
    document_verified_at: { type: Date },
    document_reject_reason: { type: String },

    // ── BADGES ──────────────────────────────────────────
    profile_complete: { type: Boolean, default: false },
    is_verified_jobseeker: { type: Boolean, default: false },

    // ── RESET PASSWORD ──────────────────────────────────
    reset_password_token: { type: String },
    reset_password_expires: { type: Date },

    saved_jobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
    role: { type: String, default: 'jobseeker' },
    is_banned: { type: Boolean, default: false },

    job_alerts: {
        enabled: { type: Boolean, default: false },
        categories: [{ type: String }],
        locations: [{ type: String }],
        job_types: [{ type: String }],
    },

    is_email_verified: { type: Boolean, default: false },
    email_verify_token: { type: String },
    email_verify_expires: { type: Date },

}, { timestamps: true })

// Performance indexes
userSchema.index({ document_status: 1 })
userSchema.index({ is_verified_jobseeker: 1 })
userSchema.index({ location: 1 })
userSchema.index({ skills: 1 })
userSchema.methods.checkProfileComplete = function () {
    const hasBasic = !!(this.name && this.phone && this.location && this.bio?.length > 10)
    const hasSkills = this.skills?.length > 0
    const hasEducation = this.education?.length > 0
    const hasExperience = this.experience?.length > 0
    const hasDocument = this.document_status === 'verified'
    return hasBasic && hasSkills && hasEducation && hasExperience && hasDocument
}

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

const User = mongoose.model('User', userSchema)
export default User