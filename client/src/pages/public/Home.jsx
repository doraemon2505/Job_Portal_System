import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className=" bg-gradient-to-b from-white to-purple-300">
   
    <div className="text-center py-20">
      <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
         <span className="text-blue-800">Find Your Dream Job</span>
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
        Explore Your Job Opportunities
      </p>
      <div className="mt-10 bg-white rounded-full shadow-xl flex items-center gap-4 px-6 py-3 w-[70%] h-15 ml-10"> 
        <input type="text" placeholder="Enter Your Skill" className="flex-1 outline-none " />

        <select className='outline-none text-gray-500'>
          <option>Select Experience</option>
          <option>fresher</option>
          <option>1-3 Years Experience</option>
          <option>3+ Years Experience</option>
        </select>

        <button className="bg-yellow-400 hover:bg-yellow-500 text-bold px-8 py-4 rounded-full h-10 w-[15%] flex items-center">Search</button>
      </div>
      <br />
      <br />

      <div className='mt-10 md:'>

      </div>
      
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