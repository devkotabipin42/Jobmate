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

    return { user, isLoading, error, login, register, logoutUser, updateProfile }
}

export default useAuth