import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInterview } from '../context/InterviewContext';

const availableSkills = ['JavaScript', 'React', 'Node.js', 'Python', 'DSA', 'MongoDB'];

const SkillSelection = () => {
  const [selectedSkills, setSelectedSkills] = useState([]);
  const { setResumeData } = useInterview();
  const navigate = useNavigate();

  const toggleSkill = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const startInterview = () => {
    setResumeData({ skills: selectedSkills, projects: [] }); // Only skills used
    navigate('/interview');
  };

  return (
    <div className="p-4 max-w-md mx-auto text-center">
      <h2 className="text-xl font-bold mb-4">Select Skills</h2>
      <div className="grid grid-cols-2 gap-2 mb-4">
        {availableSkills.map((skill) => (
          <button
            key={skill}
            onClick={() => toggleSkill(skill)}
            className={`px-4 py-2 rounded border ${
              selectedSkills.includes(skill) ? 'bg-blue-500 text-white' : 'bg-white text-black'
            }`}
          >
            {skill}
          </button>
        ))}
      </div>
      <button
        onClick={startInterview}
        className="bg-green-600 text-white px-4 py-2 rounded"
        disabled={selectedSkills.length === 0}
      >
        Start Interview
      </button>
    </div>
  );
};

export default SkillSelection;
