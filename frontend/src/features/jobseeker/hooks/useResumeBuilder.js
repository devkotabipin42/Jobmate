import { useState } from 'react'
import { pdf } from '@react-pdf/renderer'
import useJobseeker from './useJobseeker.js'
import ResumePDF from '../pages/ResumePDF.jsx'
import { createElement } from 'react'
export const emptyForm = {
    fullName: '', email: '', phone: '', location: '',
    linkedin: '', website: '', summary: '',
    experience: '', education: '', skills: '', languages: ''
}

const useResumeBuilder = () => {
    const { generateResume, loading } = useJobseeker()
    const [formData, setFormData] = useState(emptyForm)
    const [pdfReady, setPdfReady] = useState(false)
    const [error, setError] = useState('')

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleGenerate = async () => {
        setError('')
        if (!formData.fullName || !formData.email) {
            setError('Full name and email are required')
            return
        }
        try {
            const data = await generateResume(formData)
            setFormData(prev => ({ ...prev, summary: data.ai_summary }))
            setPdfReady(true)
        } catch (err) {
            setError('Failed to generate resume — try again')
        }
    }

    const handleDownload = async () => {
    const blob = await pdf(createElement(ResumePDF, { data: formData })).toBlob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${formData.fullName || 'resume'}_resume.pdf`
    a.click()
    URL.revokeObjectURL(url)
}

    const handleReset = () => {
        setFormData(emptyForm)
        setPdfReady(false)
        setError('')
    }

    return {
        formData,
        pdfReady,
        error,
        loading,
        handleChange,
        handleGenerate,
        handleDownload,
        handleReset
    }
}

export default useResumeBuilder