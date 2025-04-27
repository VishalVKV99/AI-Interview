import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col justify-center items-center text-white relative"
      style={{
        backgroundImage: `url('/home.png')`, // ✅ Assuming it's in public/home.jpg
        backgroundColor: '#1a1a1a', // fallback brownish if image fails
      }}
    >
      {/* Optional dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>

      {/* Foreground content */}
      <div className="relative z-10 p-8 text-center">
        <h1 className="text-5xl font-bold mb-6">AI Interview</h1>
        <p className="text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
          Get ready for your dream job with AI-powered mock interviews! Upload your resume,
          practice answering dynamic, personalized questions, and receive instant feedback to
          improve your skills and confidence.
        </p>

        <div className="flex flex-col md:flex-row gap-4 justify-center">
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

        <footer className="mt-12 text-sm text-white">
          © {new Date().getFullYear()} AI Interview. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
