import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setUser, logout } from '../auth.slice.js'
import axios from 'axios'
import API_URL from '../../../config/api.js'
import { logoutAPI } from '../services/auth.api.js'

const useAuth = () => {
    const { user, isLoading, error } = useSelector(state => state.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const login = async (formData) => {
        const res = await axios.post(`${API_URL}/api/auth/login`, formData, { withCredentials: true })
        if (res.data.token) localStorage.setItem('token', res.data.token)
        dispatch(setUser({
            id: res.data.user.id,
            name: res.data.user.name,
            email: res.data.user.email,
            role: res.data.user.role,
            job_alerts: res.data.user.job_alerts,
            cv_url: res.data.user.cv_url || '',
            cv_text: res.data.user.cv_text || '',
            location: res.data.user.location || '',
            phone: res.data.user.phone || '',
            avatar_url: res.data.user.avatar_url || '',
            // Profile fields
            bio: res.data.user.bio || '',
            skills: res.data.user.skills || [],
            education: res.data.user.education || [],
            experience: res.data.user.experience || [],
            preferred_location: res.data.user.preferred_location || '',
            preferred_category: res.data.user.preferred_category || '',
            expected_salary: res.data.user.expected_salary || 0,
            // Document verification
            document_status: res.data.user.document_status || 'none',
            document_type: res.data.user.document_type || 'none',
            document_reject_reason: res.data.user.document_reject_reason || '',
            is_verified_jobseeker: res.data.user.is_verified_jobseeker || false,
            profile_complete: res.data.user.profile_complete || false,
            is_email_verified: res.data.user.is_email_verified || false,
            createdAt: res.data.user.createdAt || '',
        }))
        return res.data.user
    }

    const register = async (formData, role) => {
        const url = role === 'employer'
            ? `${API_URL}/api/auth/register/employer`
            : `${API_URL}/api/auth/register/user`
        const res = await axios.post(url, formData, { withCredentials: true })
        dispatch(setUser({ ...res.data.user || res.data.employer, role }))
        return res.data
    }

    const logoutUser = async () => {
        try { await logoutAPI() } catch (err) { console.log(err) }
        finally {
            localStorage.removeItem('token')
            dispatch(logout())
            navigate('/login')
        }
    }

    const updateProfile = async (formData) => {
        const token = localStorage.getItem('token')
        const res = await axios.put(`${API_URL}/api/auth/update`, formData, {
            withCredentials: true,
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        })
        // Update Redux with returned user from backend
        if (res.data.user) {
            dispatch(setUser({ ...user, ...res.data.user }))
        } else {
            dispatch(setUser({ ...user, ...formData }))
        }
        return res.data
    }

    const uploadCV = async (file) => {
        const formData = new FormData()
        formData.append('cv', file)
        const token = localStorage.getItem('token')
        const res = await axios.post(`${API_URL}/api/auth/upload-cv`, formData, {
            withCredentials: true,
            headers: { 'Content-Type': 'multipart/form-data', ...(token ? { Authorization: `Bearer ${token}` } : {}) }
        })
        dispatch(setUser(res.data.user))
        return res.data
    }

    const deleteCV = async () => {
        const token = localStorage.getItem('token')
        const res = await axios.delete(`${API_URL}/api/auth/delete-cv`, {
            withCredentials: true,
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        })
        dispatch(setUser({ ...user, cv_url: '' }))
        return res.data
    }

    const sendOTP = async (email, role) => {
        const res = await axios.post(`${API_URL}/api/auth/send-otp`, { email, role })
        return res.data
    }

    const verifyOTP = async (email, otp, role) => {
        const res = await axios.post(`${API_URL}/api/auth/verify-otp`, { email, otp, role })
        if (res.data.token) localStorage.setItem('token', res.data.token)
        dispatch(setUser(res.data.user))
        return res.data.user
    }

    const updateJobAlerts = async (alertData) => {
        const token = localStorage.getItem('token')
        const res = await axios.put(`${API_URL}/api/auth/job-alerts`, alertData, {
            withCredentials: true,
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        })
        dispatch(setUser({ ...user, job_alerts: alertData }))
        return res.data
    }

    const handleCVUpload = async (file) => {
        if (!file) return
        const data = await uploadCV(file)
        dispatch(setUser({ ...user, cv_url: data.cv_url }))
        return true
    }

    const handleCVDelete = async () => {
        await deleteCV()
        return true
    }

    const handleAlertsSubmit = async (alerts) => {
        await updateJobAlerts(alerts)
        return true
    }

    const submitTestimonial = async (formData) => {
        const token = localStorage.getItem('token')
        const res = await axios.post(`${API_URL}/api/testimonials/submit`, formData, {
            withCredentials: true,
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        })
        return res.data
    }

    const uploadAvatar = async (file) => {
        const formData = new FormData()
        formData.append('avatar', file)
        const token = localStorage.getItem('token')
        const res = await axios.post(`${API_URL}/api/auth/upload-avatar`, formData, {
            withCredentials: true,
            headers: { 'Content-Type': 'multipart/form-data', ...(token ? { Authorization: `Bearer ${token}` } : {}) }
        })
        dispatch(setUser({ ...user, avatar_url: res.data.avatar_url, id: user.id || user._id }))
        return res.data
    }

    // ── DOCUMENT VERIFICATION ──────────────────────────
    const uploadDocument = async (docType, docNumber, file) => {
        const formData = new FormData()
        formData.append('document_type', docType)
        formData.append('document_number', docNumber)
        formData.append('document', file)
        const token = localStorage.getItem('token')
        const res = await axios.post(`${API_URL}/api/auth/upload-document`, formData, {
            withCredentials: true,
            headers: { 'Content-Type': 'multipart/form-data', ...(token ? { Authorization: `Bearer ${token}` } : {}) }
        })
        // Update document status in Redux
        dispatch(setUser({ ...user, document_status: 'pending', document_type: docType }))
        return res.data
    }
    const resetDocument = async (id) => {
    try {
        await axios.put(`${API_URL}/api/admin/documents/${id}/reset`, {}, getAuthHeaders())
        return true
    } catch (err) { return false }
}

    // Refresh user from backend — call after document submit
   const refreshUser = async () => {
    const token = localStorage.getItem('token')
    const res = await axios.get(`${API_URL}/api/auth/me`, {
        withCredentials: true,
        headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
    if (res.data.user) {
       
        dispatch(setUser({
            id: res.data.user._id,
            name: res.data.user.name,
            email: res.data.user.email,
            role: res.data.user.role,
            phone: res.data.user.phone || '',
            location: res.data.user.location || '',
            avatar_url: res.data.user.avatar_url || '',
            cv_url: res.data.user.cv_url || '',
            bio: res.data.user.bio || '',
            skills: res.data.user.skills || [],
            education: res.data.user.education || [],
            experience: res.data.user.experience || [],
            preferred_location: res.data.user.preferred_location || '',
            preferred_category: res.data.user.preferred_category || '',
            expected_salary: res.data.user.expected_salary || 0,
            document_status: res.data.user.document_status || 'none',
            document_type: res.data.user.document_type || 'none',
            is_verified_jobseeker: res.data.user.is_verified_jobseeker || false,
            profile_complete: res.data.user.profile_complete || false,
            is_email_verified: res.data.user.is_email_verified || false,
            job_alerts: res.data.user.job_alerts,
            createdAt: res.data.user.createdAt,
        }))
    }
    return res.data.user
}
    return {
        user, isLoading, error,
        login, register, logoutUser,
        updateProfile,
        uploadCV, deleteCV,
        sendOTP, verifyOTP,
        updateJobAlerts,
        handleCVUpload, handleCVDelete, handleAlertsSubmit,
        submitTestimonial,
        uploadAvatar,
        uploadDocument,
        refreshUser,
        resetDocument

    }
}

export default useAuth