import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import './styles/globals.css';  // Assuming you have global styles
import FileUpload from './components/FileUpload';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/upload" element={<FileUpload />} />
      </Routes>
    </Router>
  );
}

export default App;
