import { GoogleGenerativeAI } from '@google/generative-ai'
import {Mistral} from '@mistralai/mistralai'

const provider = process.env.AI_PROVIDER || 'mistral'

export const generateAIText = async (prompt) => {
    if (provider === 'gemini') {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
        const result = await model.generateContent(prompt)
        return result.response.text()
    } else {
        const mistral = new Mistral({ apiKey: process.env.MISTRAL_API_KEY })
        const result = await mistral.chat.complete({
            model: 'mistral-small-latest',
            messages: [{ role: 'user', content: prompt }]
        })
        return result.choices[0].message.content
    }
}


