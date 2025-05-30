import React from 'react';

const AboutUs = () => {
    
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 text-gray-800">
      <h1 className="text-4xl font-bold text-center mb-8">About Us</h1>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-2">Our Mission</h2>
        <p className="text-lg leading-relaxed">
          Our AI Interview Platform is designed to simulate real-world technical interviews, helping candidates prepare confidently by answering dynamically generated questions based on their resumes. The app enables interactive interview experiences with features like real-time voice input, feedback generation, and company-specific interview flows.
        </p>
        <p className="text-lg leading-relaxed mt-4">
          Our goal is to democratize interview preparation, offering personalized feedback and insights so that candidates can improve continuously and land their dream jobs.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-2">Key Features</h2>
        <ul className="list-disc list-inside text-lg space-y-1">
          <li>Upload your resume to generate personalized questions</li>
          <li>Voice-based answering with real-time transcription</li>
          <li>AI feedback based on content and communication quality</li>
          <li>Company-specific interview modes and feedback reports</li>
          <li>Downloadable PDF reports for post-interview insights</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Meet Our Team</h2>
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <img
              src="./boy.png" // Replace with actual image or remove
              alt="Vishal Kumar Verma"
              className="w-28 h-28 rounded-full object-cover border-2 border-blue-500"
            />
            <div>
              <h3 className="text-xl font-bold">Vishal Kumar Verma</h3>
              <p className="text-gray-700">Developer | Leader</p>
              <p className="mt-2">📞 Phone: +91-9525668125</p>
              <p>📧 Email: vishalverma3242@gmail.com</p>
              <p className="mt-2">
                🔗 GitHub: <a href="https://github.com/VishalVKV99/" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">https://www.linkedin.com/in/vishal-verma-282916238/</a>
              </p>
              <p>
                🌐 LinkedIn: <a href="https://www.linkedin.com/in/vishal-verma-282916238/" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">https://www.linkedin.com/in/vishal-verma-282916238/</a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
