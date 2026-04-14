import mongoose from 'mongoose'

const contactRequestSchema = new mongoose.Schema({
    employer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employer',
        required: true
    },
    jobseeker: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    employer_message: { type: String, default: '' },
    admin_note: { type: String, default: '' },
    approved_at: { type: Date },
}, { timestamps: true })

// One employer can request one jobseeker once
contactRequestSchema.index({ employer: 1, jobseeker: 1 }, { unique: true })

const ContactRequest = mongoose.model('ContactRequest', contactRequestSchema)
export default ContactRequest