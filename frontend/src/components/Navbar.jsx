import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('accessToken');

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user_id');
    alert('Logged out successfully.');
    navigate('/login');
  };

  return (
    <nav
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 24px',
        backgroundColor: 'green',
        color: 'white',
        flexWrap: 'wrap',
      }}
    >
      {/* Left: Logo */}
     {/* Left: Logo */}
<div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
  <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '20px', fontWeight: 'bold' }}>
    PrepForge
  </Link>
</div>


      


      {/* Right: Nav Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {isLoggedIn ? (
          <>
            <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
              Home
            </Link>
            <button
              onClick={handleLogout}
              style={{
                background: 'transparent',
                border: '1px solid white',
                color: 'white',
                padding: '5px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>
              Login
            </Link>
            <Link to="/signup" style={{ color: 'white', textDecoration: 'none' }}>
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
