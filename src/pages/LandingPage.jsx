import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../layout/Footer'; 

import { 
  FaBullseye as SkillIcon,
  FaMicrophoneAlt as SpeechIcon,
  FaChartBar as AnalyticsIcon,
  FaRobot as AdaptiveIcon,
  FaFilePdf as PdfIcon
} from 'react-icons/fa';
import Button from '@mui/material/Button';

const AboutSection = () => {
  return (
    <>  
    <section id="about" className="container mx-auto px-4 py-12 bg-blue-100 about-section">
      <div className="max-w-6xl mx-auto">
        
        <div className="text-center mb-12">
           <h1 className="text-5xl font-serif mb-6">AI-powered Interview preparation,Where AI meets ambition - AI Interview </h1>
        <p className="text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
          Get ready for your dream job with AI-powered mock interviews! Upload your resume,
          practice answering dynamic, personalized questions, and receive instant feedback to
          improve your skills and confidence.
        </p>

          <div className="inline-block bg-blue-100 px-3 py-1 rounded-full mb-3">
            <p className="text-blue-600 font-medium text-sm">Our Features</p>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">AI-Powered Interview Preparation</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Get interview-ready with our smart platform that adapts to your skill level and provides real-time feedback.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Feature 1 */}
          <div className="bg-white rounded-lg p-6 shadow-sm transition-all duration-700 hover:shadow-lg hover:-translate-y-2">
            <div className="mb-4 flex justify-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center transition-transform duration-500 hover:scale-110">
                <SkillIcon className="text-blue-500 h-5 w-5" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-center mb-3">🎯 Skill-Based Questioning</h3>
            <p className="text-center text-gray-600 text-sm">
              Generates personalized interview questions based on your resume or selected skills for targeted evaluation.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-lg p-6 shadow-sm transition-all duration-700 hover:shadow-lg hover:-translate-y-2">
            <div className="mb-4 flex justify-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center transition-transform duration-500 hover:scale-110">
                <SpeechIcon className="text-blue-500 h-5 w-5" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-center mb-3">🗣 Real-Time Speech Analysis</h3>
            <p className="text-center text-gray-600 text-sm">
              Captures and analyzes spoken responses instantly, mimicking a real interview environment with live feedback.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-lg p-6 shadow-sm transition-all duration-700 hover:shadow-lg hover:-translate-y-2">
            <div className="mb-4 flex justify-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center transition-transform duration-500 hover:scale-110">
                <AnalyticsIcon className="text-blue-500 h-5 w-5" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-center mb-3">📊 Smart Feedback & Reports</h3>
            <p className="text-center text-gray-600 text-sm">
              Delivers AI-generated performance insights with downloadable PDF reports.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white rounded-lg p-6 shadow-sm transition-all duration-700 hover:shadow-lg hover:-translate-y-2">
            <div className="mb-4 flex justify-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center transition-transform duration-500 hover:scale-110">
                <AdaptiveIcon className="text-blue-500 h-5 w-5" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-center mb-3">⏱ Adaptive Interview Experience</h3>
            <p className="text-center text-gray-600 text-sm">
              Dynamically adjusts question difficulty based on your responses for realistic practice.
            </p>
          </div>
        </div>

        <div className="text-center mt-12">
          <Link to='/demo'>
            <Button 
              variant="contained" 
              className="about-button"
              startIcon={<PdfIcon />}
            >
              Try Demo Interview
            </Button>
          </Link>
        </div>
      </div>
    </section>
      <Footer />
  </>
  );
};

export default AboutSection;