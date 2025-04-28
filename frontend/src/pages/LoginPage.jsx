import React, { useState } from 'react';
import API from '../services/api';  // your axios instance
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post('token/', {
        username,
        password,
      });

      const { access } = response.data;
      
      localStorage.setItem('accessToken', access); // Save token 🔥

      alert('Login Successful! 🚀');
      navigate('/'); // Redirect to Home / Questions Page
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
      alert('Login failed. Please check your credentials.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
      <h2>Login to PrepForge</h2>
      <form onSubmit={handleLogin} style={{ width: '300px', display: 'flex', flexDirection: 'column' }}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{ marginBottom: '10px', padding: '8px' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ marginBottom: '10px', padding: '8px' }}
        />
        <button type="submit" style={{ padding: '8px', backgroundColor: '#6c63ff', color: 'white', border: 'none', borderRadius: '4px' }}>
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
