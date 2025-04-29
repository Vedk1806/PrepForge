import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import QuestionsPage from './pages/QuestionsPage';
import LoginPage from './pages/LoginPage';        //newly created
import SignupPage from './pages/SignupPage'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/questions/:roleId" element={<QuestionsPage />} />
        <Route path="/login" element={<LoginPage />} /> {/* login page */}
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </Router>
  );
}

export default App;
