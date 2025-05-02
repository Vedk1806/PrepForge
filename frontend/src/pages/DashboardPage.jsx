import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

function DashboardPage() {
  const [bookmarked, setBookmarked] = useState([]);
  const [completed, setCompleted] = useState([]);
  const navigate = useNavigate();
  const userId = localStorage.getItem('user_id');

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const progressRes = await API.get('progress/');
        const questionRes = await API.get('questions/'); // fetch all questions

        const userProgress = progressRes.data.filter(item => item.user === parseInt(userId));
        const allQuestions = questionRes.data;

        const withText = userProgress.map(p => {
          const match = allQuestions.find(q => q.id === p.question);
          return {
            ...p,
            questionText: match ? match.text : 'Unknown Question',
            role: match ? match.role : null
          };
        });

        setBookmarked(withText.filter(item => item.status === 'Bookmarked'));
        setCompleted(withText.filter(item => item.status === 'Completed'));
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
          {items.map(item => (
            <li
              key={item.id}
              onClick={() => goToQuestion(item.role)}
              style={{
                padding: '10px',
                marginBottom: '10px',
                backgroundColor: '#2c2c2c',
                color: 'white',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
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
      <h1 style={{ color: '#6c63ff' }}>Your Dashboard</h1>
      {renderList(bookmarked, 'Bookmarked')}
      {renderList(completed, 'Completed')}
    </div>
  );
}

export default DashboardPage;
