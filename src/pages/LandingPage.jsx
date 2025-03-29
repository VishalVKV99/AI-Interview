import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-100 to-indigo-200 p-8">
      <h1 className="text-5xl font-bold text-gray-800 mb-4 text-center">AI Interview </h1>

      <p className="text-lg text-gray-700 max-w-2xl text-center mb-8 leading-relaxed">
        Get ready for your dream job with AI-powered mock interviews! Upload your resume, practice answering dynamic, personalized questions, and receive instant feedback to improve your skills and confidence.
      </p>

      <div className="flex flex-col md:flex-row gap-4 md:space-x-6">
        <Link to="/login">
          <button className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-all text-lg">
            Login
          </button>
        </Link>

        <Link to="/signup">
          <button className="bg-green-500 text-white px-8 py-3 rounded-lg hover:bg-green-600 transition-all text-lg">
            Sign Up
          </button>
        </Link>
      </div>

      <footer className="mt-12 text-sm text-gray-600 text-center">
        © {new Date().getFullYear()} AI Interview. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
