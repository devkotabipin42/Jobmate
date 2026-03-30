import mongoose from 'mongoose'

const reportSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reason: {
        type: String,
        required: true,
        enum: ['fake_job', 'misleading', 'spam', 'inappropriate', 'other']
    },
    description: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'resolved', 'dismissed']
    }
}, { timestamps: true })

export default mongoose.model('Report', reportSchema)