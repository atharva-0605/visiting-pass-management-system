import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getVisitors, deleteVisitor } from '../../services/api';
import Navbar from '../../components/Navbar';

const VisitorList = () => {
  const navigate = useNavigate();
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchVisitors();
  }, []);

  const fetchVisitors = async () => {
    try {
      setLoading(true);
      const response = await getVisitors();
      setVisitors(response.data);
    } catch (err) {
      setError('Failed to fetch visitors');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this visitor?')) {
      return;
    }

    try {
      await deleteVisitor(id);
      fetchVisitors();
    } catch (err) {
      alert('Failed to delete visitor');
      console.error(err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

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
            <h1 className="page-title">Visitors</h1>
            <button onClick={() => navigate('/visitors/new')} className="btn-primary">
              Add Visitor
            </button>
          </div>

          {error && <div className="error-message">{error}</div>}

          {loading ? (
            <div className="loading">Loading visitors...</div>
          ) : visitors.length === 0 ? (
            <div className="empty-state">
              <p>No visitors found</p>
              <button onClick={() => navigate('/visitors/new')} className="btn-primary">
                Add First Visitor
              </button>
            </div>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Photo</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Company</th>
                    <th>ID Type</th>
                    <th>ID Number</th>
                    <th>Added On</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visitors.map((visitor) => (
                    <tr key={visitor._id}>
                      <td>
                        {visitor.photoUrl ? (
                          <img
                            src={`http://localhost:4000/${visitor.photoUrl}`}
                            alt={visitor.name}
                            className="visitor-photo"
                          />
                        ) : (
                          <div className="visitor-photo-placeholder">
                            {visitor.name.charAt(0)}
                          </div>
                        )}
                      </td>
                      <td>
                        <strong>{visitor.name}</strong>
                      </td>
                      <td>{visitor.email}</td>
                      <td>{visitor.phone}</td>
                      <td>{visitor.company}</td>
                      <td>{visitor.idType}</td>
                      <td>{visitor.idNumber}</td>
                      <td>{formatDate(visitor.createdAt)}</td>
                      <td>
                        <div className="action-buttons-inline">
                          <button
                            onClick={() => navigate(`/visitors/${visitor._id}`)}
                            className="btn-small btn-info"
                          >
                            View
                          </button>
                          <button
                            onClick={() => navigate(`/visitors/edit/${visitor._id}`)}
                            className="btn-small btn-success"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(visitor._id)}
                            className="btn-small btn-danger"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default VisitorList;
