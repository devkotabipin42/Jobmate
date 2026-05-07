import axios from 'axios'
import FollowUpLog from '../models/FollowUpLog.model.js'

const normalizePhone = (phone = '') => {
    const digits = String(phone).replace(/\D/g, '')

    if (!digits) return ''

    if (digits.startsWith('977')) return digits

    return `977${digits.slice(-10)}`
}

const buildFollowUpMessage = ({
    type,
    recipientName = '',
    jobTitle = '',
    companyName = ''
}) => {
    const name = recipientName || 'Mitra'

    if (type === 'candidate_reengagement') {
        return `Namaste ${name} ji 🙏\n\nYo job ma selection bhayena, tara JobMate le arko milne job khojna help garna sakcha.\n\nTapai ajhai job khojdai hunuhuncha?\n1. Yes, job khojdai chu\n2. Haina, aile pardaina\n3. Location/job type update garna cha`
    }

    if (type === 'candidate_hired_confirmation') {
        return `Namaste ${name} ji 🙏\n\nTapai ${companyName || 'company'} ko ${jobTitle || 'job'} role ma hired update aayo.\n\nTapai kaam join garnu bhayo?\n1. Join gare\n2. Ajhai join gareko chaina\n3. Problem cha`
    }

    if (type === 'candidate_interview_confirmation') {
        return `Namaste ${name} ji 🙏\n\nTapai ko ${companyName || 'company'} ko ${jobTitle || 'job'} interview confirm garna parcha.\n\nTapai available hunuhuncha?\n1. Yes\n2. Time change garna parcha\n3. Not interested`
    }

    if (type === 'employer_application_review') {
        return `Namaste ${companyName || name} team 🙏\n\nTapai ko ${jobTitle || 'job'} post ma candidates apply gareka chan.\n\nReview garna sahayog chahinchha?\n1. Candidate list pathaunu\n2. Shortlist garna help garnu\n3. Aile pardaina`
    }

    return `Namaste ${name} ji 🙏\n\nJobMate bata follow-up ko lagi message gareko. Kripaya reply garnuhola.`
}

