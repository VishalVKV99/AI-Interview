import React, { useEffect, useState } from 'react';

const MicRecorder = ({ isRecording, setIsRecording, setAnswer }) => {
  const [recognition, setRecognition] = useState(null);
  const [transcript, setTranscript] = useState('');

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Your browser does not support Speech Recognition.');
      return;
    }

    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = 'en-US'; // Set correct language

    recognitionInstance.onresult = (event) => {
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcriptChunk = result[0].transcript;

        if (result.isFinal) {
          setTranscript((prev) => `${prev} ${transcriptChunk}`.trim());
          setAnswer((prev) => `${prev} ${transcriptChunk}`.trim());
        } else {
          interimTranscript += transcriptChunk;
        }
      }
    };

    recognitionInstance.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
    };

    setRecognition(recognitionInstance);
  }, [setAnswer]);

  const startListening = () => {
    if (recognition) {
      setTranscript('');
      setAnswer('');
      recognition.start();
      setIsRecording(true);
      console.log('Recording started...');
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsRecording(false);
      console.log('Recording stopped');
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="mb-4">
      <button
        onClick={toggleRecording}
        className={`px-4 py-2 rounded text-white ${isRecording ? 'bg-red-500' : 'bg-green-500'}`}
      >
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>

      {transcript && (
        <p className="mt-2 text-gray-700">
          <strong>Recognized:</strong> {transcript}
        </p>
      )}
    </div>
  );
};

export default MicRecorder;
