import mongoose from 'mongoose'

const applicationSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    cv_url: {
        type: String,
        default: ''  // required hatao
    },
    cover_letter: {
        type: String
    },
    status: {
        type: String,
        enum: ['applied', 'seen', 'shortlisted', 'interview', 'hired', 'rejected'],
        default: 'applied'  // '' se 'applied' karo
    }
}, { timestamps: true })
applicationSchema.index({ job: 1, user: 1 })
export default mongoose.model('Application', applicationSchema)