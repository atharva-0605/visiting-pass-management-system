import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { getPasses, deletePass } from '../../services/api';
import Navbar from '../../components/Navbar';

const PassList = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [passes, setPasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState({
    status: '',
    host: '',
    visitor: '',
  });

  useEffect(() => {
    fetchPasses();
  }, [filter]);

  const fetchPasses = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filter.status) params.status = filter.status;
      if (filter.host) params.host = filter.host;
      if (filter.visitor) params.visitor = filter.visitor;

      const response = await getPasses(params);
      setPasses(response.data);
    } catch (err) {
      setError('Failed to fetch passes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this pass?')) {
      return;
    }

    try {
      await deletePass(id);
      fetchPasses();
    } catch (err) {
      alert('Failed to delete pass');
      console.error(err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'active':
        return 'status-approved';
      case 'expired':
        return 'status-rejected';
      case 'checkedOut':
        return 'status-cancelled';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return 'status-pending';
    }
  };

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-content">
        <aside className="sidebar">
          <h3 className="sidebar-title">Navigation</h3>
          <ul className="sidebar-menu">
            <li><Link to="/dashboard" className="menu-item">Dashboard</Link></li>
            <li><Link to="/visitors" className="menu-item">Visitors</Link></li>
            <li><Link to="/appointments" className="menu-item">Appointments</Link></li>
            <li><Link to="/passes" className="menu-item active">Passes</Link></li>
          </ul>
        </aside>

        <main className="main-content">
          <div className="page-header">
            <h1 className="page-title">Visitor Passes</h1>
            <button onClick={() => navigate('/passes/new')} className="btn-primary">
              Issue Pass
            </button>
          </div>

          {error && <div className="error-message">{error}</div>}

          {/* Filters */}
          <div className="filter-section">
            <div className="filter-group">
              <label className="form-label">Status</label>
              <select
                value={filter.status}
                onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                className="form-input"
              >
                <option value="">All</option>
                <option value="active">Active</option>
                <option value="expired">Expired</option>
                <option value="checkedOut">Checked Out</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="loading">Loading passes...</div>
          ) : passes.length === 0 ? (
            <div className="empty-state">
              <p>No passes found</p>
              <button onClick={() => navigate('/passes/new')} className="btn-primary">
                Issue First Pass
              </button>
            </div>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Pass Number</th>
                    <th>Visitor</th>
                    <th>Host</th>
                    <th>Valid From</th>
                    <th>Valid To</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {passes.map((pass) => (
                    <tr key={pass._id}>
                      <td>
                        <span className="pass-number">{pass.passNumber}</span>
                      </td>
                      <td>
                        <div className="visitor-info">
                          <strong>{pass.visitor?.name}</strong>
                          <small>{pass.visitor?.company}</small>
                        </div>
                      </td>
                      <td>{pass.host?.name}</td>
                      <td>{formatDate(pass.validFrom)}</td>
                      <td>{formatDate(pass.validTo)}</td>
                      <td>
                        <span className={`status-badge ${getStatusClass(pass.status)}`}>
                          {pass.status}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons-inline">
                          <button
                            onClick={() => navigate(`/passes/${pass._id}`)}
                            className="btn-small btn-info"
                          >
                            View
                          </button>

                          <button
                            onClick={() => handleDelete(pass._id)}
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

export default PassList;
