import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSummaryReport, getDailyVisits } from '../../services/api';
import Navbar from '../../components/Navbar';

const Summary = () => {
  const [summary, setSummary] = useState(null);
  const [dailyVisits, setDailyVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState({
    from: '',
    to: '',
  });

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = {};
      if (dateRange.from) params.from = dateRange.from;
      if (dateRange.to) params.to = dateRange.to;

      const [summaryRes, dailyRes] = await Promise.all([
        getSummaryReport(params),
        getDailyVisits(params),
      ]);

      setSummary(summaryRes.data);
      setDailyVisits(dailyRes.data);
    } catch (err) {
      setError('Failed to fetch summary report');
      console.error(err);
    } finally {
      setLoading(false);
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
            <li><Link to="/reports/summary" className="menu-item active">Summary</Link></li>
            <li><Link to="/reports/daily-visits" className="menu-item">Daily Visits</Link></li>
            <li><Link to="/reports/host-visits" className="menu-item">Host Visits</Link></li>
          </ul>
        </aside>

        <main className="main-content">
          <h1 className="page-title">Summary Report</h1>

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
            <div className="loading">Loading report...</div>
          ) : (
            <>
              {/* Summary Cards */}
              <div className="stats-grid">
                <div className="stat-card">
                  <h3>Total Passes</h3>
                  <p className="stat-number">{summary?.totalPasses || 0}</p>
                </div>

                <div className="stat-card">
                  <h3>Active Passes</h3>
                  <p className="stat-number stat-success">{summary?.activePasses || 0}</p>
                </div>

                <div className="stat-card">
                  <h3>Check-Ins</h3>
                  <p className="stat-number stat-info">{summary?.totalCheckIns || 0}</p>
                </div>

                <div className="stat-card">
                  <h3>Check-Outs</h3>
                  <p className="stat-number stat-warning">{summary?.totalCheckOuts || 0}</p>
                </div>
              </div>

              {/* Daily Visits Chart */}
              <div className="report-card">
                <h2>Daily Visits Breakdown</h2>
                {dailyVisits.length === 0 ? (
                  <p className="empty-report">No visit data available for the selected period</p>
                ) : (
                  <div className="chart-container">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Number of Visits</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dailyVisits.map((day) => (
                          <tr key={day._id}>
                            <td>{day._id}</td>
                            <td>
                              <div className="visit-bar-container">
                                <div
                                  className="visit-bar"
                                  style={{
                                    width: `${(day.count / Math.max(...dailyVisits.map(d => d.count))) * 100}%`
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

export default Summary;
