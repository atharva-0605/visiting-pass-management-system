import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getSummaryReport, fetchLiveVisitors } from '../services/api';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  // Live dashboard state
  const [liveData, setLiveData] = useState(null);
  const [liveLoading, setLiveLoading] = useState(true);
  const [liveError, setLiveError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    fetchSummary();
    fetchLive();

    const interval = setInterval(fetchLive, 30000); // 30 seconds
    return () => clearInterval(interval);
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

  const fetchLive = async () => {
    try {
      setLiveError('');
      const response = await fetchLiveVisitors();
      setLiveData(response.data); // { buildings, generatedAt }
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Error fetching live visitors:', error);
      setLiveError('Failed to load live visitors');
    } finally {
      setLiveLoading(false);
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

          {/* Live "Who's Inside Right Now" */}
          <section className="live-dashboard">
            <h2>Who&apos;s Inside Right Now</h2>
            <p className="live-meta">
              Auto-refresh every 30 seconds
              {lastUpdated && ` • Last updated at ${lastUpdated}`}
            </p>

            {liveLoading ? (
              <div className="loading">Loading live data...</div>
            ) : liveError ? (
              <div className="error">{liveError}</div>
            ) : !liveData || !liveData.buildings?.length ? (
              <div>No active visitors inside right now.</div>
            ) : (
              <div className="live-grid">
                {liveData.buildings.map((b) => (
                  <div key={b.building} className="live-card">
                    <h3>{b.building}</h3>
                    <p>Total inside: {b.total}</p>
                    <p className="live-on-time">On time: {b.onTime}</p>
                    <p className="live-approaching">
                      Approaching exit: {b.approachingExit}
                    </p>
                    <p className="live-overstay">Overstay: {b.overstay}</p>
                  </div>
                ))}
              </div>
            )}
          </section>

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
