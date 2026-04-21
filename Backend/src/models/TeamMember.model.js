import mongoose from 'mongoose'

const teamMemberSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    full_name: { type: String, required: true, trim: true },
    phone: { type: String, required: true },
    whatsapp: { type: String },
    profile_photo: { type: String, default: '' },

    ops_role: {
        type: String,
        enum: ['founder', 'field_agent', 'data_entry'],
        required: true
    },

    joining_date: { type: Date, default: Date.now },
    assigned_areas: [{ type: String }],
    is_active: { type: Boolean, default: true },

    documents: [{
        type: { type: String, enum: ['citizenship', 'contract', 'bank', 'other'] },
        url: { type: String },
        uploaded_at: { type: Date, default: Date.now }
    }],

    bank_details: {
        account_holder: String,
        bank_name: String,
        account_number: String,
        branch: String
    },

    salary_config: {
        base_type: { type: String, enum: ['monthly', 'daily'], default: 'monthly' },
        base_amount: { type: Number, default: 0 },
        visit_incentive: { type: Number, default: 50 },
        conversion_bonus: { type: Number, default: 500 },
        retention_bonus: { type: Number, default: 2000 }
    },

    last_login_at: { type: Date },
    last_location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], default: [0, 0] }
    }
}, { timestamps: true })

teamMemberSchema.index({ ops_role: 1, is_active: 1 })
teamMemberSchema.index({ last_location: '2dsphere' })

export default mongoose.model('TeamMember', teamMemberSchema)