import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { parseResume } from '../utils/resumeParser';
import { InterviewContext } from '../contexts/InterviewContext';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { setResumeData } = useContext(InterviewContext);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
  };

  const handleUpload = async () => {
    if (!file) {
      setError('⚠️ Please upload a resume file.');
      return;
    }

    try {
      setLoading(true);
      const parsedData = await parseResume(file);

      if (!parsedData.skills.length) {
        setError('❌ No skills found in the resume. Please upload a different file.');
        setLoading(false);
        return;
      }

      console.log('✅ Parsed Resume Data:', parsedData);
      setResumeData(parsedData);
      navigate('/interview');

    } catch (err) {
      console.error('❌ Error while parsing:', err);
      setError('❌ Failed to parse the resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Upload Your Resume</h1>

      <input
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        className="mb-4 px-4 py-2 border rounded"
      />

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <button
        onClick={handleUpload}
        disabled={loading}
        className={`px-6 py-2 rounded text-white ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
      >
        {loading ? 'Parsing Resume...' : 'Upload & Start Interview'}
      </button>
    </div>
  );
};

export default Upload;
