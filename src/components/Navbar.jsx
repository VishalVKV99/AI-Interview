import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import useRole from '../hooks/useRole';


const Navbar = () => {
  const { currentUser, logout } = useAuth();


  const role = useRole();

  {role === 'admin' && (
    <Link to="/dashboard" className="...">Admin Dashboard</Link>
  )}

  

  return (
    <nav className="bg-blue-300 shadow-md px-6 py-4 flex justify-between items-center">
      <div className="text-lg text-blue-600 font-semibold">AI Interview</div>

      <div className="flex gap-6 items-center">
        {/* Always visible */}
        <Link to="/" className="text-gray-700 hover:text-blue-600">
          Home
        </Link>

        {currentUser && (
          <>
            <Link to="/upload" className="text-gray-700 hover:text-blue-600">
              Upload Resume
            </Link>
            <Link to="/interview" className="text-gray-700 hover:text-blue-600">
              Interview
            </Link>
            <Link to="/feedback" className="text-gray-700 hover:text-blue-600">
              Feedback
            </Link>
            <Link to="/history" className="text-gray-700 hover:text-blue-600">
              History
            </Link>
          </>
        )}
      </div>

      <div className="flex items-center space-x-4">
        {currentUser ? (
          <>
            <span className="text-gray-700">Hi, {currentUser.email}</span>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-700 hover:text-blue-700">
              Login
            </Link>
            <Link to="/signup" className="text-gray-700 hover:text-blue-700">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
