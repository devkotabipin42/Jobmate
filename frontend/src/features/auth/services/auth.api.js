import axios from 'axios'

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
            // Token expired — logout karo
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

export default api