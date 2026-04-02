import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
    name: {
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
    location: {
        type: String,
    },
    cv_url: {
        type: String,
    },
    cv_text: {
    type: String,
    default: ''
},
    saved_jobs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        enum: ['jobseeker', 'admin']
    }],
    role: {
        type: String,
        default: 'jobseeker'
    },
    is_banned: {
    type: Boolean,
    default: false
},
job_alerts: {
    enabled: {
        type: Boolean,
        default: false
    },
    categories: [{
        type: String
    }],
    locations: [{
        type: String
    }],
    job_types: [{
        type: String
    }],
   
},
is_email_verified: { type: Boolean, default: false },
email_verify_token: { type: String },
email_verify_expires: { type: Date },
}, { timestamps: true })

userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password)
}


const User = mongoose.model('User', userSchema)

export default User