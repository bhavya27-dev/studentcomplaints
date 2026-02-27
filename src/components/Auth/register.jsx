import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Form, Button, Container, Card, Alert } from 'react-bootstrap'

const Register = () => {
    const navigate = useNavigate()
    const { register } = useAuth()
    const [formData, setFormData] = useState({
        name: '',
        password: '',
        role: 'student'
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        // Use a dummy email since backend might require it
        const dummyEmail = `${formData.name}@student.com`.replace(/\s+/g, '').toLowerCase()

        const result = await register(
            formData.name,
            dummyEmail,
            formData.password,
            formData.role
        )

        if (result.success) {
            alert('Registration successful! Please login.')
            navigate('/')
        } else {
            setError(result.error || 'Registration failed')
        }

        setLoading(false)
    }

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <Card style={{ width: '400px' }} className="shadow">
                <Card.Body>
                    <h2 className="text-center mb-4">Student Registration</h2>

                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter username"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Role</Form.Label>
                            <Form.Select
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            >
                                <option value="student">Student</option>

                            </Form.Select>
                        </Form.Group>

                        <Button
                            variant="success"
                            type="submit"
                            className="w-100"
                            disabled={loading}
                        >
                            {loading ? 'Registering...' : 'Register'}
                        </Button>
                    </Form>

                    <div className="text-center mt-3">
                        <Link to="/">Already have account? Login</Link>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    )
}

export default Register