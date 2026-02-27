import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const ProtectedRoute = ({ children, requiredRole }) => {
    const { user, loading } = useAuth()

    if (loading) {
        return <div style={styles.loading}>Loading...</div>
    }

    if (!user) {
        return <Navigate to="/" />
    }

    if (requiredRole && user.role !== requiredRole) {
        return <Navigate to="/" />
    }

    return children
}

const styles = {
    loading: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        fontSize: '18px',
        color: '#666'
    }
}

export default ProtectedRoute