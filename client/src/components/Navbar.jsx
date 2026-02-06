import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div><h1 className="text-2xl font-bold" style={{fontStyle:"italic"}}>Spark</h1></div>
            <Link to="/" className="text-xl font-bold px-6  py-5 text-red-800">MyApp</Link>
            <Link to="/" className="text-xl font-bold px-6 py-5 text-blue-600">Job Alert</Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
            <Link to="/about" className="text-gray-700 hover:text-blue-600">About</Link>
            <Link to="/contact" className="text-gray-700 hover:text-blue-600">Contact</Link>
            <Link to="/job" className="text-gray-700 hover:text-blue-600">Job</Link>
            
            {user ? (
              <>
                <span className="text-gray-500">Hi, {user.name}</span>
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-blue-600 font-semibold">Admin Panel</Link>
                )}
                <button 
                  onClick={logout}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="bg-green-600 text-Black px-3 py-1 rounded hover:bg-green-700">Login</Link>
                <Link to="/register" className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;