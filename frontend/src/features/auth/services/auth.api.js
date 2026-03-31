import axios from 'axios'
import API_URL from '../../../config/api.js'
const api = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true,
})

// Request interceptor
api.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error)
)

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)
export const logoutAPI = async () => {
    const token = localStorage.getItem('token')
    const res = await axios.post(
        `${API_URL}/api/auth/logout`,
        {},
        {
            withCredentials: true,
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        }
    )
    return res.data
}
export default api