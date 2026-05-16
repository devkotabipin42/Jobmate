import mongoose from 'mongoose'
import LeadFinderLead from '../models/LeadFinderLead.model.js'

const TAVILY_PROVIDER = 'tavily'
const TAVILY_SEARCH_API_URL = 'https://api.tavily.com/search'
const PHONE_CANDIDATE_REGEX = /\+?\d[\d\s-]{6,}\d/g
const SCHOOL_SECTOR_NAME_KEYWORDS = new Set([
    'school',
    'college',
    'academy',
    'institute',
    'campus',
    'boarding'
])
const GENERIC_SCHOOL_NAME_PATTERNS = [
    /^(?:public|best|top)\s+schools?\s+(?:in|at|near|around)\b/i
]
const TAVILY_RESULT_NOISE_TERMS = [
    'Allentown',
    'Pennsylvania',
    'United States',
    'USA',
    'U.S.',
    'County',
    'crisis',
    'children drops',
    'Wikipedia',
    'news',
    'list of',
    'best school in'
]
const CITY_ALIAS_GROUPS = [
    ['kathmandu', 'ktm', 'kantipur'],
    ['lalitpur', 'patan'],
    ['bhaktapur', 'bhadgaon'],
    ['pokhara', 'pokhara metropolitan city'],
    ['birgunj', 'birganj'],
    ['nepalgunj', 'nepalganj'],
    ['janakpur', 'janakpurdham'],
    ['hetauda', 'hetdaunda'],
    ['birtamod', 'birtamode'],
    ['dhangadhi', 'dhangadi'],
    ['butwal', 'butwal sub-metropolitan city'],
    ['bharatpur', 'bharatpur metropolitan city']
]
const TITLE_NOISE_SEGMENTS = new Set([
    'facebook',
    'instagram',
    'linkedin',
    'youtube',
    'tiktok',
    'google',
    'google maps',
    'official website',
    'official site',
    'home',
    'homepage',
    'nepalyp',
    'nepal yellow pages',
    'yellow pages',
    'yellowpages',
    'nepalyellowpages',
    'findglocal',
    'tripadvisor',
    'yelp',
    'edusanjal',
    'cybo',
    'yelu',
    'directory',
    'business directory'
])
const GENERIC_COMPANY_NAME_WORDS = new Set([
    'a',
    'an',
    'and',
    'at',
    'around',
    'best',
    'business',
    'businesses',
    'companies',
    'company',
    'contact',
    'contacts',
    'directory',
    'directories',
    'facebook',
    'famous',
    'find',
    'finder',
    'for',
    'good',
    'google',
    'home',
    'in',
    'leading',
    'list',
    'listed',
    'listing',
    'lists',
    'local',
    'location',
    'map',
    'maps',
    'near',
    'nearby',
    'nepal',
    'nepali',
    'number',
    'numbers',
    'of',
    'official',
    'open',
    'option',
    'options',
    'phone',
    'popular',
    'rating',
    'ratings',
    'review',
    'reviews',
    'service',
    'services',
    'site',
    'the',
    'top',
    'website',
    'websites'
])
const GENERIC_BUSINESS_CATEGORY_WORDS = new Set([
    'academy',
    'academies',
    'boarding',
    'clinic',
    'clinics',
    'college',
    'colleges',
    'computer',
    'consultancies',
    'consultancy',
    'cooperative',
    'cooperatives',
    'factory',
    'factories',
    'finance',
    'hospital',
    'hospitals',
    'hotel',
    'hotels',
    'institute',
    'institutes',
    'photo',
    'restaurant',
    'restaurants',
    'school',
    'schools',
    'showroom',
    'showrooms',
    'studio',
    'studios',
    'supermarket',
    'supermarkets',
    'video',
    'workshop',
    'workshops'
])
const GENERIC_NAME_PATTERNS = [
    /^(?:\d+\s+)?(?:best|top|leading|popular|famous|good)\s+(?:\d+\s+)?(?:schools?|colleges?|consultanc(?:y|ies)|hotels?|restaurants?|clinics?|hospitals?|cooperatives?|finance|computer institutes?|showrooms?|supermarkets?|factories?|workshops?|photo studios?|video studios?|business(?:es)?|companies)\b/i,
    /^(?:\d+\s+)?(?:schools?|colleges?|consultanc(?:y|ies)|hotels?|restaurants?|clinics?|hospitals?|cooperatives?|finance|computer institutes?|showrooms?|supermarkets?|factories?|workshops?|photo studios?|video studios?|business(?:es)?|companies)\s+(?:in|at|near|around)\b/i,
    /^(?:list|lists|listing|directory|directories|finder)\s+(?:of|for)\b/i,
    /\b(?:near me|contact number|phone number|reviews?|ratings?)$/i
]

