import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';

import Discover from './Router/Discover';
import Landing from './Router/Landing';
import { useGetAdventures, useGetLoggedInUser,  } from './Providers';

import './App.css';
import './variables.css';

const App = () => {
  const { getLoggedInUser } = useGetLoggedInUser();
  const { getAllAdventures } = useGetAdventures();

  useEffect(() => {
    getLoggedInUser();
    getAllAdventures();
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