import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { getCheckLogs, deleteCheckLog } from '../../services/api';
import Navbar from '../../components/Navbar';

const CheckLogList = () => {
  const { user } = useContext(AuthContext);
  const [checkLogs, setCheckLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState({
    action: '',
    pass: '',
  });

  useEffect(() => {
    fetchCheckLogs();
  }, [filter]);

  const fetchCheckLogs = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filter.action) params.action = filter.action;
      if (filter.pass) params.pass = filter.pass;

      const response = await getCheckLogs(params);
      setCheckLogs(response.data);
    } catch (err) {
      setError('Failed to fetch check logs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this log?')) {
      return;
    }

    try {
      await deleteCheckLog(id);
      fetchCheckLogs();
    } catch (err) {
      alert('Failed to delete check log');
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

  const getActionClass = (action) => {
    return action === 'IN' ? 'action-in' : 'action-out';
  };

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-content">
        <aside className="sidebar">
          <h3 className="sidebar-title">Navigation</h3>
          <ul className="sidebar-menu">
            <li><Link to="/dashboard" className="menu-item">Dashboard</Link></li>
            {user?.role === 'security' && (
              <li><Link to="/scan" className="menu-item">Scan Pass</Link></li>
            )}
            <li><Link to="/checklogs" className="menu-item active">Check Logs</Link></li>
            {user?.role === 'admin' && (
              <li><Link to="/reports" className="menu-item">Reports</Link></li>
            )}
          </ul>
        </aside>

        <main className="main-content">
          <div className="page-header">
            <h1 className="page-title">Check Logs</h1>
            {user?.role === 'security' && (
              <Link to="/scan" className="btn-primary">
                Scan Pass
              </Link>
            )}
          </div>

          {error && <div className="error-message">{error}</div>}

          {/* Filters */}
          <div className="filter-section">
            <div className="filter-group">
              <label className="form-label">Action</label>
              <select
                value={filter.action}
                onChange={(e) => setFilter({ ...filter, action: e.target.value })}
                className="form-input"
              >
                <option value="">All</option>
                <option value="IN">Check In</option>
                <option value="OUT">Check Out</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="loading">Loading check logs...</div>
          ) : checkLogs.length === 0 ? (
            <div className="empty-state">
              <p>No check logs found</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Visitor</th>
                    <th>Pass Number</th>
                    <th>Action</th>
                    <th>Gate</th>
                    <th>Security Officer</th>
                    <th>Time</th>
                    {user?.role === 'admin' && <th>Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {checkLogs.map((log) => (
                    <tr key={log._id}>
                      <td>
                        <div className="visitor-info">
                          <strong>{log.pass?.visitor?.name}</strong>
                          <small>{log.pass?.visitor?.company}</small>
                        </div>
                      </td>
                      <td>
                        <span className="pass-number">{log.pass?.passNumber}</span>
                      </td>
                      <td>
                        <span className={`action-badge ${getActionClass(log.action)}`}>
                          {log.action}
                        </span>
                      </td>
                      <td>{log.gate || 'N/A'}</td>
                      <td>{log.securityUser?.name || 'System'}</td>
                      <td>{formatDate(log.createdAt)}</td>
                      {user?.role === 'admin' && (
                        <td>
                          <button
                            onClick={() => handleDelete(log._id)}
                            className="btn-small btn-danger"
                          >
                            Delete
                          </button>
                        </td>
                      )}
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

export default CheckLogList;
