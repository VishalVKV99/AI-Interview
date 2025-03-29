import { Link } from 'react-router-dom';




export default function Home() {
       <Link to="/upload" className="bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-600">
        Start Interview
      </Link>
  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold mb-4">Welcome to AI Interview App</h1>
      <a href="/upload" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Start Interview
      </a>
    </div>
  );
}