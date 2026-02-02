import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams, useSearchParams} from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import {createPass,getPass,updatePass,getVisitors,getAppointments,} from '../../services/api';
import Navbar from '../../components/Navbar';
import { Link } from 'react-router-dom';

const PassForm = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [visitors, setVisitors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [formData, setFormData] = useState({
    visitor: '',
    host: user?._id || '',
    appointment: searchParams.get('appointmentId') || '',
    validFrom: '',
    validTo: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchVisitors();
    fetchAppointments();
    if (isEditMode) {
      fetchPass();
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

  const fetchAppointments = async () => {
    try {
      const response = await getAppointments({ status: 'approved' });
      setAppointments(response.data);
    } catch (err) {
      console.error('Failed to fetch appointments:', err);
    }
  };

  const fetchPass = async () => {
    try {
      const response = await getPass(id);
      const pass = response.data;
      setFormData({
        visitor: pass.visitor._id,
        host: pass.host._id,
        appointment: pass.appointment?._id || '',
        validFrom: new Date(pass.validFrom).toISOString().slice(0, 16),
        validTo: new Date(pass.validTo).toISOString().slice(0, 16),
      });
    } catch (err) {
      setError('Failed to fetch pass');
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

  const payload = {
    ...formData,
  };

  if (!payload.appointment) {
    delete payload.appointment;
  }

  try {
    if (isEditMode) {
      await updatePass(id, payload);
    } else {
      await createPass(payload);
    }
    navigate('/passes');
  } catch (err) {
    setError(err.response?.data?.error || 'Failed to save pass');
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
            <li><Link to="/appointments" className="menu-item">Appointments</Link></li>
            <li><Link to="/passes" className="menu-item active">Passes</Link></li>
          </ul>
        </aside>

        <main className="main-content">
          <h1 className="page-title">
            {isEditMode ? 'Edit Pass' : 'Issue New Pass'}
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
                <label className="form-label">Appointment (Optional)</label>
                <select
                  name="appointment"
                  value={formData.appointment}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="">No Appointment</option>
                  {appointments.map((appointment) => (
                    <option key={appointment._id} value={appointment._id}>
                      {appointment.visitor?.name} - {appointment.purpose}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Valid From *</label>
                <input
                  type="datetime-local"
                  name="validFrom"
                  value={formData.validFrom}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Valid To *</label>
                <input
                  type="datetime-local"
                  name="validTo"
                  value={formData.validTo}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-actions">
                <button type="submit" disabled={loading} className="btn-primary">
                  {loading ? 'Saving...' : isEditMode ? 'Update Pass' : 'Issue Pass'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/passes')}
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

export default PassForm;
