import mongoose from 'mongoose'

const salaryRecordSchema = new mongoose.Schema({
    agent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TeamMember',
        required: true
    },

    month: { type: Number, required: true, min: 1, max: 12 },
    year: { type: Number, required: true },

    base_amount: { type: Number, default: 0 },

    visits_count: { type: Number, default: 0 },
    visit_incentive_total: { type: Number, default: 0 },

    conversions_count: { type: Number, default: 0 },
    conversion_bonus_total: { type: Number, default: 0 },

    retention_bonus_total: { type: Number, default: 0 },

    expenses: [{
        description: { type: String },
        amount: { type: Number },
        receipt_url: { type: String },
        date: { type: Date }
    }],
    expense_total: { type: Number, default: 0 },

    deductions: [{
        reason: { type: String },
        amount: { type: Number }
    }],
    deductions_total: { type: Number, default: 0 },

    gross_total: { type: Number, default: 0 },
    net_payable: { type: Number, default: 0 },

    payment_status: {
        type: String,
        enum: ['pending', 'paid', 'partial'],
        default: 'pending'
    },
    paid_at: { type: Date },
    payment_reference: { type: String, default: '' },
    payslip_url: { type: String, default: '' }
}, { timestamps: true })

salaryRecordSchema.index({ agent: 1, year: -1, month: -1 }, { unique: true })
salaryRecordSchema.index({ payment_status: 1 })

export default mongoose.model('SalaryRecord', salaryRecordSchema)