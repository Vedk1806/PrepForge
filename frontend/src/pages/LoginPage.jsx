import React, { useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Footer from '../components/Footer';

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post('token/', { username, password });
      const { access } = response.data;
      localStorage.setItem('accessToken', access);
      const decoded = jwtDecode(access);
      localStorage.setItem('user_id', decoded.user_id);
      alert('Login Successful! 🚀');
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
      alert('Login failed. Please check your credentials.');
    }
  };

  return (

    <div style={{
      display: 'flex',
      flexDirection: 'column',
    //   minHeight: '100vh',
      backgroundColor: '#1e1e1e',
      marginTop: '250px'
    }}>
            <img src="/coder.svg" alt="logo" style={{ width: '200px', height: '200px', marginLeft:'750px', marginTop:'-200px', marginBottom:'50px' }} />

    <h2 style={{ textAlign: 'center', color: '#aaa', marginTop: '-10px', marginBottom:'50px' }}>
    Your personal coding prep space — smart, focused, and tailored to your role.
    </h2>
      <div style={{
        flexGrow: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
      }}>
        <div style={{
          width: '100%',
          maxWidth: '400px',
          backgroundColor: '#2c2c2c',
          padding: '30px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        }}>


          <h2 style={{ textAlign: 'center', color: 'white', marginBottom: '20px' }}>Login to PrepForge</h2>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column' }}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{
                marginBottom: '10px',
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #555',
                backgroundColor: '#1a1a1a',
                color: 'white'
              }}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                marginBottom: '10px',
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #555',
                backgroundColor: '#1a1a1a',
                color: 'white'
              }}
            />
            <button type="submit" style={{
              padding: '10px',
              backgroundColor: '#6c63ff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}>
              Login
            </button>
          </form>
        </div>
      </div>

      {/* <Footer /> */}
    </div>
  );
}

export default LoginPage;
