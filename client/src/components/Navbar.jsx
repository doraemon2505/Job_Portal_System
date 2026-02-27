import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">

          {/* Logo */}
          <div className="flex items-center">
            <Link
              to="/"
              className="text-2xl font-bold text-blue-600"
            >
              MyApp
            </Link>
          </div>

          {/* Menu */}
          <div className="flex items-center gap-5">

            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600"
            >
              Home
            </Link>

            <Link
              to="/about"
              className="text-gray-700 hover:text-blue-600"
            >
              About
            </Link>

            <Link
              to="/jobs"
              className="text-gray-700 hover:text-blue-600"
            >
              Jobs
            </Link>

            <Link
              to="/contact"
              className="text-gray-700 hover:text-blue-600"
            >
              Contact
            </Link>

            {/* ✅ Show My Applications ONLY for normal users */}
            {user && user.role !== "admin" && (
              <Link
                to="/my-applications"
                className="text-gray-700 hover:text-blue-600"
              >
                My Applications
              </Link>
            )}

            {user ? (
              <>
                <span className="text-gray-500">
                  Hi, {user.name}
                </span>

                {/* ✅ Admin Panel */}
                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    className="text-blue-600 font-semibold"
                  >
                    Admin Panel
                  </Link>
                )}

                {/* Logout */}
                <button
                  onClick={logout}
                  className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition"
                >
                  Register
                </Link>
              </>
            )}

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;