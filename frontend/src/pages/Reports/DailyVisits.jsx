import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDailyVisits } from '../../services/api';
import Navbar from '../../components/Navbar';

const DailyVisits = () => {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState({
    from: '',
    to: '',
  });

  useEffect(() => {
    fetchDailyVisits();
  }, [dateRange]);

  const fetchDailyVisits = async () => {
    try {
      setLoading(true);
      const params = {};
      if (dateRange.from) params.from = dateRange.from;
      if (dateRange.to) params.to = dateRange.to;

      const response = await getDailyVisits(params);
      setVisits(response.data);
    } catch (err) {
      setError('Failed to fetch daily visits');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getTotalVisits = () => {
    return visits.reduce((sum, day) => sum + day.count, 0);
  };

  const getAverageVisits = () => {
    if (visits.length === 0) return 0;
    return (getTotalVisits() / visits.length).toFixed(1);
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
            <li><Link to="/reports/daily-visits" className="menu-item active">Daily Visits</Link></li>
            <li><Link to="/reports/host-visits" className="menu-item">Host Visits</Link></li>
          </ul>
        </aside>

        <main className="main-content">
          <h1 className="page-title">Daily Visits Report</h1>

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
            <div className="loading">Loading daily visits...</div>
          ) : (
            <>
              {/* Summary Stats */}
              <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                <div className="stat-card">
                  <h3>Total Days</h3>
                  <p className="stat-number">{visits.length}</p>
                </div>

                <div className="stat-card">
                  <h3>Total Visits</h3>
                  <p className="stat-number stat-success">{getTotalVisits()}</p>
                </div>

                <div className="stat-card">
                  <h3>Average Visits/Day</h3>
                  <p className="stat-number stat-info">{getAverageVisits()}</p>
                </div>
              </div>

              {/* Daily Visits Table */}
              <div className="report-card">
                <h2>Daily Breakdown</h2>
                {visits.length === 0 ? (
                  <p className="empty-report">No visit data available for the selected period</p>
                ) : (
                  <div className="table-container">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Number of Visits</th>
                          <th>Visual</th>
                        </tr>
                      </thead>
                      <tbody>
                        {visits.map((day) => (
                          <tr key={day._id}>
                            <td><strong>{day._id}</strong></td>
                            <td>{day.count}</td>
                            <td>
                              <div className="visit-bar-container">
                                <div
                                  className="visit-bar"
                                  style={{
                                    width: `${(day.count / Math.max(...visits.map(d => d.count))) * 100}%`
                                  }}
                                >
                                  {day.count}
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

export default DailyVisits;
