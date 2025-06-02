import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import API from '../services/api';
import ReactMarkdown from 'react-markdown';

function QuestionsPage() {
  const { roleId } = useParams();
  const location = useLocation();
  const targetQuestionId = location.state?.targetQuestionId;

  const [questions, setQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [highlightedId, setHighlightedId] = useState(null);
  const [aiInput, setAiInput] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const questionsPerPage = 3;
  const indexOfLast = currentPage * questionsPerPage;
  const indexOfFirst = indexOfLast - questionsPerPage;
  const currentQuestions = questions.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(questions.length / questionsPerPage);

  const goToNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const goToPrevious = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  useEffect(() => {
    if (roleId) {
      fetchQuestions(roleId);
    }
  }, [roleId]);

  useEffect(() => {
    if (targetQuestionId && questions.length > 0) {
      const index = questions.findIndex((q) => q.id === targetQuestionId);
      if (index !== -1) {
        const page = Math.floor(index / questionsPerPage) + 1;
        setCurrentPage(page);
        setHighlightedId(targetQuestionId);
      }
    }
  }, [targetQuestionId, questions]);

  useEffect(() => {
    if (highlightedId) {
      const timer = setTimeout(() => setHighlightedId(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [highlightedId]);

  const fetchQuestions = async (selectedRole) => {
    try {
      const userId = localStorage.getItem('user_id');
      const token = localStorage.getItem('accessToken');
      if (!token || !userId) {
        console.warn('No token or userId available yet.');
        return;
      }
      const response = await API.get(`questions/${selectedRole}/?user=${userId}`);
      const notesRes = await API.get('notes/');
      const questionsData = response.data;
      const notes = notesRes.data;

      const questionsWithExtras = questionsData.map((q) => {
        const noteObj = notes.find((n) => n.question === q.id);
        return {
          ...q,
          note: noteObj?.note || '',
        };
      });

      setQuestions(questionsWithExtras);
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
      console.error('Error saving note:', error);
      alert('Failed to save note.');
    }
  };

  const handleProgressUpdate = async (questionId, status) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const progressRes = await API.get('progress/', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const existing = progressRes.data.find((p) => p.question.id === questionId);

      if (existing) {
        const patchRes = await API.patch(
          `progress/${existing.id}/`,
          { status },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        setQuestions((prev) =>
          prev.map((q) => (q.id === questionId ? { ...q, status: patchRes.data.status } : q))
        );
      } else {
        const postRes = await API.post(
          'progress/',
          { question: questionId, status },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        setQuestions((prev) =>
          prev.map((q) => (q.id === questionId ? { ...q, status: postRes.data.status } : q))
        );
      }
      alert(`Progress updated to ${status}`);
    } catch (error) {
      console.error('Error updating progress:', error);
      alert('Failed to update progress.');
    }
  };

  const handleGlobalAskAI = async () => {
    if (!aiInput.trim()) return;
    setLoading(true);
    try {
      const res = await API.post('ask-ai/', { question_text: aiInput });
      setAiResponse(res.data.answer);
    } catch (err) {
      console.error('AI request failed:', err);
      setAiResponse('Failed to fetch AI response.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        maxWidth: '900px',
        margin: '0 auto',
        width: '100%',
        position: 'relative'
      }}
    >
      <h1>Available Questions</h1>

      <div style={{
        position: 'absolute', top: 140, right: -300, width: '280px', backgroundColor: 'lightyellow', padding: '16px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
        <h3 style={{color:'#6c63ff'}}>Ask AI</h3>
        <textarea
          placeholder="Ask AI anything..."
          value={aiInput}
          onChange={(e) => setAiInput(e.target.value)}
          style={{ width: '100%', padding: '8px', height: '120px' }}
        />
        <button
          onClick={handleGlobalAskAI}
          style={{ marginTop: '10px', width: '100%', padding: '8px', backgroundColor: '#6c63ff', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          {loading ? 'Thinking...' : 'Ask'}
        </button>
        {aiResponse && (
          <div style={{ marginTop: '15px', backgroundColor: '#fff', padding: '12px', borderRadius: '6px', border: '1px solid #ccc', color: '#333', maxHeight: '300px', overflowY: 'auto' }}>
            <ReactMarkdown>{aiResponse}</ReactMarkdown>
          </div>
        )}
      </div>

      <ul style={{ listStyle: 'none', padding: 0, width: '100%' }}>
        {currentQuestions.map((q) => (
          <li
            key={q.id}
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '15px',
              marginBottom: '15px',
              backgroundColor: q.id === highlightedId ? 'lightgreen' : 'white',
              color: '#212121',
              transition: 'background-color 0.5s ease',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>{q.text}</strong>
              {q.status && (
                <span
                  style={{
                    padding: '4px 10px',
                    borderRadius: '20px',
                    backgroundColor: q.status === 'Completed' ? '#d4edda' : '#cce5ff',
                    color: q.status === 'Completed' ? '#155724' : '#004085',
                    fontSize: '12px',
                  }}
                >
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
                  cursor: q.status === 'Bookmarked' ? 'not-allowed' : 'pointer',
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
                  cursor: q.status === 'Completed' ? 'not-allowed' : 'pointer',
                }}
              >
                Mark Completed
              </button>
            </div>

            <div style={{ marginTop: '10px' }}>
              <textarea
                placeholder="Write your notes here..."
                value={q.note || ''}
                onChange={(e) =>
                  setQuestions((prev) =>
                    prev.map((item) =>
                      item.id === q.id ? { ...item, note: e.target.value } : item
                    )
                  )
                }
                style={{ width: '100%', padding: '8px', marginBottom: '8px' }}
              />
              <button
                onClick={() => handleSaveNote(q.id, q.note)}
                style={{
                  padding: '5px 10px',
                  backgroundColor: '#6c63ff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                }}
              >
                Save Note
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
        <button onClick={goToPrevious} disabled={currentPage === 1}>
          Previous
        </button>
        <span style={{ color: '#ffffff', fontWeight: 'bold', fontSize: '16px' }}>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={goToNext} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
}

export default QuestionsPage;
