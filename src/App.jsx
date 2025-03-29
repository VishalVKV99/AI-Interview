import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import useRole from './hooks/useRole';
import LandingPage from './pages/LandingPage';
import Home from './pages/Home';
import Upload from './pages/Upload';
import Dashboard from './pages/Dashboard';
import Interview from './pages/Interview';
import Feedback from './pages/Feedback';
import Signup from './pages/Signup';
import Login from './pages/Login';
import History from './pages/History';

import { InterviewProvider } from './contexts/InterviewContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';

import './index.css';

// Private Route Wrapper Component
const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return currentUser ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const role = useRole();

  if (role === 'admin') return children;
  return <Navigate to="/home" />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100 font-sans">
          <Navbar />
          <InterviewProvider>
            <Routes>
              {/* Public */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Protected Routes */}
              <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
              <Route path="/upload" element={<PrivateRoute><Upload /></PrivateRoute>} />
              <Route path="/interview" element={<PrivateRoute><Interview /></PrivateRoute>} />
              <Route path="/feedback" element={<PrivateRoute><Feedback /></PrivateRoute>} />
              <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/history" element={<PrivateRoute><History /></PrivateRoute>} />
              <Route path="/dashboard" element={<PrivateRoute><AdminRoute> <Dashboard /></AdminRoute></PrivateRoute>} />


              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </InterviewProvider>
        </div>
      </Router>

    </AuthProvider>
  );
};

export default App;
