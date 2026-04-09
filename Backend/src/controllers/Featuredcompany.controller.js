// ── FEATURED COMPANIES ───────────────────────────────────
// Add these functions to admin.controller.js
// Also add: import FeaturedCompany from '../models/FeaturedCompany.model.js'
// Also add: import ImageKit from 'imagekit' (already imported if using ImageKit)

import FeaturedCompany from '../models/FeaturedCompany.model.js'
import ImageKit from 'imagekit'

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
})

// GET all featured companies (public)
export const getFeaturedCompanies = async (req, res) => {
    try {
        const companies = await FeaturedCompany.find({ is_active: true }).sort({ createdAt: -1 })
        res.json({ companies })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// GET all featured companies (admin — includes inactive)
export const getAllFeaturedCompanies = async (req, res) => {
    try {
        const companies = await FeaturedCompany.find().sort({ createdAt: -1 })
        res.json({ companies })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// POST create featured company
export const createFeaturedCompany = async (req, res) => {
    try {
        const { name, location, industry, website, description } = req.body
        if (!name) return res.status(400).json({ message: 'Company name is required' })

        let logo_url = ''

        // Upload logo if provided
        if (req.file) {
            const uploaded = await imagekit.upload({
                file: req.file.buffer.toString('base64'),
                fileName: `featured_company_${Date.now()}.jpg`,
                folder: '/jobmate/featured_companies'
            })
            logo_url = uploaded.url
        }

        const company = await FeaturedCompany.create({
            name, location, industry, website, description, logo_url
        })

        res.status(201).json({ message: 'Featured company added!', company })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// DELETE featured company
export const deleteFeaturedCompany = async (req, res) => {
    try {
        await FeaturedCompany.findByIdAndDelete(req.params.id)
        res.json({ message: 'Company deleted' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// TOGGLE active status
export const toggleFeaturedCompany = async (req, res) => {
    try {
        const company = await FeaturedCompany.findById(req.params.id)
        if (!company) return res.status(404).json({ message: 'Not found' })
        company.is_active = !company.is_active
        await company.save()
        res.json({ company })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}