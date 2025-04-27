import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';

const HomePage = () => {
  const [roles, setRoles] = useState([]);

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
    <div>
      <h1>Available Roles</h1>
      <ul>
        {roles.map((role) => (
          <li key={role.id}>
            <Link to={`/questions/${role.id}`}>{role.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;
