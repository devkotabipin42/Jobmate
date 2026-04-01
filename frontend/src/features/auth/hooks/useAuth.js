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
    const res = await axios.post(
        `${API_URL}/api/auth/login`,
        formData,
        { withCredentials: true }
    )
    if (res.data.token) {
        localStorage.setItem('token', res.data.token)
    }
    dispatch(setUser({
        id: res.data.user.id,
        name: res.data.user.name,
        email: res.data.user.email,
        role: res.data.user.role,
        job_alerts: res.data.user.job_alerts
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
    try {
        await logoutAPI()
    } catch (err) {
        console.log(err)
    } finally {
        localStorage.removeItem('token')
        dispatch(logout())
        navigate('/login')
    }
}

    const updateProfile = async (formData) => {
        const res = await axios.put(
            `${API_URL}/api/auth/update`,
            formData,
            { withCredentials: true }
        )
        dispatch(setUser({ ...user, ...formData }))
        return res.data
    }
    const uploadCV = async (file) => {
    const formData = new FormData()
    formData.append('cv', file)
    const token = localStorage.getItem('token')
    const res = await axios.post(
        `${API_URL}/api/auth/upload-cv`,
        formData,
        {
            withCredentials: true,
            headers: {
                'Content-Type': 'multipart/form-data',
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            }
        }
    )
    dispatch(setUser({ ...user, cv_url: res.data.cv_url }))
    return res.data
}
    const deleteCV = async () => {
    const token = localStorage.getItem('token')
    const res = await axios.delete(
        `${API_URL}/api/auth/delete-cv`,
        {
            withCredentials: true,
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        }
    )
    dispatch(setUser({ ...user, cv_url: '' }))
    return res.data
}
const sendOTP = async (email, role) => {
    const res = await axios.post(`${API_URL}/api/auth/send-otp`, { email, role })
    return res.data
}

const verifyOTP = async (email, otp, role) => {
    const res = await axios.post(`${API_URL}/api/auth/verify-otp`, { email, otp, role })
    if (res.data.token) {
        localStorage.setItem('token', res.data.token)
    }
    dispatch(setUser(res.data.user))
    return res.data.user
}

    const updateJobAlerts = async (alertData) => {
    const token = localStorage.getItem('token')
    const res = await axios.put(
        `${API_URL}/api/auth/job-alerts`,
        alertData,
        {
            withCredentials: true,
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        }
    )
    dispatch(setUser({ ...user, job_alerts: alertData }))
    return res.data
}

const handleCVUpload = async (file) => {
    if (!file) return
    try {
        const data = await uploadCV(file)
        dispatch(setUser({ ...user, cv_url: data.cv_url }))
        return true
    } catch (err) {
        throw err
    }
}

const handleCVDelete = async () => {
    try {
        await deleteCV()
        return true
    } catch (err) {
        throw err
    }
}

const handleAlertsSubmit = async (alerts) => {
    try {
        await updateJobAlerts(alerts)
        return true
    } catch (err) {
        throw err
    }
}
const submitTestimonial = async (formData) => {
    const token = localStorage.getItem('token')
    const res = await axios.post(
        `${API_URL}/api/testimonials/submit`,
        formData,
        {
            withCredentials: true,
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        }
    )
    return res.data
}
    return { user, isLoading, error, login, register, logoutUser, updateProfile,uploadCV, deleteCV, sendOTP, verifyOTP, updateJobAlerts, handleCVUpload, handleCVDelete, handleAlertsSubmit, submitTestimonial }
}

export default useAuth