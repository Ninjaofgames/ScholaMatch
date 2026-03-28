import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SchoolDetail from './pages/SchoolDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/school/:id" element={<SchoolDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
