import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/dashboard">
          <h2>Visitor Pass Management</h2>
        </Link>
      </div>
      <div className="navbar-user">
        {user && (
    <div>
      <span className="user-name">{user.name}</span>
      <span className="user-role">({user.role})</span>
      <button onClick={handleLogout} className="btn-logout">
        Logout
      </button>
    </div>
    )}
      </div>
    </nav>
  );
};

export default Navbar;
