import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
// import './styles/globals.css';  // Assuming you have global styles
import FileUpload from './components/FileUpload';
import GetImagesPage from './components/GetImagesPage';
import LoginPage from './components/LoginPage';
import OTPPage from './components/OTPPage';
import RoleSelectionPage from './components/RoleSelectionPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/uploadimage" element={<FileUpload />} />
        <Route path="/get" element={<GetImagesPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/otp" element={<OTPPage />} />
        <Route path="/role-selection" element={<RoleSelectionPage />} />
      </Routes>
    </Router>
  );
}

export default App;
