import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import 'bootstrap/dist/css/bootstrap.min.css';
import './DashboardPage.css';

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
          role: p.question.role?.id,
          questionId: p.question.id
        }));

        setBookmarked(withText.filter((item) => item.status === 'Bookmarked'));
        setCompleted(withText.filter((item) => item.status === 'Completed'));
      } catch (error) {
        console.error('Error fetching progress:', error);
      }
    };

    fetchProgress();
  }, [userId]);

  const goToQuestion = (roleId, questionId) => {
    navigate(`/questions/${roleId}`, { state: { targetQuestionId: questionId } });
  };

  const renderList = (items, title) => (
    <div className="mb-4">
      <h3 className="text-primary fw-semibold mb-3">{title}</h3>
      {items.length === 0 ? (
        <p className="text-muted">No questions {title.toLowerCase()} yet.</p>
      ) : (
        <ul className="list-group">
          {items.map((item) => (
            <li
              key={item.id}
              onClick={() => goToQuestion(item.role, item.questionId)}
              className="list-group-item list-group-item-action dashboard-hover rounded mb-2"
            >
              {item.questionText}
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div className="container py-5">
    <h1 style={{
      color: 'lightgreen',         // Match the app's purple theme
      fontSize: '2.5rem',
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: '30px',
      textShadow: '1px 1px 4px rgba(0,0,0,0.4)'  // Optional glow
    }}>
  Your Dashboard
</h1>      {renderList(bookmarked, 'Bookmarked')}
      {renderList(completed, 'Completed')}
    </div>
  );
}

export default DashboardPage;
