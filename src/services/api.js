import axios from 'axios'

// Your friend's backend URL - change this when backend is ready
const API_URL = 'http://localhost:3000/api'

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})

// Add token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

export const authAPI = {
    login: (data) => api.post('/auth/login', data),
    register: (data) => api.post('/auth/register', data)
}

export const complaintAPI = {
    // Student
    create: (data) => api.post('/complaints', data),
    getMyComplaints: () => api.get('/complaints/my'),

    // Admin
    getAll: (filters) => api.get('/complaints', { params: filters }),
    updateStatus: (id, status) => api.put(`/complaints/${id}`, { status })
}

export default api