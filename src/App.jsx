import { Routes, Route } from 'react-router-dom'
import Login from './components/Auth/login'
import Register from './components/Auth/register'
import StudentDashboard from './components/Student/StudentDashboard'
import AdminDashboard from './components/Admin/AdminDashboard'
import ProtectedRoute from './components/Layout/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/student-dashboard"
        element={
          <ProtectedRoute requiredRole="student">
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App