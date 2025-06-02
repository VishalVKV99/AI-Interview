import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col justify-center items-center text-white"
      style={{
        backgroundImage: `url('/home.png')`, 
      }}
    >
      <div className="bg-black bg-opacity-50 p-8 rounded-lg text-center shadow-lg">
        <h1 className="text-4xl font-bold mb-6">Welcome to AI Interview App</h1>

        <Link
          to="/upload"
          className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 transition"
        >
          Start Interview
        </Link>
      </div>
    </div>
  );
}
