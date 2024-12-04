import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './MainPage';
import ResultPage from './ResultPage';
import AlgorithmPage from './AlgorithmPage';
import HomePage from './Home';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/algorithm" element={<AlgorithmPage />} />
        <Route path="/result" element={<ResultPage />} />
      </Routes>
    </Router>
  );
};

export default App;
