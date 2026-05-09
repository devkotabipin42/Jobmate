import mongoose from 'mongoose'
import LeadFinderLead from '../models/LeadFinderLead.model.js'

const providerConfig = () => ({
    apiUrl: process.env.LEAD_FINDER_API_URL,
    apiKey: process.env.LEAD_FINDER_API_KEY
})

const isProviderConfigured = () => {
    const config = providerConfig()
    return Boolean(config.apiUrl && config.apiKey)
}

const normalizeCompanyName = (value = '') => {
    const normalized = String(value)
        .trim()
        .toLowerCase()
        .replace(/&/g, 'and')
        .replace(/[^a-z0-9]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
    return normalized || String(value).trim().toLowerCase()
}

const normalizeCity = (value = '') => {
    const normalized = String(value)
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
    return normalized || String(value).trim().toLowerCase()
}

const normalizeNepalPhone = (phone = '') => {
    const digits = String(phone).replace(/\D/g, '')
    if (!digits) return ''
    if (digits.startsWith('977')) return digits.slice(3)
    return digits
}

const classifyNepalPhone = (phone = '') => {
    const normalized = normalizeNepalPhone(phone)

    if (/^9[678]\d{8}$/.test(normalized)) {
        return { phone: normalized, phoneType: 'mobile', whatsappPossible: true }
    }

    if (/^0?7[1-5]\d{6,7}$/.test(normalized)) {
        return { phone: normalized, phoneType: 'landline', whatsappPossible: false }
    }

    return { phone: normalized, phoneType: 'unknown', whatsappPossible: false }
}

const escapeRegex = (value = '') => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const cleanString = (value) => typeof value === 'string' ? value.trim() : ''

const clampScore = (value) => Math.max(0, Math.min(100, Number(value) || 0))

const priorityFromScore = (score) => {
    if (score >= 75) return 'high'
    if (score >= 50) return 'medium'
    return 'low'
}

const calculateScore = (lead) => {
    if (typeof lead.score === 'number') return clampScore(lead.score)

    let score = 30
    if (lead.phone) score += 20
    if (lead.website) score += 15
    if (lead.address) score += 10
    if (lead.sourceUrl) score += 10
    if (lead.company) score += 10

    return clampScore(score)
}

const buildOutreachMessage = ({ company, city, sector, outputLanguage }) => {
    const name = company || 'your team'

    if (outputLanguage === 'nepali' || outputLanguage === 'roman_nepali') {
        return `Namaste ${name}, JobMate le ${city} ma ${sector} hiring ko lagi verified workers khojna help garcha. Tapai hiring support bare kura garna chahanu huncha?`
    }

    return `Namaste ${name}, JobMate helps employers in ${city} find verified workers for ${sector} roles. Would you like to discuss hiring support?`
}

const makeDevMockLeads = ({ city, sector, count }) => (
    Array.from({ length: count }, (_, index) => ({
        company: `Dev Mock ${sector} Lead ${index + 1}`,
        city,
        sector,
        source: 'dev_mock',
        sourceType: 'dev_mock',
        score: 25
    }))
)

const fetchExternalLeads = async ({ city, sector, count, outputLanguage }) => {
    const config = providerConfig()

    if (typeof fetch !== 'function') {
        throw new Error('Lead provider fetch is unavailable in this Node runtime')
    }

    const response = await fetch(config.apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${config.apiKey}`
        },
        body: JSON.stringify({ city, sector, count, outputLanguage })
    })

    if (!response.ok) {
        const text = await response.text()
        throw new Error(`Lead provider failed with ${response.status}: ${text.slice(0, 200)}`)
    }

    const data = await response.json()
    const leads = Array.isArray(data?.leads) ? data.leads : Array.isArray(data) ? data : []

    return leads.slice(0, count).map(item => ({
        company: cleanString(item.company || item.name),
        city: cleanString(item.city) || city,
        sector: cleanString(item.sector || item.category) || sector,
        phone: cleanString(item.phone),
        address: cleanString(item.address),
        website: cleanString(item.website),
        facebookUrl: cleanString(item.facebookUrl || item.facebook_url),
        source: cleanString(item.source) || 'external_provider',
        sourceUrl: cleanString(item.sourceUrl || item.source_url),
        sourceType: 'external',
        score: typeof item.score === 'number' ? item.score : undefined
    }))
}

const buildLeadDocument = async ({ rawLead, requestData, req, batchDuplicates }) => {
    const company = cleanString(rawLead.company)
    const city = cleanString(rawLead.city) || requestData.city
    const sector = cleanString(rawLead.sector) || requestData.sector
    const normalizedCompany = normalizeCompanyName(company)
    const normalizedCity = normalizeCity(city)
    const phoneInfo = classifyNepalPhone(rawLead.phone)
    const score = calculateScore({ ...rawLead, company })
    const existingDuplicate = normalizedCompany && normalizedCity
        ? await LeadFinderLead.findOne({ normalizedCompany, normalizedCity }).select('_id')
        : null
    const batchDuplicateId = batchDuplicates.get(`${normalizedCompany}:${normalizedCity}`)
    const duplicateOf = existingDuplicate?._id || batchDuplicateId

    return {
        company,
        normalizedCompany,
        city,
        normalizedCity,
        sector,
        phone: phoneInfo.phone,
        phoneType: phoneInfo.phoneType,
        whatsappPossible: phoneInfo.whatsappPossible,
        address: cleanString(rawLead.address),
        website: cleanString(rawLead.website),
        facebookUrl: cleanString(rawLead.facebookUrl),
        source: cleanString(rawLead.source) || 'external_provider',
        sourceUrl: cleanString(rawLead.sourceUrl),
        sourceType: rawLead.sourceType === 'dev_mock' ? 'dev_mock' : 'external',
        score,
        priority: priorityFromScore(score),
        outreachMessage: buildOutreachMessage({
            company,
            city,
            sector,
            outputLanguage: requestData.outputLanguage
        }),
        verificationStatus: 'unverified',
        contactStatus: 'new',
        duplicateWarning: Boolean(duplicateOf),
        duplicateOf,
        searchCity: requestData.city,
        searchSector: requestData.sector,
        outputLanguage: requestData.outputLanguage,
        createdBy: req.user?._id,
        createdByRole: req.user?.role || ''
    }
}

const getLeadsForRequest = async (requestData) => {
    if (isProviderConfigured()) {
        return fetchExternalLeads(requestData)
    }

    if (process.env.NODE_ENV === 'production') {
        const error = new Error('Lead Finder provider is not configured. Set LEAD_FINDER_API_URL and LEAD_FINDER_API_KEY before running searches in production.')
        error.statusCode = 503
        throw error
    }

    return makeDevMockLeads(requestData)
}

export const getLeadFinderLeads = async (req, res) => {
    try {
        const {
            city,
            sector,
            verificationStatus,
            contactStatus,
            duplicateWarning,
            search,
            limit = 100
        } = req.query

        const filter = {}

        if (city) filter.city = { $regex: escapeRegex(city), $options: 'i' }
        if (sector) filter.sector = { $regex: escapeRegex(sector), $options: 'i' }
        if (verificationStatus) filter.verificationStatus = verificationStatus
        if (contactStatus) filter.contactStatus = contactStatus
        if (duplicateWarning === 'true') filter.duplicateWarning = true
        if (duplicateWarning === 'false') filter.duplicateWarning = false

        if (search) {
            const safeSearch = escapeRegex(search)
            filter.$or = [
                { company: { $regex: safeSearch, $options: 'i' } },
                { phone: { $regex: safeSearch, $options: 'i' } },
                { source: { $regex: safeSearch, $options: 'i' } }
            ]
        }

        const safeLimit = Math.min(Math.max(Number(limit) || 100, 1), 500)
        const leads = await LeadFinderLead.find(filter)
            .sort({ createdAt: -1 })
            .limit(safeLimit)

        res.status(200).json({ leads, count: leads.length })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const runLeadFinderSearch = async (req, res) => {
    try {
        const requestData = req.body
        const rawLeads = await getLeadsForRequest(requestData)

        const batchDuplicates = new Map()
        const created = []

        for (const rawLead of rawLeads) {
            const company = cleanString(rawLead.company)
            if (!company) continue

            const doc = await buildLeadDocument({
                rawLead,
                requestData,
                req,
                batchDuplicates
            })

            const lead = await LeadFinderLead.create(doc)
            const duplicateKey = `${lead.normalizedCompany}:${lead.normalizedCity}`
            if (!batchDuplicates.has(duplicateKey)) batchDuplicates.set(duplicateKey, lead._id)
            created.push(lead)
        }

        res.status(201).json({
            message: created.length > 0 ? 'Lead Finder search completed' : 'No leads returned by provider',
            leads: created,
            count: created.length,
            sourceType: isProviderConfigured() ? 'external' : 'dev_mock'
        })
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message })
    }
}

export const updateLeadFinderLeadStatus = async (req, res) => {
    try {
        const { id } = req.params

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: 'Invalid lead id' })
        }

        const update = {
            statusUpdatedAt: new Date()
        }

        if (req.body.contactStatus) update.contactStatus = req.body.contactStatus
        if (req.body.verificationStatus) {
            update.verificationStatus = req.body.verificationStatus
            if (req.body.verificationStatus === 'verified') update.verifiedAt = new Date()
        }
        if (typeof req.body.adminNotes === 'string') update.adminNotes = req.body.adminNotes.trim()

        const lead = await LeadFinderLead.findByIdAndUpdate(id, update, { new: true })

        if (!lead) {
            return res.status(404).json({ message: 'Lead not found' })
        }

        res.status(200).json({ message: 'Lead status updated', lead })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const csvEscape = (value = '') => {
    const text = String(value ?? '')
    if (/[",\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`
    return text
}

export const exportLeadFinderCsv = async (req, res) => {
    try {
        const leads = await LeadFinderLead.find()
            .sort({ createdAt: -1 })
            .limit(2000)

        const headers = [
            'company',
            'city',
            'sector',
            'phone',
            'phoneType',
            'whatsappPossible',
            'source',
            'score',
            'priority',
            'outreachMessage',
            'verificationStatus',
            'contactStatus',
            'duplicateWarning'
        ]

        const rows = leads.map(lead => headers.map(header => csvEscape(lead[header])).join(','))
        const csv = [headers.join(','), ...rows].join('\n')

        res.setHeader('Content-Type', 'text/csv')
        res.setHeader('Content-Disposition', 'attachment; filename="lead-finder-leads.csv"')
        res.status(200).send(csv)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