export const sendAaratiFollowUp = async (req, res) => {
    try {
        const {
            applicationId,
            taskId,
            type = 'general_followup',
            phone,
            recipientName,
            jobTitle,
            companyName,
            metadata = {}
        } = req.body

        const webhookUrl = process.env.AARATI_FOLLOWUP_WEBHOOK_URL

        if (!webhookUrl) {
            return res.status(500).json({
                message: 'AARATI_FOLLOWUP_WEBHOOK_URL is not configured'
            })
        }

        const normalizedPhone = normalizePhone(phone)

        if (!normalizedPhone) {
            return res.status(400).json({ message: 'Valid phone is required' })
        }

        const duplicateFilter = {
            type,
            phone: normalizedPhone,
            status: { $in: ['queued', 'sent'] }
        }

        if (applicationId) duplicateFilter.applicationId = applicationId
        if (taskId) duplicateFilter.taskId = taskId

        const existing = await FollowUpLog.findOne(duplicateFilter).sort({ createdAt: -1 })

        if (existing) {
            return res.status(200).json({
                message: 'Follow-up already queued or sent',
                duplicate: true,
                log: existing
            })
        }

        const message = buildFollowUpMessage({
            type,
            recipientName,
            jobTitle,
            companyName
        })

        const log = await FollowUpLog.create({
            applicationId: applicationId || undefined,
            taskId: taskId || undefined,
            type,
            phone: normalizedPhone,
            recipientName: recipientName || '',
            jobTitle: jobTitle || '',
            companyName: companyName || '',
            status: 'queued',
            message,
            payload: {
                applicationId,
                taskId,
                type,
                phone: normalizedPhone,
                recipientName,
                jobTitle,
                companyName,
                metadata
            }
        })

        const payload = {
            source: 'jobmate_website',
            followUpLogId: log._id.toString(),
            applicationId,
            taskId,
            type,
            phone: normalizedPhone,
            recipientName,
            jobTitle,
            companyName,
            message,
            metadata
        }

        try {
            const response = await axios.post(webhookUrl, payload, {
                timeout: 10000,
                headers: {
                    'Content-Type': 'application/json',
                    'x-jobmate-secret': process.env.AARATI_FOLLOWUP_WEBHOOK_SECRET || ''
                }
            })

            log.status = 'sent'
            log.sentAt = new Date()
            log.externalFollowupId =
                response.data?.id ||
                response.data?.followupId ||
                response.data?.messageId ||
                ''

            await log.save()

            return res.status(200).json({
                message: 'Follow-up sent to Aarati bot',
                log
            })
        } catch (err) {
            log.status = 'failed'
            log.failedAt = new Date()
            log.lastError = err.response?.data?.message || err.message
            await log.save()

            return res.status(502).json({
                message: 'Failed to send follow-up to Aarati bot',
                error: log.lastError,
                log
            })
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const receiveAaratiFollowUpReply = async (req, res) => {
    try {
        const {
            followUpLogId,
            phone,
            replyText,
            externalFollowupId
        } = req.body

        const query = {}

        if (followUpLogId) query._id = followUpLogId
        else if (externalFollowupId) query.externalFollowupId = externalFollowupId
        else if (phone) query.phone = normalizePhone(phone)

        if (!Object.keys(query).length) {
            return res.status(400).json({ message: 'followUpLogId, externalFollowupId, or phone is required' })
        }

        const log = await FollowUpLog.findOne(query).sort({ createdAt: -1 })

        if (!log) {
            return res.status(404).json({ message: 'Follow-up log not found' })
        }

        log.status = 'replied'
        log.replyText = replyText || ''
        log.repliedAt = new Date()

        await log.save()

        res.status(200).json({
            message: 'Follow-up reply saved',
            log
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const getAaratiFollowUpLogs = async (req, res) => {
    try {
        const {
            status,
            type,
            phone,
            limit = 50
        } = req.query

        const filter = {}

        if (status) filter.status = status
        if (type) filter.type = type
        if (phone) filter.phone = String(phone).replace(/\D/g, '')

        const logs = await FollowUpLog.find(filter)
            .sort({ createdAt: -1 })
            .limit(Number(limit) || 50)

        const counts = {
            total: await FollowUpLog.countDocuments(),
            queued: await FollowUpLog.countDocuments({ status: 'queued' }),
            sent: await FollowUpLog.countDocuments({ status: 'sent' }),
            failed: await FollowUpLog.countDocuments({ status: 'failed' }),
            replied: await FollowUpLog.countDocuments({ status: 'replied' }),
            cancelled: await FollowUpLog.countDocuments({ status: 'cancelled' })
        }

        res.status(200).json({
            message: 'Aarati follow-up logs fetched successfully',
            counts,
            logs
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const retryAaratiFollowUpLog = async (req, res) => {
  try {
    const { id } = req.params

    const log = await FollowUpLog.findById(id)

    if (!log) {
      return res.status(404).json({
        message: 'Aarati follow-up log not found'
      })
    }

    const payload = {
  ...(log.payload || {}),
  applicationId: log.applicationId,
  type: log.type,
  phone: log.phone || log.payload?.phone,
  message: log.message || log.payload?.message,
  recipientName: log.recipientName || log.payload?.recipientName,
  jobTitle: log.jobTitle || log.payload?.jobTitle,
  companyName: log.companyName || log.payload?.companyName,
  metadata: {
    ...(log.payload?.metadata || {}),
    ...(log.metadata || {}),
    source: 'jobmate_retry',
    retry: true,
    retryLogId: log._id,
    retriedAt: new Date()
  }
}
    const webhookUrl = process.env.AARATI_FOLLOWUP_WEBHOOK_URL
    const webhookSecret = process.env.AARATI_FOLLOWUP_WEBHOOK_SECRET

    if (!webhookUrl) {
      return res.status(500).json({
        message: 'Aarati follow-up webhook URL is not configured',
        error: 'Missing AARATI_FOLLOWUP_WEBHOOK_URL'
      })
    }

    if (!webhookSecret) {
      return res.status(500).json({
        message: 'Aarati follow-up webhook secret is not configured',
        error: 'Missing AARATI_FOLLOWUP_WEBHOOK_SECRET'
      })
    }
    if (!payload.phone || !payload.message) {
  log.status = 'failed'
  log.lastError = 'phone and message are required'
  log.retryCount = (log.retryCount || 0) + 1
  log.lastRetriedAt = new Date()
  await log.save()

  return res.status(400).json({
    message: 'Retry failed',
    error: 'phone and message are required',
    log
  })
}
    try {
      const response = await axios.post(
        webhookUrl,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-jobmate-secret': webhookSecret
          },
          timeout: 15000
        }
      )

      log.status = 'sent'
      log.lastError = ''
      log.retryCount = (log.retryCount || 0) + 1
      log.lastRetriedAt = new Date()
      log.response = response.data
      await log.save()

      return res.json({
        message: 'Retry successful',
        log
      })
    } catch (error) {
      const upstreamStatus = error?.response?.status
      const upstreamData = error?.response?.data
      const errorMessage =
        upstreamData?.error ||
        upstreamData?.message ||
        error?.message ||
        'Retry failed'

      log.status = 'failed'
      log.lastError = errorMessage
      log.retryCount = (log.retryCount || 0) + 1
      log.lastRetriedAt = new Date()
      log.response = upstreamData || null
      await log.save()

      return res.status(502).json({
        message: 'Retry failed',
        error: errorMessage,
        upstreamStatus,
        upstreamData,
        log
      })
    }
  } catch (error) {
    console.error('Retry Aarati follow-up log failed:', error)

    return res.status(500).json({
      message: 'Retry failed',
      error: error?.message || 'Internal server error'
    })
  }
}