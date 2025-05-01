// Updated QuestionsPage.jsx with pagination (3 questions per page)

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../services/api';

function QuestionsPage() {
  const { roleId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 3;

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
        await API.post('notes/', { question: questionId, note: noteContent });
        alert('Note saved successfully!');
      }
    } catch (error) {
      console.error('Error saving note:', error);
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
        await API.patch(`progress/${progressId}/`, { status });
      } else {
        await API.post('progress/', { question: questionId, status });
      }

      const updatedQuestions = questions.map((q) =>
        q.id === questionId ? { ...q, status } : q
      );
      setQuestions(updatedQuestions);
    } catch (error) {
      console.error('Error updating progress:', error);
      alert('Failed to update progress.');
    }
  };

  const indexOfLast = currentPage * questionsPerPage;
  const indexOfFirst = indexOfLast - questionsPerPage;
  const currentQuestions = questions.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(questions.length / questionsPerPage);

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '20px', maxWidth: '900px', margin: '0 auto', width: '100%'
    }}>
      <h1>Available Questions</h1>

      <ul style={{ listStyle: 'none', padding: 0, width: '100%' }}>
        {currentQuestions.map((q) => (
          <li key={q.id} style={{
            border: '1px solid #ddd', borderRadius: '8px', padding: '15px', marginBottom: '15px',
            backgroundColor: '#f9f9f9', color: '#212121'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>{q.text}</strong>
              {q.status && (
                <span style={{
                  padding: '4px 10px', borderRadius: '20px',
                  backgroundColor: q.status === 'Completed' ? '#d4edda' : '#cce5ff',
                  color: q.status === 'Completed' ? '#155724' : '#004085', fontSize: '12px'
                }}>{q.status}</span>
              )}
            </div>

            <div style={{ marginTop: '10px' }}>
              <button onClick={() => handleProgressUpdate(q.id, 'Bookmarked')} style={{
                padding: '5px 10px', marginRight: '10px',
                backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px'
              }}>Bookmark</button>
              <button onClick={() => handleProgressUpdate(q.id, 'Completed')} style={{
                padding: '5px 10px', backgroundColor: '#28a745', color: 'white',
                border: 'none', borderRadius: '4px'
              }}>Mark Completed</button>
            </div>

            <div style={{ marginTop: '10px' }}>
              <textarea
                placeholder="Write your notes here..."
                value={q.note || ""}
                onChange={(e) => setQuestions(prev =>
                  prev.map(item => item.id === q.id ? { ...item, note: e.target.value } : item)
                )}
                style={{ width: '100%', padding: '8px', marginBottom: '8px' }}
              />
              <button onClick={() => handleSaveNote(q.id, q.note)} style={{
                padding: '5px 10px', backgroundColor: '#6c63ff', color: 'white',
                border: 'none', borderRadius: '4px'
              }}>Save Note</button>
            </div>
          </li>
        ))}
      </ul>

      {/* Pagination Controls */}
      <div style={{ marginTop: '20px' }}>
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => prev - 1)}
          style={{ marginRight: '10px' }}
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(prev => prev + 1)}
          style={{ marginLeft: '10px' }}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default QuestionsPage;
