import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-300">
   
    <div className="text-center py-20">
      <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
         <span className="text-blue-800">Find Your Dream Job</span>
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
        Explore Your Job Opportunities
      </p>
      <div className="bg-white rounded-full shadow-md flex items-center overflow-hidden border pr-4 px-2 py-1"> 
        <input type="text" placeholder="Enter Your Skill" className="flex-1 px-6 py-8 text-gray-500 outline-none " />
        <button className="bg-yellow-400 hover:bg-yellow-500 text-white px-8 py-4 rounded-full">Search</button>
      </div>
      <br />
      <br />
      
      <div className="space-x-4">
        {user ? (
          <Link 
            to="/profile" 
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Go to Dashboard
          </Link>
        ) : (
          <>
            <Link 
              to="/register" 
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Get Started
            </Link>
            <Link 
              to="/login" 
              className="bg-white text-blue-600 border border-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              Login
            </Link>
          </>
        )}
      </div>
    </div>
  </div>
  );
};

export default Home;