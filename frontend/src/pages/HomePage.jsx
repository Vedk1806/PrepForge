import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { motion } from 'framer-motion'; // ✅ Add this

function HomePage() {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await API.get('roles/');
        setRoles(response.data);
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };

    fetchRoles();
  }, []);

  return (
    <div
      style={{
        // height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#1e1e1e',
        color: 'white',
      }}
    >
      <div
        style={{
          flexGrow: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            width: '100%',
            maxWidth: '800px',
            textAlign: 'center',
          }}
        >
          <motion.h1
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            style={{ fontSize: '2.5rem', marginTop:'100px', marginBottom: '150px' }}
          >
            Welcome to PrepForge
          </motion.h1>

          <img src="/welcome2.svg" alt="logo" style={{ width: '150px', height: '150px', marginTop:'-80px', marginBottom:'50px' }} />

          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{ marginBottom: '20px' }}
          >
            Available Roles
          </motion.h2>

          <motion.select
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            onChange={(e) => setSelectedRole(e.target.value)}
            value={selectedRole}
            style={{
              padding: '10px',
              borderRadius: '5px',
              marginBottom: '15px',
              minWidth: '200px',
            }}
          >
            <option value="" disabled>
              Select a Role
            </option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </motion.select>

          {selectedRole && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.7 }}
            >
              <button
                onClick={() => navigate(`/questions/${selectedRole}`)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#6c63ff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
              >
                Proceed
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default HomePage;
