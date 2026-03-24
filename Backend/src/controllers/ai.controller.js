import { config } from 'dotenv'
config()

import { ChatGoogleGenerativeAI } from '@langchain/google-genai'
import { HumanMessage, SystemMessage } from '@langchain/core/messages'

const geminiModel = new ChatGoogleGenerativeAI({
    model: 'gemini-2.5-flash-lite',
    apiKey: process.env.GOOGLE_API_KEY
})

export const scoreResume = async (req, res) => {
    try {
        const { resumeText } = req.body

        if (!resumeText) {
            return res.status(400).json({ message: 'Resume text required' })
        }

        const response = await geminiModel.invoke([
            new SystemMessage(`
                You are an expert HR recruiter for Nepal's job market.
                Analyze resumes and provide detailed feedback.
                Always respond in valid JSON format only — no extra text.
            `),
            new HumanMessage(`
                Analyze this resume and respond ONLY in this exact JSON format:
                {
                    "overall_score": 75,
                    "sections": {
                        "contact_info": 90,
                        "work_experience": 70,
                        "education": 80,
                        "skills": 75,
                        "formatting": 65
                    },
                    "strengths": [
                        "Clear contact information"
                    ],
                    "weaknesses": [
                        "No quantifiable achievements"
                    ],
                    "suggestions": [
                        "Add a professional summary",
                        "Quantify achievements",
                        "Add LinkedIn URL"
                    ],
                    "verdict": "Good resume with room for improvement"
                }

                Resume:
                ${resumeText}
            `)
        ])

        const raw = response.text
        const clean = raw.replace(/```json|```/g, '').trim()
        const parsed = JSON.parse(clean)

        res.status(200).json({
            message: 'Resume scored successfully',
            result: parsed
        })
    } catch (error) {
        console.log('AI Error:', error.message)
        res.status(500).json({ message: error.message })
    }
}