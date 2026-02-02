import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { scanPass } from '../../services/api';
import Navbar from '../../components/Navbar';

const ScanPass = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [passId, setPassId] = useState('');
  const [gate, setGate] = useState('Main Gate');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(null);
    setLoading(true);

    try {
      const response = await scanPass({ passId, gate });
      setSuccess(response.data);
      setPassId('');
      
      setTimeout(() => {
        navigate('/checklogs');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to scan pass');
    } finally {
      setLoading(false);
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

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-content">
        <aside className="sidebar">
          <h3 className="sidebar-title">Navigation</h3>
          <ul className="sidebar-menu">
            <li><Link to="/dashboard" className="menu-item">Dashboard</Link></li>
            <li><Link to="/scan" className="menu-item active">Scan Pass</Link></li>
            <li><Link to="/checklogs" className="menu-item">Check Logs</Link></li>
          </ul>
        </aside>

        <main className="main-content">
          <h1 className="page-title">Scan Visitor Pass</h1>

          <div className="scan-container">
            <div className="scan-card">
              <div className="scan-icon">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2"/>
                  <line x1="3" y1="9" x2="21" y2="9" strokeWidth="2"/>
                  <line x1="3" y1="15" x2="21" y2="15" strokeWidth="2"/>
                </svg>
              </div>

              <h2>Scan QR Code or Enter Pass ID</h2>
              <p className="scan-instruction">
                Enter the Pass ID manually or scan the QR code
              </p>

              {error && <div className="error-message">{error}</div>}

              {success && (
                <div className="success-message">
                  <h3>✓ {success.message}</h3>
                  <div className="scan-result">
                    <p><strong>Visitor:</strong> {success.pass?.visitor?.name}</p>
                    <p><strong>Company:</strong> {success.pass?.visitor?.company}</p>
                    <p><strong>Pass Number:</strong> {success.pass?.passNumber}</p>
                    <p><strong>Action:</strong> <span className={success.action === 'IN' ? 'action-in' : 'action-out'}>{success.action}</span></p>
                    <p><strong>Time:</strong> {formatDate(new Date())}</p>
                  </div>
                  <p className="redirect-info">Redirecting to logs in 3 seconds...</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="scan-form">
                <div className="form-group">
                  <label className="form-label">Pass ID *</label>
                  <input
                    type="text"
                    value={passId}
                    onChange={(e) => setPassId(e.target.value)}
                    required
                    className="form-input"
                    placeholder="Enter Pass ID (e.g., 69637b4673fc8e7f7b44c3ff)"
                    disabled={loading || success}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Gate *</label>
                  <select
                    value={gate}
                    onChange={(e) => setGate(e.target.value)}
                    required
                    className="form-input"
                    disabled={loading || success}
                  >
                    <option value="Main Gate">Main Gate</option>
                    <option value="North Gate">North Gate</option>
                    <option value="South Gate">South Gate</option>
                    <option value="East Gate">East Gate</option>
                    <option value="West Gate">West Gate</option>
                  </select>
                </div>

                <div className="form-actions">
                  <button type="submit" disabled={loading || success} className="btn-primary btn-large">
                    {loading ? 'Scanning...' : 'Scan Pass'}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/checklogs')}
                    className="btn-secondary"
                    disabled={loading}
                  >
                    View Logs
                  </button>
                </div>
              </form>
            </div>

            <div className="scan-tips">
              <h3>Tips for Scanning</h3>
              <ul>
                <li>Ensure the Pass ID is correct and complete</li>
                <li>Check if the pass is still valid (not expired)</li>
                <li>First scan will mark visitor as IN</li>
                <li>Second scan will mark visitor as OUT</li>
                <li>Select the correct gate from the dropdown</li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ScanPass;
