import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setUser, logout } from '../auth.slice.js'
import axios from 'axios'
import API_URL from '../../../config/api.js'

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
        dispatch(setUser(res.data.user))
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

    const logoutUser = () => {
        dispatch(logout())
        navigate('/login')
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

    return { user, isLoading, error, login, register, logoutUser, updateProfile,uploadCV, deleteCV }
}

export default useAuth