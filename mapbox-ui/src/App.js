import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';

import Discover from './Router/Discover';
import Landing from './Router/Landing';
import { useGetAdventures, useGetUser } from './Providers';

import './App.css';
import './variables.css';

const App = () => {
  const { startUserAuthProcess } = useGetUser();
  const { queryAdventures } = useGetAdventures();

  useEffect(() => {
    startUserAuthProcess();
    queryAdventures();
  }, []);

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/discover" element={<Discover />} />
          <Route path="/" element={<Landing />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;