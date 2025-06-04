import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import API from '../services/api';
import ReactMarkdown from 'react-markdown';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaLightbulb } from "react-icons/fa";
import './QuestionsPage.css';



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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      if (!token || !userId) return;
      const response = await API.get(`questions/${selectedRole}/?user=${userId}`);
      const notesRes = await API.get('notes/');
      const questionsData = response.data;
      const notes = notesRes.data;
      const questionsWithExtras = questionsData.map((q) => {
        const noteObj = notes.find((n) => n.question === q.id);
        return { ...q, note: noteObj?.note || '' };
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
        await API.post('notes/', { question: questionId, note: noteContent });
        alert('Note saved successfully!');
      }
    } catch (error) {
      console.error('Error saving note:', error);
      alert('Failed to save note.');
    }
  };

  // const handleProgressUpdate = async (questionId, status) => {
  //   try {
  //     const accessToken = localStorage.getItem('accessToken');
  //     const progressRes = await API.get('progress/', {
  //       headers: { Authorization: `Bearer ${accessToken}` },
  //     });
  //     const existing = progressRes.data.find((p) => p.question.id === questionId);
  //     if (existing) {
  //       const patchRes = await API.patch(`progress/${existing.id}/`, { status }, {
  //         headers: { Authorization: `Bearer ${accessToken}` },
  //       });
  //       setQuestions((prev) =>
  //         prev.map((q) => (q.id === questionId ? { ...q, status: patchRes.data.status } : q))
  //       );
  //     } else {
  //       const postRes = await API.post('progress/', { question: questionId, status }, {
  //         headers: { Authorization: `Bearer ${accessToken}` },
  //       });
  //       setQuestions((prev) =>
  //         prev.map((q) => (q.id === questionId ? { ...q, status: postRes.data.status } : q))
  //       );
  //     }
  //     alert(`Progress updated to ${status}`);
  //   } catch (error) {
  //     console.error('Error updating progress:', error);
  //     alert('Failed to update progress.');
  //   }
  // };

  const handleProgressUpdate = async (questionId, status) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const progressRes = await API.get('progress/', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
  
      const existing = progressRes.data.find((p) => p.question.id === questionId);
  
      if (existing) {
        await API.patch(
          `progress/${existing.id}/`,
          { status },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
      } else {
        await API.post(
          'progress/',
          { question: questionId, status },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
      }
  
      // 🔥 Optimistic UI Update — update the local state immediately
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === questionId ? { ...q, status } : q
        )
      );
  
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
    <div className="container py-4">
      <h1 className="text-center text-light mb-4 display-5 fw-bold">Available Questions</h1>
      <div className={`row ${isMobile ? '' : 'gx-5'}`}>
        <div className={isMobile ? '' : 'col-lg-9'}>
          {currentQuestions.map((q) => (
            <div
              key={q.id}
              className={`card border-0 mb-4 shadow-lg rounded-4 ${q.id === highlightedId ? 'border-success border-2' : ''}`}
              style={{ background: 'linear-gradient(to right, #f0f4ff, #e6f7ff)' }}
            >
              <div className="card-body">
                <h5 className="card-title d-flex justify-content-between align-items-center">
                <span className="fw-semibold">
                    {q.text}
                    {q.difficulty && (
                      <span className="badge bg-warning text-dark ms-2">
                        {q.difficulty}
                      </span>
                    )}
                  </span>   
                  {q.status && (
                    <span className={`badge ${q.status === 'Completed' ? 'bg-success' : 'bg-primary'}`}>{q.status}</span>
                  )}
                </h5>
                <div className="mt-3">
                  <button className="btn btn-outline-primary me-2" disabled={q.status === 'Bookmarked'} onClick={() => handleProgressUpdate(q.id, 'Bookmarked')}>Bookmark</button>
                  <button className="btn btn-outline-success" disabled={q.status === 'Completed'} onClick={() => handleProgressUpdate(q.id, 'Completed')}>Mark Completed</button>
                </div>
                <div className="mt-3">
                  <textarea className="form-control" rows="3" placeholder="Write your notes here..." value={q.note || ''} onChange={(e) => setQuestions((prev) => prev.map((item) => item.id === q.id ? { ...item, note: e.target.value } : item))} />
                  <button className="btn btn-dark mt-2" onClick={() => handleSaveNote(q.id, q.note)}>Save Note</button>
                </div>
              </div>
            </div>
          ))}

          <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
            <button className="btn btn-outline-secondary" onClick={goToPrevious} disabled={currentPage === 1}>Previous</button>
            <span className="text-light fw-semibold">Page {currentPage} of {totalPages}</span>
            <button className="btn btn-outline-secondary" onClick={goToNext} disabled={currentPage === totalPages}>Next</button>
          </div>
        </div>

       

        <div className={isMobile ? 'mt-4' : 'col-lg-3'}>
          <div className="bg-light p-4 rounded-4 shadow border border-primary">
          <div style={{ textAlign: 'center', marginBottom: '-39px', paddingBottom:'10px' }}>
          <FaLightbulb className="bouncing-bulb glow-bulb" size={32} color="orange" />
          </div>
            <h5 className="text-primary fw-semibold">Ask AI</h5>
            <textarea className="form-control" placeholder="Ask AI anything..." value={aiInput} onChange={(e) => setAiInput(e.target.value)} rows="5" />
            <button className="btn btn-primary w-100 mt-3" onClick={handleGlobalAskAI}>{loading ? 'Thinking...' : 'Ask'}</button>
            {aiResponse && (
              <div className="bg-white border mt-3 p-3 rounded-3 overflow-auto" style={{ maxHeight: '541px' }}>
                <ReactMarkdown>{aiResponse}</ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuestionsPage;
