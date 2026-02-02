import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getVisitor, deleteVisitor } from '../../services/api';
import Navbar from '../../components/Navbar';

const VisitorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [visitor, setVisitor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchVisitor();
  }, [id]);

  const fetchVisitor = async () => {
    try {
      setLoading(true);
      const response = await getVisitor(id);
      setVisitor(response.data);
    } catch (err) {
      setError('Failed to fetch visitor details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this visitor?')) {
      return;
    }

    try {
      await deleteVisitor(id);
      navigate('/visitors');
    } catch (err) {
      alert('Failed to delete visitor');
      console.error(err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <Navbar />
        <div className="loading">Loading visitor details...</div>
      </div>
    );
  }

  if (error || !visitor) {
    return (
      <div className="dashboard-container">
        <Navbar />
        <div className="error-message">{error || 'Visitor not found'}</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-content">
        <aside className="sidebar">
          <h3 className="sidebar-title">Navigation</h3>
          <ul className="sidebar-menu">
            <li><Link to="/dashboard" className="menu-item">Dashboard</Link></li>
            <li><Link to="/visitors" className="menu-item active">Visitors</Link></li>
            <li><Link to="/appointments" className="menu-item">Appointments</Link></li>
            <li><Link to="/passes" className="menu-item">Passes</Link></li>
          </ul>
        </aside>

        <main className="main-content">
          <div className="page-header">
            <h1 className="page-title">Visitor Details</h1>
            <div className="header-actions">
              <button onClick={() => navigate('/visitors')} className="btn-secondary">
                Back to List
              </button>
              <button onClick={() => navigate(`/visitors/edit/${id}`)} className="btn-primary">
                Edit
              </button>
              <button onClick={handleDelete} className="btn-danger">
                Delete
              </button>
            </div>
          </div>

          <div className="detail-card">
            <div className="detail-header">
              <div className="visitor-header-info">
                {visitor.photoUrl ? (
                  <img
                    src={`http://localhost:4000/${visitor.photoUrl}`}
                    alt={visitor.name}
                    className="visitor-detail-photo"
                  />
                ) : (
                  <div className="visitor-detail-photo-placeholder">
                    {visitor.name.charAt(0)}
                  </div>
                )}
                <h2>{visitor.name}</h2>
              </div>
            </div>

            <div className="detail-grid">
              <div className="detail-item">
                <label>Email</label>
                <p>{visitor.email}</p>
              </div>

              <div className="detail-item">
                <label>Phone</label>
                <p>{visitor.phone}</p>
              </div>

              <div className="detail-item">
                <label>Company</label>
                <p>{visitor.company}</p>
              </div>

              <div className="detail-item">
                <label>ID Type</label>
                <p>{visitor.idType}</p>
              </div>

              <div className="detail-item">
                <label>ID Number</label>
                <p>{visitor.idNumber}</p>
              </div>

              <div className="detail-item">
                <label>Created By</label>
                <p>{visitor.createdBy?.name || 'N/A'}</p>
              </div>

              <div className="detail-item">
                <label>Added On</label>
                <p>{formatDate(visitor.createdAt)}</p>
              </div>

              <div className="detail-item">
                <label>Last Updated</label>
                <p>{formatDate(visitor.updatedAt)}</p>
              </div>
            </div>

            <div className="detail-actions">
              <h3>Quick Actions</h3>
              <div className="action-buttons">
                <button
                  onClick={() => navigate(`/appointments/new?visitorId=${visitor._id}`)}
                  className="btn-primary"
                >
                  Create Appointment
                </button>
                <button
                  onClick={() => navigate(`/passes/new?visitorId=${visitor._id}`)}
                  className="btn-primary"
                >
                  Issue Pass
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default VisitorDetail;
