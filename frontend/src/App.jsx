import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import QuestionsPage from './pages/QuestionsPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage'; // ✅ Import the Dashboard
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          height: '100%',
          overflowX: 'hidden',
          margin: 0,
          padding: 0,
          backgroundColor: '#1e1e1e',
        }}
      >
        <Navbar />
        <div style={{ flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/questions/:roleId" element={<QuestionsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/dashboard" element={<DashboardPage />} /> {/* ✅ Dashboard route */}
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
