import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Navbar.css';

function Navbar() {
  const { currentUser, logout, userProfile } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Falha ao fazer logout', error);
    }
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-logo">
          English Kids
        </Link>
        
        {currentUser && (
          <div className="navbar-menu">
            <Link to="/dashboard" className="navbar-item">
              Níveis
            </Link>
            <Link to="/lessons" className="navbar-item">
              Lições
            </Link>
            {userProfile?.role === 'teacher' && (
              <Link to="/teacher" className="navbar-item">
                Professor
              </Link>
            )}
            <Link to="/profile" className="navbar-item">
              Perfil
            </Link>
            <button onClick={handleLogout} className="navbar-button">
              Sair
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;