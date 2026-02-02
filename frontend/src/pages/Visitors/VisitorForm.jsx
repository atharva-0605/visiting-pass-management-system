import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { createVisitor, getVisitor, updateVisitor } from '../../services/api';
import Navbar from '../../components/Navbar';

const VisitorForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    idType: 'Aadhar',
    idNumber: '',
  });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditMode) {
      fetchVisitor();
    }
  }, [id]);

  const fetchVisitor = async () => {
    try {
      const response = await getVisitor(id);
      const visitor = response.data;
      setFormData({
        name: visitor.name,
        email: visitor.email,
        phone: visitor.phone,
        company: visitor.company,
        idType: visitor.idType,
        idNumber: visitor.idNumber,
      });
      if (visitor.photoUrl) {
        setPhotoPreview(`http://localhost:4000/${visitor.photoUrl}`);
      }
    } catch (err) {
      setError('Failed to fetch visitor');
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('phone', formData.phone);
      data.append('company', formData.company);
      data.append('idType', formData.idType);
      data.append('idNumber', formData.idNumber);
      if (photo) {
        data.append('photo', photo);
      }

      if (isEditMode) {
        await updateVisitor(id, data);
      } else {
        await createVisitor(data);
      }
      navigate('/visitors');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save visitor');
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
            <li><Link to="/visitors" className="menu-item active">Visitors</Link></li>
            <li><Link to="/appointments" className="menu-item">Appointments</Link></li>
            <li><Link to="/passes" className="menu-item">Passes</Link></li>
          </ul>
        </aside>

        <main className="main-content">
          <h1 className="page-title">
            {isEditMode ? 'Edit Visitor' : 'Add New Visitor'}
          </h1>

          {error && <div className="error-message">{error}</div>}

          <div className="form-container">
            <form onSubmit={handleSubmit} className="data-form">
              {/* Photo Upload */}
              <div className="form-group">
                <label className="form-label">Photo</label>
                <div className="photo-upload-container">
                  {photoPreview && (
                    <img src={photoPreview} alt="Preview" className="photo-preview" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="form-input"
                  />
                  <small className="form-hint">Upload visitor photo (optional)</small>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="Enter full name"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="visitor@example.com"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="9999999999"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Company *</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="Company name"
                />
              </div>

              <div className="form-group">
                <label className="form-label">ID Type *</label>
                <select
                  name="idType"
                  value={formData.idType}
                  onChange={handleChange}
                  required
                  className="form-input"
                >
                  <option value="Aadhar">Aadhar Card</option>
                  <option value="PAN">PAN Card</option>
                  <option value="Passport">Passport</option>
                  <option value="Driving License">Driving License</option>
                  <option value="Voter ID">Voter ID</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">ID Number *</label>
                <input
                  type="text"
                  name="idNumber"
                  value={formData.idNumber}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="Enter ID number"
                />
              </div>

              <div className="form-actions">
                <button type="submit" disabled={loading} className="btn-primary">
                  {loading ? 'Saving...' : isEditMode ? 'Update Visitor' : 'Add Visitor'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/visitors')}
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

export default VisitorForm;
