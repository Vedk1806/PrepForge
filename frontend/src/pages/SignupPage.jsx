import React, { useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';

function SignupPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password1: '',
    password2: '',
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password1 !== formData.password2) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await API.post('register/', formData);
      console.log('Signup successful:', response.data);
      alert('Signup successful! 🎉 You can now login.');
      navigate('/login');
    } catch (err) {
      console.error('Signup failed:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Signup failed. Please try again.');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <div className="card shadow p-4">
        <h3 className="text-center mb-4 text-primary">Create Your Account</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label><FaUser className="me-2" />Username</label>
            <input
              type="text"
              name="username"
              className="form-control"
              placeholder="Enter username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label><FaEnvelope className="me-2" />Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label><FaLock className="me-2" />Password</label>
            <input
              type="password"
              name="password1"
              className="form-control"
              placeholder="Enter password"
              value={formData.password1}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group mb-4">
            <label><FaLock className="me-2" />Confirm Password</label>
            <input
              type="password"
              name="password2"
              className="form-control"
              placeholder="Confirm password"
              value={formData.password2}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignupPage;
