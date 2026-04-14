import ContactRequest from '../models/Contactrequest.model.js'
import User from '../models/user.model.js'
import Employer from '../models/Employer.model.js'
import transporter from '../config/mailer.js'
// ── EMPLOYER — Request contact ───────────────────────────
export const requestContact = async (req, res) => {
    try {
        const { jobseeker_id, message } = req.body
        const employer_id = req.user._id

        // Already requested?
        const existing = await ContactRequest.findOne({
            employer: employer_id,
            jobseeker: jobseeker_id
        })

        if (existing) {
            return res.status(400).json({
                message: existing.status === 'approved'
                    ? 'Contact already approved!'
                    : 'Request already sent — pending admin approval'
            })
        }

        const jobseeker = await User.findById(jobseeker_id).select('name')
        const employer = await Employer.findById(employer_id).select('company_name email')

        if (!jobseeker) return res.status(404).json({ message: 'Jobseeker not found' })

        // Create request
        const request = await ContactRequest.create({
            employer: employer_id,
            jobseeker: jobseeker_id,
            employer_message: message || ''
        })

        // Email to admin
        try {
            await transporter.sendMail({
                from: `"Jobmate" <${process.env.MAIL_USER}>`,
                to: process.env.ADMIN_EMAIL || process.env.MAIL_USER,
                subject: `📋 Contact Request — ${employer.company_name} wants ${jobseeker.name}'s contact`,
                html: `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <tr><td style="background:#16a34a;padding:28px 40px;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:24px;font-weight:700;">Jobmate Admin</h1>
        </td></tr>
        <tr><td style="padding:36px 40px;">
          <h2 style="color:#111827;margin:0 0 16px;">New Contact Request</h2>
          <table width="100%" style="border-collapse:collapse;">
            <tr><td style="padding:10px 0;border-bottom:1px solid #f3f4f6;">
              <span style="font-size:13px;color:#6b7280;">Employer</span>
              <strong style="display:block;color:#111827;font-size:15px;">${employer.company_name}</strong>
            </td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid #f3f4f6;">
              <span style="font-size:13px;color:#6b7280;">Wants contact of</span>
              <strong style="display:block;color:#111827;font-size:15px;">${jobseeker.name}</strong>
            </td></tr>
            ${message ? `<tr><td style="padding:10px 0;">
              <span style="font-size:13px;color:#6b7280;">Message</span>
              <p style="color:#374151;font-size:14px;margin:4px 0 0;">${message}</p>
            </td></tr>` : ''}
          </table>
          <div style="margin-top:24px;text-align:center;">
            <a href="${process.env.FRONTEND_URL}/admin" 
              style="display:inline-block;background:#16a34a;color:#fff;text-decoration:none;padding:14px 36px;border-radius:8px;font-size:15px;font-weight:600;">
              Review in Admin Panel →
            </a>
          </div>
        </td></tr>
        <tr><td style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:20px 40px;text-align:center;">
          <p style="margin:0;font-size:12px;color:#9ca3af;">© ${new Date().getFullYear()} Jobmate Nepal</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
            })
        } catch (emailErr) {
            console.log('Admin email error:', emailErr.message)
        }

        res.status(201).json({
            message: 'Contact request sent! Admin will review within 24 hours.',
            request
        })
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Request already sent!' })
        }
        res.status(500).json({ message: error.message })
    }
}

// ── EMPLOYER — Check request status ─────────────────────
export const getContactStatus = async (req, res) => {
    try {
        const request = await ContactRequest.findOne({
            employer: req.user._id,
            jobseeker: req.params.jobseeker_id
        })

        if (!request) return res.status(200).json({ status: 'none' })

        // If approved — return contact details
        if (request.status === 'approved') {
            const jobseeker = await User.findById(req.params.jobseeker_id)
                .select('phone email name')
            return res.status(200).json({
                status: 'approved',
                contact: {
                    phone: jobseeker.phone,
                    email: jobseeker.email,
                    name: jobseeker.name
                }
            })
        }

        res.status(200).json({ status: request.status })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// ── ADMIN — Get all contact requests ────────────────────
export const getContactRequests = async (req, res) => {
    try {
        const requests = await ContactRequest.find()
            .populate('employer', 'company_name email logo_url')
            .populate('jobseeker', 'name email phone location is_verified_jobseeker')
            .sort({ createdAt: -1 })
        res.status(200).json({ requests })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// ── ADMIN — Approve or reject request ───────────────────
export const reviewContactRequest = async (req, res) => {
    try {
        const { action, admin_note } = req.body
        // action: 'approve' or 'reject'

        const request = await ContactRequest.findById(req.params.id)
            .populate('employer', 'company_name email')
            .populate('jobseeker', 'name phone email')

        if (!request) return res.status(404).json({ message: 'Request not found' })

        if (action === 'approve') {
            request.status = 'approved'
            request.approved_at = new Date()
            request.admin_note = admin_note || ''

            // Email to employer with contact details
            try {
                await transporter.sendMail({
                    from: `"Jobmate" <${process.env.MAIL_USER}>`,
                    to: request.employer.email,
                    subject: `✅ Contact Approved — ${request.jobseeker.name}`,
                    html: `
<div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;">
  <div style="background:#16a34a;padding:24px;text-align:center;border-radius:12px 12px 0 0;">
    <h1 style="color:#fff;margin:0;">Jobmate</h1>
  </div>
  <div style="background:#f9fafb;padding:30px;border-radius:0 0 12px 12px;">
    <h2 style="color:#111827;">Contact Request Approved! ✅</h2>
    <p style="color:#6b7280;">Hi ${request.employer.company_name}, your contact request has been approved.</p>
    <div style="background:#fff;border:1px solid #e5e7eb;border-radius:8px;padding:16px;margin:16px 0;">
      <p style="margin:0 0 8px;"><strong>Name:</strong> ${request.jobseeker.name}</p>
      <p style="margin:0 0 8px;"><strong>Phone:</strong> ${request.jobseeker.phone || 'Not provided'}</p>
      <p style="margin:0;"><strong>Email:</strong> ${request.jobseeker.email}</p>
    </div>
    <p style="color:#6b7280;font-size:13px;">Please use this contact information responsibly.</p>
  </div>
</div>`
                })
            } catch (emailErr) {
                console.log('Employer email error:', emailErr.message)
            }
        } else {
            request.status = 'rejected'
            request.admin_note = admin_note || ''
        }

        await request.save()
        res.status(200).json({ message: `Request ${action}d successfully`, request })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}