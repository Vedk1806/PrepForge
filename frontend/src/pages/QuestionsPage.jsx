import React, { useEffect, useState } from 'react';
import API from '../services/api';

function QuestionsPage() {
  const [questions, setQuestions] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);

  useEffect(() => {
    if (selectedRole) {
      fetchQuestions();
    }
  }, [selectedRole]);

  const fetchQuestions = async () => {
    try {
      const response = await API.get(`questions/${selectedRole}/`);
      setQuestions(response.data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleProgressUpdate = async (questionId, status) => {
    try {
      await API.post('progress/', {
        user: 1,   // default user for now
        question: questionId,
        status: status,
      });

      alert(`Question ${status} successfully!`);

      // 🔥 Update question status in UI immediately
      const updatedQuestions = questions.map((q) => {
        if (q.id === questionId) {
          return { ...q, status: status };
        }
        return q;
      });
      setQuestions(updatedQuestions);

    } catch (error) {
      console.error('Error updating progress:', error.response?.data || error.message);
      alert('Failed to update progress.');
    }
  };

  return (
    <div>
      <h1>Available Questions</h1>

      <div>
        <label>Select a Role ID:</label>
        <input
          type="number"
          min="1" 
          value={selectedRole || ''}
          onChange={(e) => setSelectedRole(e.target.value)}
        />
      </div>

      <ul>
        {questions.length > 0 ? (
          questions.map((q) => (
            <li key={q.id} style={{ marginBottom: '20px' }}>
              <div>
                <strong>{q.text}</strong> — Difficulty: {q.difficulty}
                {q.status && (
                  <span style={{ marginLeft: '10px', color: q.status === 'Completed' ? 'green' : 'blue' }}>
                    [{q.status}]
                  </span>
                )}
              </div>

              <div style={{ marginTop: '8px' }}>
                <button
                  onClick={() => handleProgressUpdate(q.id, 'Bookmarked')}
                  disabled={q.status === 'Bookmarked'}
                >
                  Bookmark
                </button>

                <button
                  onClick={() => handleProgressUpdate(q.id, 'Completed')}
                  disabled={q.status === 'Completed'}
                  style={{ marginLeft: '10px' }}
                >
                  Mark Completed
                </button>
              </div>
            </li>
          ))
        ) : (
          <p>No questions found for this role.</p>
        )}
      </ul>
    </div>
  );
}

export default QuestionsPage;
