import puppeteer from 'puppeteer'
import ImageKit from 'imagekit'
import 'dotenv/config'

import { generateAIText } from '../config/api.js'
const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
})

export const generateResume = async (req, res) => {
    try {
        const {
            fullName, email, phone, location,
            summary, experience, education,
            skills, languages, linkedin, website
        } = req.body

        const prompt = `Write a strong professional resume summary (3-4 sentences) for:
Name: ${fullName}
Skills: ${skills}
Experience: ${experience}
Be specific, ATS-friendly, and impactful. No markdown, no asterisks, plain text only.`

        let aiSummary = summary
        try {
            aiSummary = await generateAIText(prompt)
            aiSummary = aiSummary.replace(/\*\*(.*?)\*\*/g, '$1')
        } catch (aiErr) {
            aiSummary = summary
        }

        res.status(200).json({
            message: 'Resume summary generated',
            ai_summary: aiSummary
        })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}