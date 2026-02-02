import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getHostVisits } from '../../services/api';
import Navbar from '../../components/Navbar';

const HostVisits = () => {
  const [hostVisits, setHostVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState({
    from: '',
    to: '',
  });

  useEffect(() => {
    fetchHostVisits();
  }, [dateRange]);

  const fetchHostVisits = async () => {
    try {
      setLoading(true);
      const params = {};
      if (dateRange.from) params.from = dateRange.from;
      if (dateRange.to) params.to = dateRange.to;

      const response = await getHostVisits(params);
      setHostVisits(response.data);
    } catch (err) {
      setError('Failed to fetch host visits');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getTotalVisits = () => {
    return hostVisits.reduce((sum, host) => sum + host.visits, 0);
  };

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-content">
        <aside className="sidebar">
          <h3 className="sidebar-title">Navigation</h3>
          <ul className="sidebar-menu">
            <li><Link to="/dashboard" className="menu-item">Dashboard</Link></li>
            <li><Link to="/reports/summary" className="menu-item">Summary</Link></li>
            <li><Link to="/reports/daily-visits" className="menu-item">Daily Visits</Link></li>
            <li><Link to="/reports/host-visits" className="menu-item active">Host Visits</Link></li>
          </ul>
        </aside>

        <main className="main-content">
          <h1 className="page-title">Host Visits Report</h1>

          {error && <div className="error-message">{error}</div>}

          {/* Date Range Filter */}
          <div className="filter-section">
            <div className="filter-group">
              <label className="form-label">From Date</label>
              <input
                type="date"
                value={dateRange.from}
                onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="filter-group">
              <label className="form-label">To Date</label>
              <input
                type="date"
                value={dateRange.to}
                onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          {loading ? (
            <div className="loading">Loading host visits...</div>
          ) : (
            <>
              {/* Summary Stats */}
              <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
                <div className="stat-card">
                  <h3>Total Hosts</h3>
                  <p className="stat-number">{hostVisits.length}</p>
                </div>

                <div className="stat-card">
                  <h3>Total Visits</h3>
                  <p className="stat-number stat-success">{getTotalVisits()}</p>
                </div>
              </div>

              {/* Host Visits Table */}
              <div className="report-card">
                <h2>Visits by Host</h2>
                {hostVisits.length === 0 ? (
                  <p className="empty-report">No host visit data available for the selected period</p>
                ) : (
                  <div className="table-container">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Rank</th>
                          <th>Host Name</th>
                          <th>Email</th>
                          <th>Number of Visits</th>
                          <th>Visual</th>
                        </tr>
                      </thead>
                      <tbody>
                        {hostVisits.map((host, index) => (
                          <tr key={host.hostId}>
                            <td><strong>#{index + 1}</strong></td>
                            <td>{host.hostName}</td>
                            <td>{host.hostEmail}</td>
                            <td>{host.visits}</td>
                            <td>
                              <div className="visit-bar-container">
                                <div
                                  className="visit-bar"
                                  style={{
                                    width: `${(host.visits / Math.max(...hostVisits.map(h => h.visits))) * 100}%`
                                  }}
                                >
                                  {host.visits}
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default HostVisits;
