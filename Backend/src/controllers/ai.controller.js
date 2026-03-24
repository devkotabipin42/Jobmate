import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
export const scoreResume = async (req, res) => {
    try {
        const { resumeText } = req.body

        if (!resumeText) {
            return res.status(400).json({ message: 'Resume text required' })
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

        const prompt = `
You are a strict and highly experienced HR recruiter in Nepal.

Evaluate the resume based on Nepal's job market standards.

Rules:
- Be realistic and critical
- Give lower scores if resume is weak
- Focus on clarity, impact, and ATS-friendliness
- DO NOT give overly positive feedback

Respond ONLY in valid JSON format:

{
    "overall_score": number (0-100),
    "sections": {
        "contact_info": number,
        "work_experience": number,
        "education": number,
        "skills": number,
        "formatting": number
    },
    "strengths": [string],
    "weaknesses": [string],
    "suggestions": [string],
    "verdict": string
}

Resume:
${resumeText}
`

        const result = await model.generateContent(prompt)
        const raw = result.response.text()
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
