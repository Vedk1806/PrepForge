import React, { useEffect, useState } from 'react';
import API from '../services/api';

function QuestionsPage() {
  const [questions, setQuestions] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');

  useEffect(() => {
    if (selectedRole) {
      fetchQuestions();
    }
  }, [selectedRole]);

  const fetchQuestions = async () => {
    try {
      const response = await API.get(`questions/${selectedRole}/`);
      const questionsData = response.data;
  
      const notes = await fetchNotes();  // 🔥 Fetch notes
  
      // Merge notes into questions
      const questionsWithNotes = questionsData.map((q) => {
        const noteObj = notes.find((n) => n.question === q.id);
        return {
          ...q,
          note: noteObj ? noteObj.note : '',
        };
      });
  
      setQuestions(questionsWithNotes);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };
  

  const handleSaveNote = async (questionId, noteContent) => {
    try {
      await API.post('notes/', {
        user: 1, // temp user
        question: questionId,
        note: noteContent,
      });
      alert('Note saved successfully!');
    } catch (error) {
      console.error('Error saving note:', error.response?.data || error.message);
      alert('Failed to save note.');
    }
  };

  const fetchNotes = async () => {
    try {
      const response = await API.get('notes/');  // Fetch all notes
      return response.data;  // Array of {id, user, question, note}
    } catch (error) {
      console.error('Error fetching notes:', error);
      return [];
    }
  };
  
  

  const handleProgressUpdate = async (questionId, status) => {
    try {
      await API.post('progress/', {
        user: 1, // temp user
        question: questionId,
        status: status,
      });

      alert(`Question ${status} successfully!`);

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
    <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',      // horizontally center
        justifyContent: 'center',  // vertically center
        minHeight: '100vh',        // full screen height
        padding: '20px'
      }}>
      
      
      <h1>Available Questions</h1>

      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <label style={{ marginRight: '10px' }}>Select a Role ID:</label>
        <input
          type="number"
          min="1"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          style={{ padding: '5px', width: '100px' }}
        />
      </div>

      <ul style={{
        listStyle: 'none',
        padding: 0,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        {questions.length > 0 ? (
          questions.map((q) => (
            <li key={q.id} style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '15px',
              marginBottom: '15px',
              backgroundColor: '#f9f9f9',
              width: '70%',
              color: '#212121'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <strong>{q.text}</strong> — Difficulty: {q.difficulty}
                </div>
                {q.status && (
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '20px',
                    backgroundColor: q.status === 'Completed' ? '#d4edda' : '#cce5ff',
                    color: q.status === 'Completed' ? '#155724' : '#004085',
                    fontSize: '12px',
                  }}>
                    {q.status}
                  </span>
                )}
              </div>

              <div style={{ marginTop: '10px' }}>
                <button
                  onClick={() => handleProgressUpdate(q.id, 'Bookmarked')}
                  disabled={q.status === 'Bookmarked'}
                  style={{
                    padding: '5px 10px',
                    marginRight: '10px',
                    backgroundColor: q.status === 'Bookmarked' ? '#ccc' : '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: q.status === 'Bookmarked' ? 'not-allowed' : 'pointer'
                  }}
                >
                  Bookmark
                </button>

                <button
                  onClick={() => handleProgressUpdate(q.id, 'Completed')}
                  disabled={q.status === 'Completed'}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: q.status === 'Completed' ? '#ccc' : '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: q.status === 'Completed' ? 'not-allowed' : 'pointer'
                  }}
                >
                  Mark Completed
                </button>
            </div>

              <div style={{ marginTop: '10px' }}>
                <textarea
                placeholder="Write your notes here..."
                value={q.note || ""}
                onChange={(e) => {
                    const updatedQuestions = questions.map((item) => {
                    if (item.id === q.id) {
                        return { ...item, note: e.target.value };
                    }
                    return item;
                    });
                    setQuestions(updatedQuestions);
                }}
                style={{
                    width: '100%',
                    padding: '8px',
                    marginBottom: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ccc'
                }}
                />

                <button
                onClick={() => handleSaveNote(q.id, q.note)}
                style={{
                    padding: '5px 10px',
                    backgroundColor: '#6c63ff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}
                >
                Save Note
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
