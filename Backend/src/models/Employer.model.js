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
    phone: {
        type: String,
    },
    website: {
        type: String,
    },
    logo_url: {
        type: String,
    },
    description: {
        type: String,
    },
    location: {
        type: String,
    },
    is_verified: {
        type: Boolean,
        default: false
    },
    is_premium: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        default: 'employer'
    },
    is_email_verified: { type: Boolean, default: false },
email_verify_token: { type: String },
email_verify_expires: { type: Date },
}, { timestamps: true })

employerSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password)
}

export default mongoose.model('Employer', employerSchema)