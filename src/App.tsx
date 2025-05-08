import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { MovieProvider } from './context/MovieContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Watchlist from './pages/Watchlist';
import Watched from './pages/Watched';

function App() {
  return (
    <AuthProvider>
      <MovieProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/watchlist" element={<Watchlist />} />
              <Route path="/watched" element={<Watched />} />
            </Routes>
          </Layout>
        </Router>
      </MovieProvider>
    </AuthProvider>
  );
}

export default App;