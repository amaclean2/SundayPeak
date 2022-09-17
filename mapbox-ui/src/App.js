import React, { useEffect, useRef } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';

import Discover from './Router/Discover';
import Landing from './Router/Landing';
import { useGetUser } from './Providers';

import './App.css';
import './variables.css';

const App = () => {
  const { getInitialCall } = useGetUser();
  const loadingRef = useRef(false);

  useEffect(() => {
    if (!loadingRef.current) {
      loadingRef.current = true;
      getInitialCall();
    }
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