import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { getPass, deletePass } from '../../services/api';
import Navbar from '../../components/Navbar';
import QRDisplay from '../../components/QRDisplay';

const PassDetail = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [pass, setPass] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    fetchPass();
  }, [id]);

  const fetchPass = async () => {
    try {
      setLoading(true);
      const response = await getPass(id);
      setPass(response.data);
    } catch (err) {
      setError('Failed to fetch pass details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this pass?')) {
      return;
    }

    try {
      await deletePass(id);
      navigate('/passes');
    } catch (err) {
      alert('Failed to delete pass');
      console.error(err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'long',
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

  if (loading) {
    return (
      <div className="dashboard-container">
        <Navbar />
        <div className="loading">Loading pass details...</div>
      </div>
    );
  }

  if (error || !pass) {
    return (
      <div className="dashboard-container">
        <Navbar />
        <div className="error-message">{error || 'Pass not found'}</div>
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
            <li><Link to="/visitors" className="menu-item">Visitors</Link></li>
            <li><Link to="/appointments" className="menu-item">Appointments</Link></li>
            <li><Link to="/passes" className="menu-item active">Passes</Link></li>
          </ul>
        </aside>

        <main className="main-content">
          <div className="page-header">
            <h1 className="page-title">Pass Details</h1>
            <div className="header-actions">
              <button onClick={() => navigate('/passes')} className="btn-secondary">
                Back to List
              </button>
              <button onClick={() => setShowQR(!showQR)} className="btn-primary">
                {showQR ? 'Hide QR' : 'Show QR'}
              </button>
              <button onClick={handleDelete} className="btn-danger">
                Delete
              </button>
            </div>
          </div>

          <div className="detail-card">
            <div className="detail-header">
              <h2>Pass Information</h2>
              <span className={`status-badge ${getStatusClass(pass.status)}`}>
                {pass.status}
              </span>
            </div>

            <div className="detail-grid">
              <div className="detail-item">
                <label>Pass Number</label>
                <p>
                  <span className="pass-number">{pass.passNumber}</span>
                </p>
              </div>

              <div className="detail-item">
                <label>Status</label>
                <p>{pass.status}</p>
              </div>

              <div className="detail-item">
                <label>Visitor Name</label>
                <p>{pass.visitor?.name}</p>
              </div>

              <div className="detail-item">
                <label>Visitor Email</label>
                <p>{pass.visitor?.email}</p>
              </div>

              <div className="detail-item">
                <label>Visitor Phone</label>
                <p>{pass.visitor?.phone}</p>
              </div>

              <div className="detail-item">
                <label>Company</label>
                <p>{pass.visitor?.company}</p>
              </div>

              <div className="detail-item">
                <label>Host</label>
                <p>{pass.host?.name}</p>
              </div>

              <div className="detail-item">
                <label>Host Email</label>
                <p>{pass.host?.email}</p>
              </div>

              <div className="detail-item">
                <label>Valid From</label>
                <p>{formatDate(pass.validFrom)}</p>
              </div>

              <div className="detail-item">
                <label>Valid To</label>
                <p>{formatDate(pass.validTo)}</p>
              </div>

              <div className="detail-item">
                <label>Created At</label>
                <p>{formatDate(pass.createdAt)}</p>
              </div>

              <div className="detail-item">
                <label>Last Updated</label>
                <p>{formatDate(pass.updatedAt)}</p>
              </div>

              {pass.appointment && (
                <div className="detail-item full-width">
                  <label>Associated Appointment</label>
                  <p>
                    {pass.appointment.purpose} - {formatDate(pass.appointment.dateTime)}
                  </p>
                </div>
              )}
            </div>

            {showQR && (
              <div className="qr-section">
                <h3>QR Code</h3>
                <QRDisplay passId={pass._id} />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PassDetail;
