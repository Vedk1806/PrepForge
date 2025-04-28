import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import QuestionsPage from './pages/QuestionsPage';
import LoginPage from './pages/LoginPage';        // 🔥 newly created

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/questions/:roleId" element={<QuestionsPage />} />
        <Route path="/login" element={<LoginPage />} /> {/* login page */}
      </Routes>
    </Router>
  );
}

export default App;
