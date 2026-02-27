import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be used within AuthProvider')
    return context
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem('token')
        const role = localStorage.getItem('role')
        const name = localStorage.getItem('name')

        if (token && role && name) {
            setUser({ name, email: '', role })
        }
        setLoading(false)
    }, [])

    const login = async (email, password) => {
        try {
            const response = await authAPI.login({ email, password })
            const { token, role, name } = response.data

            localStorage.setItem('token', token)
            localStorage.setItem('role', role)
            localStorage.setItem('name', name)

            setUser({ name, email, role })
            return { success: true, role }
        } catch (error) {
            return { success: false, error: error.response?.data?.message || 'Login failed' }
        }
    }

    const register = async (name, email, password, role) => {
        try {
            await authAPI.register({ name, email, password, role })
            return { success: true }
        } catch (error) {
            return { success: false, error: error.response?.data?.message || 'Registration failed' }
        }
    }

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('role')
        localStorage.removeItem('name')
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    )
}