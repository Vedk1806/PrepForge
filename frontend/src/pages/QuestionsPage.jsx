import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';

const QuestionsPage = () => {
  const { roleId } = useParams();
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await API.get(`questions/${roleId}/`);
        setQuestions(response.data);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, [roleId]);

  const handleProgressUpdate = async (questionId, status) => {
    try {
      console.log("Sending to backend:", { user: 1, question: questionId, status });
  
      await API.post('progress/', {
        user: 1,
        question: questionId,
        status: status,
      });
  
      alert(`Question ${status} successfully!`);
    } catch (error) {
      console.error('Error updating progress:', error.response?.data || error.message);
      alert('Failed to update progress.');
    }
  };
  
  

  return (
    <div>
      <h1>Questions for Role ID: {roleId}</h1>
      <ul>
        {questions.length > 0 ? (
          questions.map((q) => (
            <li key={q.id}>
              {q.text} - Difficulty: {q.difficulty}
              <div>
                <button onClick={() => handleProgressUpdate(q.id, 'Bookmarked')}>Bookmark</button>
                <button onClick={() => handleProgressUpdate(q.id, 'Completed')}>Mark Completed</button>
              </div>
            </li>
          ))
        ) : (
          <p>No questions found for this role.</p>
        )}
      </ul>
      <br />
      <Link to="/">← Back to Roles</Link>
    </div>
  );
};

export default QuestionsPage;