const providerConfig = () => ({
    provider: String(process.env.LEAD_FINDER_PROVIDER || '').trim().toLowerCase(),
    apiUrl: process.env.LEAD_FINDER_API_URL,
    apiKey: process.env.LEAD_FINDER_API_KEY,
    tavilyApiKey: process.env.TAVILY_API_KEY
})

const isTavilyProvider = (config = providerConfig()) => config.provider === TAVILY_PROVIDER

const isProviderConfigured = () => {
    const config = providerConfig()
    if (isTavilyProvider(config)) return Boolean(config.tavilyApiKey)
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

const normalizeSearchableText = (value = '') => {
    let text = String(value).toLowerCase()

    try {
        text = decodeURIComponent(text)
    } catch {
        // Keep the original text when a URL contains a malformed escape sequence.
    }

    return text
        .replace(/&/g, ' and ')
        .replace(/[^a-z0-9]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
}

const containsNormalizedPhrase = (normalizedText = '', normalizedPhrase = '') => {
    if (!normalizedText || !normalizedPhrase) return false
    return ` ${normalizedText} `.includes(` ${normalizedPhrase} `)
}

const getCityAliases = (city = '') => {
    const normalizedCity = normalizeCity(city)
    const cityWithoutCountry = normalizeCity(normalizedCity.replace(/\b(?:nepal|np)\b/g, ' '))
    const compactCity = normalizedCity.replace(/\s+/g, '')
    const compactCityWithoutCountry = cityWithoutCountry.replace(/\s+/g, '')
    const aliases = new Set()

    if (normalizedCity) aliases.add(normalizedCity)
    if (cityWithoutCountry && cityWithoutCountry !== normalizedCity) aliases.add(cityWithoutCountry)
    if (compactCity.length >= 4 && compactCity !== normalizedCity) aliases.add(compactCity)
    if (compactCityWithoutCountry.length >= 4 && compactCityWithoutCountry !== cityWithoutCountry) aliases.add(compactCityWithoutCountry)

    for (const group of CITY_ALIAS_GROUPS) {
        const normalizedGroup = group.map(alias => normalizeCity(alias))
        if (
            !normalizedGroup.includes(normalizedCity)
            && !normalizedGroup.includes(cityWithoutCountry)
            && !normalizedGroup.includes(compactCity)
            && !normalizedGroup.includes(compactCityWithoutCountry)
        ) continue

        normalizedGroup.forEach(alias => {
            if (alias.length >= 3) aliases.add(alias)
            const compactAlias = alias.replace(/\s+/g, '')
            if (compactAlias.length >= 4 && compactAlias !== alias) aliases.add(compactAlias)
        })
    }

    return [...aliases]
}

const tavilyResultText = ({ title = '', content = '', url = '' } = {}) => [title, content, url].join(' ')

const hasTavilyNoiseTerm = (result = {}) => {
    const rawText = tavilyResultText(result).toLowerCase()
    const normalizedText = normalizeSearchableText(rawText)

    return TAVILY_RESULT_NOISE_TERMS.some(term => {
        const rawTerm = String(term).toLowerCase()
        if (rawTerm.includes('.') && rawText.includes(rawTerm)) return true

        return containsNormalizedPhrase(normalizedText, normalizeSearchableText(term))
    })
}

const hasSubmittedCityOrAlias = (result = {}, city = '') => {
    const normalizedText = normalizeSearchableText(tavilyResultText(result))
    return getCityAliases(city).some(alias => containsNormalizedPhrase(normalizedText, alias))
}

const isLocallyRelevantTavilyResult = (result = {}, city = '') => (
    hasSubmittedCityOrAlias(result, city) && !hasTavilyNoiseTerm(result)
)

const normalizeSectorCategory = (sector = '') => {
    const normalizedSector = normalizeCity(sector)

    if (/\b(?:hotels?|restaurants?)\b/.test(normalizedSector)) return 'hotel_restaurant'
    if (/\b(?:schools?|colleges?|academ(?:y|ies)|institutes?|campus|boarding)\b/.test(normalizedSector)) return 'school_college'
    if (/\b(?:clinics?|hospitals?)\b/.test(normalizedSector)) return 'clinic_hospital'
    if (/\b(?:consultanc(?:y|ies)|consultants?)\b/.test(normalizedSector)) return 'consultancy'
    if (/\b(?:cooperatives?|finance|financial|sahakari)\b/.test(normalizedSector)) return 'cooperative_finance'

    return 'default'
}

const isSchoolSector = (sector = '') => normalizeSectorCategory(sector) === 'school_college'

const buildTavilyQuery = ({ city = '', sector = '' } = {}) => {
    const cityText = cleanString(city)
    const sectorText = cleanString(sector)

    switch (normalizeSectorCategory(sectorText)) {
        case 'hotel_restaurant':
            return `${cityText} Nepal hotel restaurant contact phone Facebook`
        case 'school_college':
            return `${cityText} Nepal school college contact phone Facebook`
        case 'clinic_hospital':
            return `${cityText} Nepal clinic hospital contact phone Facebook`
        case 'consultancy':
            return `${cityText} Nepal education consultancy contact phone Facebook`
        case 'cooperative_finance':
            return `${cityText} Nepal cooperative finance contact phone`
        default:
            return `${cityText} Nepal ${sectorText} contact phone Facebook`
    }
}

const normalizeNepalPhone = (phone = '') => {
    const compact = String(phone).trim().replace(/[\s-]+/g, '')
    if (!compact) return ''

    let digits = compact.replace(/^\+/, '')
    if (!/^\d+$/.test(digits)) return ''
    if (digits.startsWith('977') && digits.length > 10) digits = digits.slice(3)

    if (/^9[678]\d{8}$/.test(digits)) return digits
    if (/^0?7[1-5]\d{6,7}$/.test(digits)) return digits

    return ''
}

const classifyNepalPhone = (phone = '') => {
    const normalized = normalizeNepalPhone(phone)

    if (/^9[678]\d{8}$/.test(normalized)) {
        return { phone: normalized, phoneType: 'mobile', whatsappPossible: true }
    }

    if (/^0?7[1-5]\d{6,7}$/.test(normalized)) {
        return { phone: normalized, phoneType: 'landline', whatsappPossible: false }
    }

    return { phone: '', phoneType: 'unknown', whatsappPossible: false }
}

const escapeRegex = (value = '') => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const cleanString = (value) => typeof value === 'string' ? value.trim() : ''

const tokenizeNormalizedName = (value = '') => normalizeCompanyName(value).split(' ').filter(Boolean)

const isSchoolNameKeyword = (word = '') => (
    SCHOOL_SECTOR_NAME_KEYWORDS.has(word)
    || word === 'schools'
    || word === 'colleges'
    || word === 'academies'
    || word === 'institutes'
    || word === 'campuses'
)

const hasSchoolNameKeyword = (value = '') => tokenizeNormalizedName(value).some(isSchoolNameKeyword)

const isBadSchoolCompanyName = (value = '') => {
    const cleaned = cleanString(value)
    if (!cleaned) return true
    if (GENERIC_SCHOOL_NAME_PATTERNS.some(pattern => pattern.test(cleaned))) return true
    return !hasSchoolNameKeyword(cleaned)
}

const hasMostlyHashtags = (value = '') => {
    const tokens = cleanString(value).split(/\s+/).filter(Boolean)
    if (!tokens.length) return false

    const hashtagTokens = tokens.filter(token => token.startsWith('#'))
    return hashtagTokens.length > 0 && hashtagTokens.length / tokens.length >= 0.5
}

const isTitleNoiseSegment = (value = '') => {
    const normalized = normalizeCompanyName(value)
    if (!normalized) return true
    if (TITLE_NOISE_SEGMENTS.has(normalized)) return true

    return [
        'yellow pages',
        'business directory',
        'google maps',
        'official website'
    ].some(phrase => normalized.includes(phrase))
}

const stripTrailingLocation = (value = '', city = '') => {
    let cleaned = cleanString(value)
    const cityText = cleanString(city)

    if (cityText) {
        const cityPattern = escapeRegex(cityText).replace(/\s+/g, '\\s+')
        cleaned = cleaned
            .replace(new RegExp(`\\s+(?:in|at|near|around)\\s+${cityPattern}(?:\\s*,?\\s*(?:nepal|np))?$`, 'i'), '')
            .replace(new RegExp(`\\s*[-,()]\\s*${cityPattern}(?:\\s*,?\\s*(?:nepal|np))?\\)?$`, 'i'), '')
    }

    return cleaned
        .replace(/\s*[-,(]\s*(?:nepal|np)\)?$/i, '')
        .replace(/\s+/g, ' ')
        .trim()
}

const cleanCompanyNameCandidate = (value = '', { city } = {}) => {
    let cleaned = cleanString(value)
        .replace(/\s+/g, ' ')
        .replace(/^[\s"'`]+|[\s"'`.]+$/g, '')
        .replace(/^(?:official\s+(?:website|site)\s+(?:of|for)|welcome\s+to)\s+/i, '')
        .replace(/^\d+[.)]\s+/, '')
        .replace(/\s+\([^)]*(?:official|facebook|instagram|reviews?|ratings?|contact|phone|address|maps?)[^)]*\)$/i, '')
        .replace(/\b(?:official\s+(?:website|site)|facebook|instagram|linkedin|youtube|tiktok|google\s+maps?|reviews?|ratings?|contact(?:\s+number)?|phone(?:\s+number)?|address|photos?|menu)\b\.?$/i, '')
        .replace(/\s+/g, ' ')
        .trim()

    cleaned = stripTrailingLocation(cleaned, city)

    return cleaned.replace(/[|:,-]+$/g, '').trim()
}

const isGenericCompanyName = (value = '', { city, sector } = {}) => {
    const cleaned = cleanString(value)
    if (!cleaned) return true
    if (GENERIC_NAME_PATTERNS.some(pattern => pattern.test(cleaned))) return true

    const cityWords = new Set(tokenizeNormalizedName(city))
    const sectorWords = new Set(tokenizeNormalizedName(sector))
    const meaningfulWords = tokenizeNormalizedName(cleaned).filter(word => (
        !/^\d+$/.test(word)
        && !cityWords.has(word)
        && !sectorWords.has(word)
        && !GENERIC_COMPANY_NAME_WORDS.has(word)
        && !GENERIC_BUSINESS_CATEGORY_WORDS.has(word)
    ))

    return meaningfulWords.length === 0
}

const isBadTavilyCompanyName = (value = '', context = {}) => {
    const cleaned = cleanString(value)
    if (!cleaned) return true
    if (cleaned.startsWith('#')) return true
    if (hasMostlyHashtags(cleaned)) return true
    if (cleaned.replace(/[^a-z0-9]/gi, '').length < 3) return true
    if (isTitleNoiseSegment(cleaned)) return true
    if (isSchoolSector(context.sector) && isBadSchoolCompanyName(cleaned)) return true
    return isGenericCompanyName(cleaned, context)
}

const deriveCompanyNameFromTitle = (title = '', context = {}) => {
    const cleaned = cleanString(title).replace(/\s+/g, ' ')
    if (!cleaned) return ''

    const segments = cleaned
        .split(/\s*(?:\||\u2013|\u2014)\s*|\s+-\s+|:\s+/)
        .map(segment => cleanCompanyNameCandidate(segment, context))
        .filter(Boolean)

    const candidates = [...segments, cleanCompanyNameCandidate(cleaned, context)]
    const seen = new Set()

    for (const candidate of candidates) {
        const key = normalizeCompanyName(candidate)
        if (!key || seen.has(key)) continue
        seen.add(key)
        if (!isBadTavilyCompanyName(candidate, context)) return candidate
    }

    return ''
}

const extractNepalPhone = (value = '') => {
    const text = cleanString(value)
    if (!text) return null

    const matches = text.match(PHONE_CANDIDATE_REGEX) || []
    for (const match of matches) {
        const phoneInfo = classifyNepalPhone(match)
        if (phoneInfo.phoneType !== 'unknown') return phoneInfo.phone
    }

    return null
}

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
        company: cleanString(item.company || item.companyName || item.name),
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

const fetchTavilyLeads = async ({ city, sector, count }) => {
    const config = providerConfig()

    if (typeof fetch !== 'function') {
        throw new Error('Lead provider fetch is unavailable in this Node runtime')
    }

    const response = await fetch(TAVILY_SEARCH_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${config.tavilyApiKey}`
        },
        body: JSON.stringify({
            query: buildTavilyQuery({ city, sector }),
            max_results: count,
            search_depth: 'basic',
            include_answer: false,
            include_raw_content: false,
            include_images: false
        })
    })

    if (!response.ok) {
        const text = await response.text()
        throw new Error(`Tavily search failed with ${response.status}: ${text.slice(0, 200)}`)
    }

    const data = await response.json()
    const results = Array.isArray(data?.results) ? data.results : []

    const leads = []

    for (const result of results) {
        const title = cleanString(result.title)
        const content = cleanString(result.content)
        const sourceUrl = cleanString(result.url)
        if (!sourceUrl) continue
        if (!isLocallyRelevantTavilyResult({ title, content, url: sourceUrl }, city)) continue

        const company = deriveCompanyNameFromTitle(title, { city, sector })
        if (isBadTavilyCompanyName(company, { city, sector })) continue

        const evidenceText = content || title
        const phone = extractNepalPhone(content)

        leads.push({
            company,
            companyName: company,
            city,
            sector,
            phone,
            address: '',
            website: '',
            facebookUrl: '',
            source: 'tavily',
            sourceUrl,
            evidenceText,
            sourceType: 'external',
            score: phone ? 55 : 40
        })
    }

    return leads.slice(0, count)
}

const buildLeadDocument = async ({ rawLead, requestData, req, batchDuplicates }) => {
    const company = cleanString(rawLead.company || rawLead.companyName)
    const city = cleanString(rawLead.city) || requestData.city
    const sector = cleanString(rawLead.sector) || requestData.sector
    const normalizedCompany = normalizeCompanyName(company)
    const normalizedCity = normalizeCity(city)
    const phoneInfo = classifyNepalPhone(rawLead.phone)
    const score = calculateScore({ ...rawLead, company, phone: phoneInfo.phone })
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
        evidenceText: cleanString(rawLead.evidenceText),
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
    const config = providerConfig()

    if (isTavilyProvider(config)) {
        if (config.tavilyApiKey) return fetchTavilyLeads(requestData)

        if (process.env.NODE_ENV === 'production') {
            const error = new Error('Lead Finder Tavily provider is not configured. Set TAVILY_API_KEY before running searches in production.')
            error.statusCode = 503
            throw error
        }

        return makeDevMockLeads(requestData)
    }

    if (config.apiUrl && config.apiKey) {
        return fetchExternalLeads(requestData)
    }

    if (process.env.NODE_ENV === 'production') {
        const error = new Error('Lead Finder provider is not configured. Set LEAD_FINDER_API_URL and LEAD_FINDER_API_KEY, or set LEAD_FINDER_PROVIDER=tavily and TAVILY_API_KEY before running searches in production.')
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

export const deleteDevMockLeadFinderLeads = async (req, res) => {
    try {
        const devMockCompanyRegex = /^Dev Mock\b/i
        const devMockSourceRegex = /dev[\s_-]*mock/i

        const result = await LeadFinderLead.collection.deleteMany({
            $or: [
                { company: { $regex: devMockCompanyRegex } },
                { companyName: { $regex: devMockCompanyRegex } },
                { source: { $regex: devMockSourceRegex } },
                { sourceType: { $regex: devMockSourceRegex } }
            ]
        })

        res.status(200).json({
            message: 'Dev mock lead cleanup completed',
            deletedCount: result.deletedCount || 0
        })
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
