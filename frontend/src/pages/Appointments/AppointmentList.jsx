import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import {getAppointments,deleteAppointment,updateAppointmentStatus,} from '../../services/api';
import Navbar from '../../components/Navbar';

const AppointmentList = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState({
    status: '',
    from: '',
    to: '',
  });

  useEffect(() => {
    fetchAppointments();
  }, [filter]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filter.status) params.status = filter.status;
      if (filter.from) params.from = filter.from;
      if (filter.to) params.to = filter.to;

      const response = await getAppointments(params);
      setAppointments(response.data);
    } catch (err) {
      setError('Failed to fetch appointments');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) {
      return;
    }

    try {
      await deleteAppointment(id);
      fetchAppointments();
    } catch (err) {
      alert('Failed to delete appointment');
      console.error(err);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateAppointmentStatus(id, status);
      fetchAppointments();
    } catch (err) {
      alert('Failed to update status');
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
            <h1 className="page-title">Appointments</h1>
            <button onClick={() => navigate('/appointments/new')} className="btn-primary">
              Create Appointment
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
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="filter-group">
              <label className="form-label">From Date</label>
              <input
                type="date"
                value={filter.from}
                onChange={(e) => setFilter({ ...filter, from: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="filter-group">
              <label className="form-label">To Date</label>
              <input
                type="date"
                value={filter.to}
                onChange={(e) => setFilter({ ...filter, to: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          {loading ? (
            <div className="loading">Loading appointments...</div>
          ) : appointments.length === 0 ? (
            <div className="empty-state">
              <p>No appointments found</p>
              <button onClick={() => navigate('/appointments/new')} className="btn-primary">
                Create First Appointment
              </button>
            </div>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Visitor</th>
                    <th>Host</th>
                    <th>Purpose</th>
                    <th>Date & Time</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appointment) => (
                    <tr key={appointment._id}>
                      <td>
                        <div className="visitor-info">
                          <strong>{appointment.visitor?.name}</strong>
                          <small>{appointment.visitor?.company}</small>
                        </div>
                      </td>
                      <td>{appointment.host?.name}</td>
                      <td>{appointment.purpose}</td>
                      <td>{formatDate(appointment.dateTime)}</td>
                      <td>
                        <span className={`status-badge ${getStatusClass(appointment.status)}`}>
                          {appointment.status}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons-inline">
                          <button
                            onClick={() => navigate(`/appointments/${appointment._id}`)}
                            className="btn-small btn-info"
                          >
                            View
                          </button>

                          {appointment.status === 'pending' && user?.role === 'admin' && (
                            <>
                              <button
                                onClick={() => handleStatusUpdate(appointment._id, 'approved')}
                                className="btn-small btn-success"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(appointment._id, 'rejected')}
                                className="btn-small btn-danger"
                              >
                                Reject
                              </button>
                            </>
                          )}

                          <button
                            onClick={() => handleDelete(appointment._id)}
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

export default AppointmentList;
