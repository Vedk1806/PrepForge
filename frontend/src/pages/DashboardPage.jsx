// DashboardPage.jsx — with hover highlight and improved text contrast

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

function DashboardPage() {
  const [bookmarked, setBookmarked] = useState([]);
  const [completed, setCompleted] = useState([]);
  const navigate = useNavigate();
  const userId = parseInt(localStorage.getItem('user_id'));

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const progressRes = await API.get('progress/');

        const userProgress = progressRes.data.filter(
          (item) => (item.user?.id ?? item.user) === userId
        );

        const withText = userProgress.map((p) => ({
          ...p,
          questionText: p.question.text,
          role: p.question.role?.id
        }));

        setBookmarked(withText.filter((item) => item.status === 'Bookmarked'));
        setCompleted(withText.filter((item) => item.status === 'Completed'));
      } catch (error) {
        console.error('Error fetching progress:', error);
      }
    };

    fetchProgress();
  }, [userId]);

  const goToQuestion = (roleId) => {
    navigate(`/questions/${roleId}`);
  };

  const renderList = (items, title) => (
    <div style={{ marginBottom: '30px' }}>
      <h2>{title}</h2>
      {items.length === 0 ? (
        <p>No questions {title.toLowerCase()} yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          {items.map((item) => (
            <li
              key={item.id}
              onClick={() => goToQuestion(item.role)}
              style={{
                padding: '10px',
                marginBottom: '10px',
                backgroundColor: '#2c2c2c',
                color: '#e0e0e0',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#6c63ff')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2c2c2c')}
            >
              {item.questionText}
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div style={{ padding: '40px', maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ color: 'LightGreen' }}>Your Dashboard</h1>
      {renderList(bookmarked, 'Bookmarked')}
      {renderList(completed, 'Completed')}
    </div>
  );
}

export default DashboardPage;