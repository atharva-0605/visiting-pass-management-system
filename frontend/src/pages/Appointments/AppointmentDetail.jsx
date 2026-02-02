import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { getAppointment, deleteAppointment, updateAppointmentStatus } from '../../services/api';
import Navbar from '../../components/Navbar';

const AppointmentDetail = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAppointment();
  }, [id]);

  const fetchAppointment = async () => {
    try {
      setLoading(true);
      const response = await getAppointment(id);
      setAppointment(response.data);
    } catch (err) {
      setError('Failed to fetch appointment details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) {
      return;
    }

    try {
      await deleteAppointment(id);
      navigate('/appointments');
    } catch (err) {
      alert('Failed to delete appointment');
      console.error(err);
    }
  };

  const handleStatusUpdate = async (status) => {
    try {
      await updateAppointmentStatus(id, status);
      fetchAppointment();
    } catch (err) {
      alert('Failed to update status');
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
      case 'approved':
        return 'status-approved';
      case 'rejected':
        return 'status-rejected';
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
        <div className="loading">Loading appointment details...</div>
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="dashboard-container">
        <Navbar />
        <div className="error-message">{error || 'Appointment not found'}</div>
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
            <li><Link to="/appointments" className="menu-item active">Appointments</Link></li>
            <li><Link to="/passes" className="menu-item">Passes</Link></li>
          </ul>
        </aside>

        <main className="main-content">
          <div className="page-header">
            <h1 className="page-title">Appointment Details</h1>
            <div className="header-actions">
              <button onClick={() => navigate('/appointments')} className="btn-secondary">
                Back to List
              </button>
              <button onClick={() => navigate(`/appointments/edit/${id}`)} className="btn-primary">
                Edit
              </button>
              <button onClick={handleDelete} className="btn-danger">
                Delete
              </button>
            </div>
          </div>

          <div className="detail-card">
            <div className="detail-header">
              <h2>Appointment Information</h2>
              <span className={`status-badge ${getStatusClass(appointment.status)}`}>
                {appointment.status}
              </span>
            </div>

            <div className="detail-grid">
              <div className="detail-item">
                <label>Visitor Name</label>
                <p>{appointment.visitor?.name}</p>
              </div>

              <div className="detail-item">
                <label>Visitor Email</label>
                <p>{appointment.visitor?.email}</p>
              </div>

              <div className="detail-item">
                <label>Visitor Phone</label>
                <p>{appointment.visitor?.phone}</p>
              </div>

              <div className="detail-item">
                <label>Company</label>
                <p>{appointment.visitor?.company}</p>
              </div>

              <div className="detail-item">
                <label>Host</label>
                <p>{appointment.host?.name}</p>
              </div>

              <div className="detail-item">
                <label>Host Email</label>
                <p>{appointment.host?.email}</p>
              </div>

              <div className="detail-item">
                <label>Purpose</label>
                <p>{appointment.purpose}</p>
              </div>

              <div className="detail-item">
                <label>Date & Time</label>
                <p>{formatDate(appointment.dateTime)}</p>
              </div>

              <div className="detail-item full-width">
                <label>Notes</label>
                <p>{appointment.notes || 'No notes provided'}</p>
              </div>

              <div className="detail-item">
                <label>Created By</label>
                <p>{appointment.createdBy?.name}</p>
              </div>

              <div className="detail-item">
                <label>Created At</label>
                <p>{formatDate(appointment.createdAt)}</p>
              </div>
            </div>

            {appointment.status === 'pending' && user?.role === 'admin' && (
              <div className="detail-actions">
                <h3>Approval Actions</h3>
                <div className="action-buttons">
                  <button
                    onClick={() => handleStatusUpdate('approved')}
                    className="btn-success"
                  >
                    Approve Appointment
                  </button>
                  <button
                    onClick={() => handleStatusUpdate('rejected')}
                    className="btn-danger"
                  >
                    Reject Appointment
                  </button>
                </div>
              </div>
            )}

            {appointment.status === 'approved' && (
              <div className="detail-actions">
                <h3>Quick Actions</h3>
                <div className="action-buttons">
                  <button
                    onClick={() => navigate(`/passes/new?appointmentId=${appointment._id}`)}
                    className="btn-primary"
                  >
                    Issue Pass for this Appointment
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppointmentDetail;
