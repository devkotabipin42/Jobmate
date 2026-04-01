import Ticket from '../models/Ticket.model.js'
import transporter from '../config/mailer.js'

export const createTicket = async (req, res) => {
    try {
        const { subject, message, category, priority } = req.body

        const ticket = await Ticket.create({
            user: req.user?._id,
            name: req.user?.name || req.body.name,
            email: req.user?.email || req.body.email,
            subject,
            message,
            category: category || 'general',
            priority: priority || 'medium'
        })

        // Confirm email to user
        try {
            await transporter.sendMail({
                from: process.env.MAIL_USER,
                to: ticket.email,
                subject: `Ticket #${ticket._id.toString().slice(-6).toUpperCase()} — ${subject}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <div style="background: #16a34a; padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
                            <h1 style="color: white; margin: 0;">Jobmate Support</h1>
                        </div>
                        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px;">
                            <h2 style="color: #111827;">Ticket Received!</h2>
                            <p style="color: #6b7280;">We have received your support ticket. Our team will respond within 24 hours.</p>
                            <div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; margin: 20px 0;">
                                <p style="margin: 0;"><strong>Ticket ID:</strong> #${ticket._id.toString().slice(-6).toUpperCase()}</p>
                                <p style="margin: 8px 0 0;"><strong>Subject:</strong> ${subject}</p>
                                <p style="margin: 8px 0 0;"><strong>Status:</strong> Open</p>
                            </div>
                            <p style="color: #9ca3af; font-size: 12px;">hello@jobmate.com.np</p>
                        </div>
                    </div>
                `
            })
        } catch (emailErr) {
            console.log('Email error:', emailErr.message)
        }

        res.status(201).json({ message: 'Ticket created', ticket })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const getUserTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find({ user: req.user._id })
            .sort({ createdAt: -1 })
        res.status(200).json({ tickets })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const getAllTickets = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin only' })
        }
        const tickets = await Ticket.find()
            .sort({ createdAt: -1 })
        res.status(200).json({ tickets })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const replyTicket = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin only' })
        }

        const ticket = await Ticket.findByIdAndUpdate(
            req.params.id,
            {
                $push: { replies: { message: req.body.message, isAdmin: true } },
                status: 'in_progress'
            },
            { new: true }
        )

        // Email to user
        try {
            await transporter.sendMail({
                from: process.env.MAIL_USER,
                to: ticket.email,
                subject: `Re: Ticket #${ticket._id.toString().slice(-6).toUpperCase()} — ${ticket.subject}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <div style="background: #16a34a; padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
                            <h1 style="color: white; margin: 0;">Jobmate Support</h1>
                        </div>
                        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px;">
                            <h2 style="color: #111827;">Reply from Support Team</h2>
                            <div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; margin: 20px 0;">
                                <p style="color: #374151;">${req.body.message}</p>
                            </div>
                            <p style="color: #9ca3af; font-size: 12px;">Ticket #${ticket._id.toString().slice(-6).toUpperCase()}</p>
                        </div>
                    </div>
                `
            })
        } catch (emailErr) {
            console.log('Email error:', emailErr.message)
        }

        res.status(200).json({ message: 'Reply sent', ticket })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const updateTicketStatus = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin only' })
        }
        const ticket = await Ticket.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        )
        res.status(200).json({ message: 'Status updated', ticket })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}