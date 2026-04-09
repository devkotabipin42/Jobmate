import Job from '../models/Job.model.js'
import User from '../models/user.model.js'
import Employer from '../models/Employer.model.js'
import Application from '../models/Application.model.js'
import transporter from '../config/mailer.js'





// Verify employer
export const verifyEmployer = async (req, res) => {
    try {
        const employer = await Employer.findByIdAndUpdate(
            req.params.id,
            { is_verified: true },
            { new: true }
        )

        if (!employer) {
            return res.status(404).json({ message: 'Employer not found' })
        }

        // Send verification email
        try {
            await transporter.sendMail({
                from: process.env.MAIL_USER,
                to: employer.email,
                subject: '🎉 Your company is now verified on Jobmate!',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <div style="background: #16a34a; padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
                            <h1 style="color: white; margin: 0;">Jobmate</h1>
                        </div>
                        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px;">
                            <h2 style="color: #111827;">🎉 Congratulations!</h2>
                            <p style="color: #6b7280;">Your company <strong>${employer.company_name}</strong> has been verified on Jobmate.</p>
                            <p style="color: #6b7280;">You can now post verified jobs and attract more candidates.</p>
                            <div style="background: #dcfce7; border: 1px solid #86efac; padding: 15px; border-radius: 8px; margin: 20px 0;">
                                <p style="color: #166534; margin: 0;">✓ Verified badge added to your profile</p>
                                <p style="color: #166534; margin: 5px 0 0;">✓ Your jobs will show "Verified Company" badge</p>
                            </div>
                            <a href="https://jobmate-two.vercel.app/employer/dashboard" 
                               style="background: #16a34a; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block; margin-top: 10px;">
                                Go to Dashboard
                            </a>
                        </div>
                    </div>
                `
            })
        } catch (emailErr) {
        }

        res.status(200).json({
            message: 'Employer verified successfully',
            employer
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
// Dashboard stats

export const getStats = async (req, res) => {
    try {
        const [
            totalJobs,
            pendingJobs,
            verifiedJobs,
            totalUsers,
            totalEmployers,
            totalApplications
        ] = await Promise.all([
            Job.countDocuments(),
            Job.countDocuments({ is_verified: false }),
            Job.countDocuments({ is_verified: true }),
            User.countDocuments(),
            Employer.countDocuments(),
            Application.countDocuments()
        ])

        res.status(200).json({
            stats: {
                totalJobs,
                pendingJobs,
                verifiedJobs,
                totalUsers,
                totalEmployers,
                totalApplications
            }
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Get all jobs — pending verification
export const getPendingJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ is_verified: false })
            .populate('employer', 'company_name email location is_verified')
            .sort({ createdAt: -1 })

        res.status(200).json({
            message: 'Pending jobs fetched',
            count: jobs.length,
            jobs
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Get all jobs
export const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find()
            .populate('employer', 'company_name email location is_verified')
            .sort({ createdAt: -1 })

        res.status(200).json({
            message: 'All jobs fetched',
            count: jobs.length,
            jobs
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Verify job
export const verifyJob = async (req, res) => {
    try {
        const job = await Job.findByIdAndUpdate(
            req.params.id,
            { is_verified: true },
            { new: true }
        )

        if (!job) {
            return res.status(404).json({ message: 'Job not found' })
        }

        res.status(200).json({
            message: 'Job verified successfully',
            job
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Reject job
export const rejectJob = async (req, res) => {
    try {
        const job = await Job.findByIdAndUpdate(
            req.params.id,
            { is_active: false, is_verified: false },
            { new: true }
        )

        if (!job) {
            return res.status(404).json({ message: 'Job not found' })
        }

        res.status(200).json({
            message: 'Job rejected',
            job
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Delete job
export const deleteJobAdmin = async (req, res) => {
    try {
        await Job.findByIdAndDelete(req.params.id)
        res.status(200).json({ message: 'Job deleted' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Get all employers
export const getAllEmployers = async (req, res) => {
    try {
        const employers = await Employer.find()
            .select('-password')
            .sort({ createdAt: -1 })

        res.status(200).json({
            message: 'Employers fetched',
            count: employers.length,
            employers
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true }
        ).select('-password')

        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        res.status(200).json({ message: 'User role updated', user })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const banUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { is_banned: true },
            { new: true }
        ).select('-password')

        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        res.status(200).json({ message: 'User banned', user })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const unbanUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { is_banned: false },
            { new: true }
        ).select('-password')

        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        res.status(200).json({ message: 'User unbanned', user })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


// Get all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select('-password')
            .sort({ createdAt: -1 })

        res.status(200).json({
            message: 'Users fetched',
            count: users.length,
            users
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
export const getAnalytics = async (req, res) => {
    try {
        // Jobs by category
        const jobsByCategory = await Job.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ])

        // Jobs by location
        const jobsByLocation = await Job.aggregate([
            { $group: { _id: '$location', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 6 }
        ])

        // Jobs by type
        const jobsByType = await Job.aggregate([
            { $group: { _id: '$type', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ])

        // Applications by status
        const applicationsByStatus = await Application.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ])

        // Users registered by month
        const usersByMonth = await User.aggregate([
            {
                $group: {
                    _id: {
                        month: { $month: '$createdAt' },
                        year: { $year: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } },
            { $limit: 6 }
        ])

        // Top employers by job count
        const topEmployers = await Job.aggregate([
            { $group: { _id: '$employer', jobCount: { $sum: 1 }, totalApplications: { $sum: '$application_count' } } },
            { $sort: { jobCount: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: 'employers',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'employer'
                }
            },
            { $unwind: '$employer' }
        ])

        res.status(200).json({
            analytics: {
                jobsByCategory,
                jobsByLocation,
                jobsByType,
                applicationsByStatus,
                usersByMonth,
                topEmployers
            }
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
export const toggleFeaturedJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
        if (!job) return res.status(404).json({ message: 'Job not found' })
        
        job.is_featured = !job.is_featured
        await job.save()
        
        res.status(200).json({
            message: `Job ${job.is_featured ? 'featured' : 'unfeatured'} successfully`,
            job
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}



export const broadcastEmail = async (req, res) => {
    try {
        const { subject, message, target } = req.body

        let emails = []

        if (target === 'all' || target === 'jobseekers') {
            const users = await User.find({ is_banned: false }).select('email name')
            emails = [...emails, ...users.map(u => ({ email: u.email, name: u.name }))]
        }

        if (target === 'all' || target === 'employers') {
            const employers = await Employer.find().select('email company_name')
            emails = [...emails, ...employers.map(e => ({ email: e.email, name: e.company_name }))]
        }

        // Send in batches of 10
        const batchSize = 10
        let sent = 0

        for (let i = 0; i < emails.length; i += batchSize) {
            const batch = emails.slice(i, i + batchSize)
            await Promise.allSettled(
                batch.map(({ email, name }) =>
                    transporter.sendMail({
                        from: process.env.MAIL_USER,
                        to: email,
                        subject: subject,
                        html: `
                            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                                <div style="background: #16a34a; padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
                                    <h1 style="color: white; margin: 0;">Jobmate</h1>
                                </div>
                                <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px;">
                                    <p style="color: #374151; font-size: 15px; line-height: 1.7;">
                                        Hi ${name},
                                    </p>
                                    <div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; margin: 20px 0;">
                                        <p style="color: #374151; font-size: 14px; line-height: 1.8; margin: 0;">
                                            ${message.replace(/\n/g, '<br>')}
                                        </p>
                                    </div>
                                    <p style="color: #9ca3af; font-size: 12px; margin-top: 20px;">
                                        This email was sent by Jobmate Admin Team.<br>
                                        hello@jobmate.com.np
                                    </p>
                                </div>
                            </div>
                        `
                    })
                )
            )
            sent += batch.length
        }

        res.status(200).json({
            message: `Email sent to ${sent} recipients`,
            sent
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}



export const toggleEmployerPremium = async (req, res) => {
    try {
         console.log('BODY:', req.body)
        const { plan, duration_days } = req.body
        // duration_days default 30 din
        const days = duration_days || 30

        const employer = await Employer.findById(req.params.id)
        console.log('EMPLOYER:', employer?.company_name, employer?.is_premium)
        if (!employer) return res.status(404).json({ message: 'Employer not found' })

        const isActivating = !employer.is_premium

        if (isActivating) {
            // Plan activate start
            const now = new Date()
            const expires = new Date(now.getTime() + days * 24 * 60 * 60 * 1000)

            employer.is_premium = true
            employer.plan = plan || 'basic'
            employer.plan_activated_at = now
            employer.plan_expires_at = expires
            employer.plan_duration_days = days
            employer.plan_activated_by = 'admin'
            await employer.save()
            console.log('SAVED!')

            // Welcome email send

// ── EMPLOYER WELCOME EMAIL ────────────────────────────────
try {
    await transporter.sendMail({
        from: `"Jobmate" <${process.env.MAIL_USER}>`,
        to: employer.email,
        subject: `Your ${(plan || 'Basic').charAt(0).toUpperCase() + (plan || 'Basic').slice(1)} Plan is Now Active — Jobmate`,
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Premium Activated</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          
          <!-- Header -->
          <tr>
            <td style="background:#16a34a;padding:32px 40px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:28px;font-weight:700;letter-spacing:-0.5px;">Jobmate</h1>
              <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:14px;">Nepal's Verified Job Platform</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              
              <!-- Greeting -->
              <p style="font-size:16px;color:#111827;margin:0 0 8px;">Dear <strong>${employer.company_name}</strong>,</p>
              <p style="font-size:15px;color:#6b7280;margin:0 0 28px;line-height:1.6;">
                Congratulations! Your <strong style="color:#16a34a;">${(plan || 'basic').charAt(0).toUpperCase() + (plan || 'basic').slice(1)} Plan</strong> has been successfully activated. You now have access to premium hiring features on Jobmate.
              </p>

              <!-- Plan Details Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;margin-bottom:28px;">
                <tr>
                  <td style="padding:24px;">
                    <p style="margin:0 0 16px;font-size:14px;font-weight:700;color:#15803d;text-transform:uppercase;letter-spacing:0.5px;">Plan Details</p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:6px 0;font-size:14px;color:#6b7280;">Plan</td>
                        <td style="padding:6px 0;font-size:14px;font-weight:600;color:#111827;text-align:right;text-transform:capitalize;">${plan || 'Basic'}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;font-size:14px;color:#6b7280;border-top:1px solid #dcfce7;">Activated On</td>
                        <td style="padding:6px 0;font-size:14px;font-weight:600;color:#111827;text-align:right;border-top:1px solid #dcfce7;">${now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;font-size:14px;color:#6b7280;border-top:1px solid #dcfce7;">Valid Until</td>
                        <td style="padding:6px 0;font-size:14px;font-weight:600;color:#16a34a;text-align:right;border-top:1px solid #dcfce7;">${expires.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;font-size:14px;color:#6b7280;border-top:1px solid #dcfce7;">Duration</td>
                        <td style="padding:6px 0;font-size:14px;font-weight:600;color:#111827;text-align:right;border-top:1px solid #dcfce7;">${days} days</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Features -->
              <p style="font-size:14px;font-weight:700;color:#111827;margin:0 0 14px;text-transform:uppercase;letter-spacing:0.5px;">What's Included</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                ${plan === 'basic' ? `
                <tr><td style="padding:8px 0;border-bottom:1px solid #f3f4f6;font-size:14px;color:#374151;">✅ &nbsp; Post up to <strong>5 jobs</strong> per month</td></tr>
                <tr><td style="padding:8px 0;border-bottom:1px solid #f3f4f6;font-size:14px;color:#374151;">✅ &nbsp; Unlock up to <strong>20 candidate contacts</strong></td></tr>
                <tr><td style="padding:8px 0;border-bottom:1px solid #f3f4f6;font-size:14px;color:#374151;">✅ &nbsp; View candidate <strong>phone & email</strong></td></tr>
                <tr><td style="padding:8px 0;font-size:14px;color:#374151;">✅ &nbsp; <strong>1 featured job</strong> listing</td></tr>
                ` : plan === 'standard' ? `
                <tr><td style="padding:8px 0;border-bottom:1px solid #f3f4f6;font-size:14px;color:#374151;">✅ &nbsp; Post up to <strong>15 jobs</strong> per month</td></tr>
                <tr><td style="padding:8px 0;border-bottom:1px solid #f3f4f6;font-size:14px;color:#374151;">✅ &nbsp; Unlock up to <strong>50 candidate contacts</strong></td></tr>
                <tr><td style="padding:8px 0;border-bottom:1px solid #f3f4f6;font-size:14px;color:#374151;">✅ &nbsp; View candidate <strong>phone & email</strong></td></tr>
                <tr><td style="padding:8px 0;border-bottom:1px solid #f3f4f6;font-size:14px;color:#374151;">✅ &nbsp; <strong>3 featured job</strong> listings</td></tr>
                <tr><td style="padding:8px 0;font-size:14px;color:#374151;">✅ &nbsp; <strong>Featured company</strong> listing on Companies page</td></tr>
                ` : `
                <tr><td style="padding:8px 0;border-bottom:1px solid #f3f4f6;font-size:14px;color:#374151;">✅ &nbsp; <strong>Unlimited</strong> job postings</td></tr>
                <tr><td style="padding:8px 0;border-bottom:1px solid #f3f4f6;font-size:14px;color:#374151;">✅ &nbsp; <strong>Unlimited</strong> candidate contacts</td></tr>
                <tr><td style="padding:8px 0;border-bottom:1px solid #f3f4f6;font-size:14px;color:#374151;">✅ &nbsp; View candidate <strong>phone & email</strong></td></tr>
                <tr><td style="padding:8px 0;border-bottom:1px solid #f3f4f6;font-size:14px;color:#374151;">✅ &nbsp; <strong>Unlimited featured</strong> job listings</td></tr>
                <tr><td style="padding:8px 0;font-size:14px;color:#374151;">✅ &nbsp; <strong>Top featured company</strong> on homepage</td></tr>
                `}
              </table>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td align="center">
                    <a href="${process.env.FRONTEND_URL}/employer/dashboard"
                      style="display:inline-block;background:#16a34a;color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:8px;font-size:15px;font-weight:600;letter-spacing:0.3px;">
                      Go to Dashboard →
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Support -->
              <p style="font-size:14px;color:#6b7280;line-height:1.6;margin:0;">
                Need help getting started? Our team is happy to assist.<br/>
                📧 <a href="mailto:hello@jobmate.com.np" style="color:#16a34a;text-decoration:none;">hello@jobmate.com.np</a>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:24px 40px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#9ca3af;">
                © ${new Date().getFullYear()} Jobmate. Nepal's Verified Job Platform.<br/>
                <a href="${process.env.FRONTEND_URL}" style="color:#16a34a;text-decoration:none;">jobmate.com.np</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
        `
    })
} catch (emailErr) {
    console.log('Email error:', emailErr.message)
}

// ── ADMIN INTERNAL NOTIFICATION ──────────────────────────
try {
    await transporter.sendMail({
        from: `"Jobmate System" <${process.env.MAIL_USER}>`,
        to: process.env.MAIL_USER,
        subject: `[Jobmate] Premium Activated — ${employer.company_name} (${(plan || 'basic').toUpperCase()})`,
        html: `
<table style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
  <tr><td style="background:#16a34a;padding:16px 24px;"><h2 style="color:#fff;margin:0;font-size:16px;">✅ Premium Plan Activated</h2></td></tr>
  <tr>
    <td style="padding:24px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr><td style="padding:6px 0;font-size:13px;color:#6b7280;">Company</td><td style="padding:6px 0;font-size:13px;font-weight:600;color:#111827;text-align:right;">${employer.company_name}</td></tr>
        <tr><td style="padding:6px 0;font-size:13px;color:#6b7280;border-top:1px solid #f3f4f6;">Email</td><td style="padding:6px 0;font-size:13px;color:#111827;text-align:right;border-top:1px solid #f3f4f6;">${employer.email}</td></tr>
        <tr><td style="padding:6px 0;font-size:13px;color:#6b7280;border-top:1px solid #f3f4f6;">Plan</td><td style="padding:6px 0;font-size:13px;font-weight:600;color:#16a34a;text-align:right;border-top:1px solid #f3f4f6;text-transform:capitalize;">${plan || 'basic'}</td></tr>
        <tr><td style="padding:6px 0;font-size:13px;color:#6b7280;border-top:1px solid #f3f4f6;">Duration</td><td style="padding:6px 0;font-size:13px;color:#111827;text-align:right;border-top:1px solid #f3f4f6;">${days} days</td></tr>
        <tr><td style="padding:6px 0;font-size:13px;color:#6b7280;border-top:1px solid #f3f4f6;">Activated</td><td style="padding:6px 0;font-size:13px;color:#111827;text-align:right;border-top:1px solid #f3f4f6;">${now.toLocaleDateString()}</td></tr>
        <tr><td style="padding:6px 0;font-size:13px;color:#6b7280;border-top:1px solid #f3f4f6;">Expires</td><td style="padding:6px 0;font-size:13px;font-weight:600;color:#dc2626;text-align:right;border-top:1px solid #f3f4f6;">${expires.toLocaleDateString()}</td></tr>
      </table>
      <p style="margin:20px 0 0;font-size:13px;color:#6b7280;background:#fef9c3;border:1px solid #fde047;border-radius:6px;padding:12px;">
        ⚠️ <strong>Follow-up reminder:</strong> Contact ${employer.company_name} before ${expires.toLocaleDateString()} for plan renewal.
      </p>
    </td>
  </tr>
</table>
        `
    })
} catch (e) {}

        } else {
            // Plan deactivate 
            employer.is_premium = false
            employer.plan = 'free'
            employer.plan_expires_at = null
            employer.plan_activated_at = null
            await employer.save()

            // Deactivation email
           // Replace karo admin.controller.js mein deactivation email section

try {
    await transporter.sendMail({
        from: `"Jobmate" <${process.env.MAIL_USER}>`,
        to: employer.email,
        subject: `Your Jobmate Premium Plan Has Ended — ${employer.company_name}`,
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          
          <!-- Header -->
          <tr>
            <td style="background:#111827;padding:32px 40px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:28px;font-weight:700;letter-spacing:-0.5px;">Jobmate</h1>
              <p style="color:rgba(255,255,255,0.5);margin:8px 0 0;font-size:14px;">Nepal's Verified Job Platform</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">

              <p style="font-size:16px;color:#111827;margin:0 0 8px;">Dear <strong>${employer.company_name}</strong>,</p>
              <p style="font-size:15px;color:#6b7280;margin:0 0 28px;line-height:1.6;">
                Your Jobmate Premium plan has been deactivated. Your account has been moved to the <strong>Free</strong> tier. You can continue to use basic features at no cost.
              </p>

              <!-- What Changed Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#fef2f2;border:1px solid #fecaca;border-radius:10px;margin-bottom:28px;">
                <tr>
                  <td style="padding:24px;">
                    <p style="margin:0 0 14px;font-size:14px;font-weight:700;color:#dc2626;text-transform:uppercase;letter-spacing:0.5px;">Features No Longer Available</p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr><td style="padding:7px 0;border-bottom:1px solid #fee2e2;font-size:14px;color:#374151;">❌ &nbsp; Candidate phone &amp; email access</td></tr>
                      <tr><td style="padding:7px 0;border-bottom:1px solid #fee2e2;font-size:14px;color:#374151;">❌ &nbsp; Featured job listings</td></tr>
                      <tr><td style="padding:7px 0;border-bottom:1px solid #fee2e2;font-size:14px;color:#374151;">❌ &nbsp; Extended job posting limit</td></tr>
                      <tr><td style="padding:7px 0;font-size:14px;color:#374151;">❌ &nbsp; Priority candidate matching</td></tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Upgrade Section -->
              <p style="font-size:15px;color:#111827;font-weight:600;margin:0 0 16px;">Upgrade to continue hiring top talent</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td style="padding:12px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;margin-bottom:8px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="font-size:14px;font-weight:600;color:#15803d;">💚 Basic</td>
                        <td style="font-size:14px;font-weight:700;color:#15803d;text-align:right;">Rs. 2,000 / month</td>
                      </tr>
                      <tr><td colspan="2" style="font-size:12px;color:#6b7280;padding-top:4px;">5 jobs · 20 contacts · 1 featured listing</td></tr>
                    </table>
                  </td>
                </tr>
                <tr><td style="height:8px;"></td></tr>
                <tr>
                  <td style="padding:12px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;margin-bottom:8px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="font-size:14px;font-weight:600;color:#1d4ed8;">⭐ Standard</td>
                        <td style="font-size:14px;font-weight:700;color:#1d4ed8;text-align:right;">Rs. 5,000 / month</td>
                      </tr>
                      <tr><td colspan="2" style="font-size:12px;color:#6b7280;padding-top:4px;">15 jobs · 50 contacts · 3 featured listings</td></tr>
                    </table>
                  </td>
                </tr>
                <tr><td style="height:8px;"></td></tr>
                <tr>
                  <td style="padding:12px;background:#fffbeb;border:1px solid #fde68a;border-radius:8px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="font-size:14px;font-weight:600;color:#92400e;">👑 Premium</td>
                        <td style="font-size:14px;font-weight:700;color:#92400e;text-align:right;">Rs. 10,000 / month</td>
                      </tr>
                      <tr><td colspan="2" style="font-size:12px;color:#6b7280;padding-top:4px;">Unlimited jobs · Unlimited contacts · Top featured</td></tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td align="center">
                    <a href="mailto:hello@jobmate.com.np?subject=Upgrade Request — ${employer.company_name}"
                      style="display:inline-block;background:#16a34a;color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:8px;font-size:15px;font-weight:600;">
                      Contact Us to Upgrade →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="font-size:14px;color:#6b7280;line-height:1.6;margin:0;">
                Questions? We're here to help.<br/>
                📧 <a href="mailto:hello@jobmate.com.np" style="color:#16a34a;text-decoration:none;">hello@jobmate.com.np</a>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:24px 40px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#9ca3af;">
                © ${new Date().getFullYear()} Jobmate. Nepal's Verified Job Platform.<br/>
                <a href="${process.env.FRONTEND_URL}" style="color:#16a34a;text-decoration:none;">jobmate.com.np</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
        `
    })
} catch (e) {
    console.log('Deactivation email error:', e.message)
}
        }

        res.json({ 
            message: isActivating ? `${plan || 'basic'} plan activated for ${days} days!` : 'Plan deactivated',
            employer 
        })

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}