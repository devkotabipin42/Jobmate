import mongoose from 'mongoose'

const FeaturedCompanySchema = new mongoose.Schema({
    name: { type: String, required: true },
    logo_url: { type: String, default: '' },
    location: { type: String, default: 'Nepal' },
    industry: { type: String, default: '' },
    website: { type: String, default: '' },
    description: { type: String, default: '' },
    is_active: { type: Boolean, default: true },
}, { timestamps: true })

export default mongoose.model('FeaturedCompany', FeaturedCompanySchema)