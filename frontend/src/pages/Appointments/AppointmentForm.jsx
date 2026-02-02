import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import {
  createAppointment,
  getAppointment,
  updateAppointment,
  getVisitors,
} from '../../services/api';
import Navbar from '../../components/Navbar';

const AppointmentForm = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [visitors, setVisitors] = useState([]);
  const [formData, setFormData] = useState({
    visitor: '',
    host: user?._id || '',
    purpose: '',
    dateTime: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchVisitors();
    if (isEditMode) {
      fetchAppointment();
    }
  }, [id]);

  const fetchVisitors = async () => {
    try {
      const response = await getVisitors();
      setVisitors(response.data);
    } catch (err) {
      console.error('Failed to fetch visitors:', err);
    }
  };

  const fetchAppointment = async () => {
    try {
      const response = await getAppointment(id);
      const appointment = response.data;
      setFormData({
        visitor: appointment.visitor._id,
        host: appointment.host._id,
        purpose: appointment.purpose,
        dateTime: new Date(appointment.dateTime).toISOString().slice(0, 16),
        notes: appointment.notes || '',
      });
    } catch (err) {
      setError('Failed to fetch appointment');
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isEditMode) {
        await updateAppointment(id, formData);
      } else {
        await createAppointment(formData);
      }
      navigate('/appointments');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save appointment');
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
            <li><Link to="/visitors" className="menu-item">Visitors</Link></li>
            <li><Link to="/appointments" className="menu-item active">Appointments</Link></li>
            <li><Link to="/passes" className="menu-item">Passes</Link></li>
          </ul>
        </aside>

        <main className="main-content">
          <h1 className="page-title">
            {isEditMode ? 'Edit Appointment' : 'Create Appointment'}
          </h1>

          {error && <div className="error-message">{error}</div>}

          <div className="form-container">
            <form onSubmit={handleSubmit} className="data-form">
              <div className="form-group">
                <label className="form-label">Visitor *</label>
                <select
                  name="visitor"
                  value={formData.visitor}
                  onChange={handleChange}
                  required
                  className="form-input"
                >
                  <option value="">Select Visitor</option>
                  {visitors.map((visitor) => (
                    <option key={visitor._id} value={visitor._id}>
                      {visitor.name} - {visitor.company}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Purpose *</label>
                <input
                  type="text"
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="e.g., Client meeting, Interview"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Date & Time *</label>
                <input
                  type="datetime-local"
                  name="dateTime"
                  value={formData.dateTime}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="form-input"
                  rows="4"
                  placeholder="Any additional notes or instructions"
                />
              </div>

              <div className="form-actions">
                <button type="submit" disabled={loading} className="btn-primary">
                  {loading ? 'Saving...' : isEditMode ? 'Update Appointment' : 'Create Appointment'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/appointments')}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppointmentForm;
