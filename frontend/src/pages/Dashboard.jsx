import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getSummaryReport } from '../services/api';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const response = await getSummaryReport();
      setSummary(response.data);
    } catch (error) {
      console.error('Error fetching summary:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="dashboard-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-brand">
          <h2>Visitor Pass Management</h2>
        </div>
        <div className="navbar-user">
          <span className="user-name">{user?.name}</span>
          <span className="user-role">({user?.role})</span>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </nav>

      <div className="dashboard-content">
        {/* Sidebar */}
        <aside className="sidebar">
          <h3 className="sidebar-title">Navigation</h3>
          <ul className="sidebar-menu">
            <li>
              <Link to="/dashboard" className="menu-item active">
                Dashboard
              </Link>
            </li>

            {(user?.role === 'admin' || user?.role === 'employee') && (
              <>
                <li>
                  <Link to="/visitors" className="menu-item">
                    Visitors
                  </Link>
                </li>
                <li>
                  <Link to="/appointments" className="menu-item">
                    Appointments
                  </Link>
                </li>
                <li>
                  <Link to="/passes" className="menu-item">
                    Passes
                  </Link>
                </li>
              </>
            )}

            {user?.role === 'security' && (
              <>
                <li>
                  <Link to="/scan" className="menu-item">
                    Scan Pass
                  </Link>
                </li>
                <li>
                  <Link to="/checklogs" className="menu-item">
                    Check Logs
                  </Link>
                </li>
              </>
            )}

            {user?.role === 'admin' && (
              <>
                <li>
                  <Link to="/checklogs" className="menu-item">
                    Check Logs
                  </Link>
                </li>
                <li>
                  <Link to="/reports" className="menu-item">
                    Reports
                  </Link>
                </li>
              </>
            )}
          </ul>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          <h1 className="page-title">Dashboard</h1>

          <div className="welcome-card">
            <h2>Welcome, {user?.name}!</h2>
            <p>Email: {user?.email}</p>
            <p>Department: {user?.department || 'N/A'}</p>
            <p>Phone: {user?.phone || 'N/A'}</p>
          </div>

          {loading ? (
            <div className="loading">Loading statistics...</div>
          ) : (
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Passes</h3>
                <p className="stat-number">{summary?.totalPasses || 0}</p>
              </div>

              <div className="stat-card">
                <h3>Active Passes</h3>
                <p className="stat-number">{summary?.activePasses || 0}</p>
              </div>

              <div className="stat-card">
                <h3>Check-Ins Today</h3>
                <p className="stat-number">{summary?.totalCheckIns || 0}</p>
              </div>

              <div className="stat-card">
                <h3>Check-Outs Today</h3>
                <p className="stat-number">{summary?.totalCheckOuts || 0}</p>
              </div>
            </div>
          )}

          {/* Role-specific quick actions */}
          <div className="quick-actions">
            <h3>Quick Actions</h3>
            <div className="action-buttons">
              {(user?.role === 'admin' || user?.role === 'employee') && (
                <>
                  <button
                    onClick={() => navigate('/visitors')}
                    className="btn-action"
                  >
                    Add Visitor
                  </button>
                  <button
                    onClick={() => navigate('/appointments')}
                    className="btn-action"
                  >
                    Create Appointment
                  </button>
                  <button
                    onClick={() => navigate('/passes')}
                    className="btn-action"
                  >
                    Issue Pass
                  </button>
                </>
              )}

              {user?.role === 'security' && (
                <button
                  onClick={() => navigate('/scan')}
                  className="btn-action"
                >
                  Scan Pass
                </button>
              )}

              {user?.role === 'admin' && (
                <button
                  onClick={() => navigate('/reports')}
                  className="btn-action"
                >
                  View Reports
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
