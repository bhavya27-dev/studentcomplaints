import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { complaintAPI } from '../../services/api'
import { Container, Row, Col, Card, Button, Form, Table, Alert } from 'react-bootstrap'

const StudentDashboard = () => {
    const navigate = useNavigate()
    const { user, logout } = useAuth()
    const [complaints, setComplaints] = useState([])
    const [formData, setFormData] = useState({
        category: 'Electrical',
        description: '',
        priority: 'Medium'
    })
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')

    useEffect(() => {
        fetchComplaints()
    }, [])

    const fetchComplaints = async () => {
        try {
            const response = await complaintAPI.getMyComplaints()
            setComplaints(response.data)
        } catch (error) {
            console.error('Error fetching complaints:', error)
        }
    }

    const handleSubmit = async () => {
        if (!formData.description) {
            setError('Please describe your complaint')
            return
        }

        setLoading(true)
        setError('')
        setSuccess('')

        try {
            await complaintAPI.create(formData)
            setSuccess('Complaint submitted successfully!')
            setFormData({ category: 'Electrical', description: '', priority: 'Medium' })
            fetchComplaints()
        } catch (error) {
            setError('Failed to submit complaint')
        }
        setLoading(false)
    }

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    return (
        <Container className="mt-4">
            <Row className="mb-4">
                <Col>
                    <Card>
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h1>Welcome, {user?.name}!</h1>
                                    <p className="text-muted">Role: Student</p>
                                </div>
                                <Button variant="danger" onClick={handleLogout}>Logout</Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="mb-4">
                <Col md={12}>
                    <Card>
                        <Card.Header>
                            <h3 className="mb-0">Submit New Complaint</h3>
                        </Card.Header>
                        <Card.Body>
                            {error && <Alert variant="danger">{error}</Alert>}
                            {success && <Alert variant="success">{success}</Alert>}

                            <Form>
                                <Row>
                                    <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Category</Form.Label>
                                            <Form.Select
                                                value={formData.category}
                                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            >
                                                <option>Electrical</option>
                                                <option>Plumbing</option>
                                                <option>Furniture</option>
                                                <option>Cleaning</option>
                                                <option>Other</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>

                                    <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Priority</Form.Label>
                                            <Form.Select
                                                value={formData.priority}
                                                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                            >
                                                <option>Low</option>
                                                <option>Medium</option>
                                                <option>High</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Describe your complaint in detail..."
                                    />
                                </Form.Group>

                                <Button
                                    variant="primary"
                                    onClick={handleSubmit}
                                    disabled={loading}
                                >
                                    {loading ? 'Submitting...' : 'Submit Complaint'}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Card>
                        <Card.Header>
                            <h3 className="mb-0">My Complaints</h3>
                        </Card.Header>
                        <Card.Body>
                            {complaints.length === 0 ? (
                                <p className="text-muted">No complaints found</p>
                            ) : (
                                <Table striped bordered hover responsive>
                                    <thead>
                                        <tr>
                                            <th>Category</th>
                                            <th>Description</th>
                                            <th>Priority</th>
                                            <th>Status</th>
                                            <th>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {complaints.map((complaint) => (
                                            <tr key={complaint.id}>
                                                <td>{complaint.category}</td>
                                                <td>{complaint.description}</td>
                                                <td>
                                                    <span className={`badge bg-${complaint.priority === 'High' ? 'danger' :
                                                        complaint.priority === 'Medium' ? 'warning' : 'success'
                                                        }`}>
                                                        {complaint.priority}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={`badge bg-${complaint.status === 'Resolved' ? 'success' :
                                                        complaint.status === 'In Progress' ? 'info' : 'secondary'
                                                        }`}>
                                                        {complaint.status}
                                                    </span>
                                                </td>
                                                <td>{new Date(complaint.createdAt).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

export default StudentDashboard