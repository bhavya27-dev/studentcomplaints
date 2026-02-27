import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { complaintAPI } from '../../services/api'
import { Container, Row, Col, Card, Button, Table, Form, Badge } from 'react-bootstrap'

const AdminDashboard = () => {
    const navigate = useNavigate()
    const { user, logout } = useAuth()
    const [complaints, setComplaints] = useState([])
    const [filters, setFilters] = useState({
        category: 'All',
        status: 'All'
    })
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchComplaints()
    }, [])

    useEffect(() => {
        fetchComplaints()
    }, [filters])

    const fetchComplaints = async () => {
        setLoading(true)
        try {
            const params = {}
            if (filters.category !== 'All') params.category = filters.category
            if (filters.status !== 'All') params.status = filters.status

            const response = await complaintAPI.getAll(params)
            setComplaints(response.data)
        } catch (error) {
            console.error('Error fetching complaints:', error)
        }
        setLoading(false)
    }

    const updateStatus = async (id, newStatus) => {
        try {
            await complaintAPI.updateStatus(id, newStatus)
            fetchComplaints()
        } catch (error) {
            alert('Failed to update status')
        }
    }

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    const getStatusBadge = (status) => {
        const colors = {
            'Pending': 'secondary',
            'In Progress': 'info',
            'Resolved': 'success'
        }
        return colors[status] || 'secondary'
    }

    const getPriorityBadge = (priority) => {
        const colors = {
            'Low': 'success',
            'Medium': 'warning',
            'High': 'danger'
        }
        return colors[priority] || 'secondary'
    }

    return (
        <Container className="mt-4" fluid>
            <Row className="mb-4">
                <Col>
                    <Card>
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h1>Admin Dashboard</h1>
                                    <p className="text-muted">Welcome, {user?.name}!</p>
                                </div>
                                <Button variant="danger" onClick={handleLogout}>Logout</Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="mb-4">
                <Col>
                    <Card>
                        <Card.Header>
                            <h3 className="mb-0">Filter Complaints</h3>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>Category</Form.Label>
                                        <Form.Select
                                            value={filters.category}
                                            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                                        >
                                            <option value="All">All Categories</option>
                                            <option value="Electrical">Electrical</option>
                                            <option value="Plumbing">Plumbing</option>
                                            <option value="Furniture">Furniture</option>
                                            <option value="Cleaning">Cleaning</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>Status</Form.Label>
                                        <Form.Select
                                            value={filters.status}
                                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                        >
                                            <option value="All">All Status</option>
                                            <option value="Pending">Pending</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Resolved">Resolved</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Card>
                        <Card.Header>
                            <h3 className="mb-0">All Complaints</h3>
                        </Card.Header>
                        <Card.Body>
                            {loading ? (
                                <p className="text-center">Loading...</p>
                            ) : complaints.length === 0 ? (
                                <p className="text-muted text-center">No complaints found</p>
                            ) : (
                                <Table striped bordered hover responsive>
                                    <thead>
                                        <tr>
                                            <th>Student</th>
                                            <th>Category</th>
                                            <th>Description</th>
                                            <th>Priority</th>
                                            <th>Status</th>
                                            <th>Date</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {complaints.map((complaint) => (
                                            <tr key={complaint.id}>
                                                <td>{complaint.studentName}</td>
                                                <td>{complaint.category}</td>
                                                <td>{complaint.description}</td>
                                                <td>
                                                    <Badge bg={getPriorityBadge(complaint.priority)}>
                                                        {complaint.priority}
                                                    </Badge>
                                                </td>
                                                <td>
                                                    <Form.Select
                                                        size="sm"
                                                        value={complaint.status}
                                                        onChange={(e) => updateStatus(complaint.id, e.target.value)}
                                                        style={{ width: '130px' }}
                                                    >
                                                        <option value="Pending">Pending</option>
                                                        <option value="In Progress">In Progress</option>
                                                        <option value="Resolved">Resolved</option>
                                                    </Form.Select>
                                                </td>
                                                <td>{new Date(complaint.createdAt).toLocaleDateString()}</td>
                                                <td>
                                                    <Button
                                                        variant="primary"
                                                        size="sm"
                                                        onClick={() => updateStatus(complaint.id, 'In Progress')}
                                                    >
                                                        Start
                                                    </Button>
                                                </td>
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

export default AdminDashboard