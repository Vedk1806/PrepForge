import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../services/api';

function QuestionsPage() {
  const { roleId } = useParams();
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    if (roleId) {
      fetchQuestions(roleId);
    }
  }, [roleId]);

  const fetchQuestions = async (selectedRole) => {
    try {
      const response = await API.get(`questions/${selectedRole}/`);
      const questionsData = response.data;
      const notes = await fetchNotes();

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
      const response = await API.get(`notes/?question=${questionId}`);
      if (response.data.length > 0) {
        const noteId = response.data[0].id;
        await API.patch(`notes/${noteId}/`, { note: noteContent });
        alert('Note updated successfully!');
      } else {
        await API.post('notes/', {
          question: questionId,
          note: noteContent,
        });
        alert('Note saved successfully!');
      }
    } catch (error) {
      console.error('Error saving note:', error.response?.data || error.message);
      alert('Failed to save note.');
    }
  };

  const fetchNotes = async () => {
    try {
      const response = await API.get('notes/');
      return response.data;
    } catch (error) {
      console.error('Error fetching notes:', error);
      return [];
    }
  };

  const handleProgressUpdate = async (questionId, status) => {
    try {
      const userId = localStorage.getItem('user_id');
      const response = await API.get(`progress/?question=${questionId}&user=${userId}`);

      if (response.data.length > 0) {
        const progressId = response.data[0].id;
        await API.patch(`progress/${progressId}/`, { status: status });
        alert(`Progress updated to ${status}!`);
      } else {
        await API.post('progress/', {
          question: questionId,
          status: status
        });
        alert(`Progress saved as ${status}!`);
      }

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
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      maxWidth: '900px',
      margin: '0 auto',
      width: '100%'
    }}>
      <h1>Available Questions</h1>

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
