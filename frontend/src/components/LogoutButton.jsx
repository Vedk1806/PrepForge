// src/components/LogoutButton.jsx

import { useNavigate } from 'react-router-dom';

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken'); // 🔥 Clear token
    localStorage.removeItem('user_id');      // 🔥 Clear user ID
    alert('Logged out successfully!');
    navigate('/login');                      // Redirect to login page
  };

  return (
    <button onClick={handleLogout} style={{
      padding: '8px 16px',
      backgroundColor: '#ff4d4d',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      marginTop: '20px'
    }}>
      Logout
    </button>
  );
}

export default LogoutButton;
