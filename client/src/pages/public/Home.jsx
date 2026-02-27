import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Search, Briefcase, Users, CheckCircle } from "lucide-react";
import jobbackground from "../../assets/jobbackground.jpeg"

const Home = () => {
  const { user } = useAuth();
1
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="bg-black" style={{ backgroundImage: `URL(${jobbackground})`  }} >
        <div className="bg-black w-full opacity-55 w-full mx-auto px-6 py-24 text-center">

          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-tight">
            Find Your Dream Job <br />
            <span className="text-blue-600">Start Your Career Today 🚀</span>
          </h1>

          <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto">
            Discover thousands of job opportunities from top companies.
            Apply in seconds and track your application in real time.
          </p>

          <div className="mt-10 flex justify-center">
            <div className="bg-white shadow-xl rounded-2xl p-3 flex items-center w-full max-w-2xl border">
              <Search className="text-gray-400 mx-3" />
              <input
                type="text"
                placeholder="Search jobs, companies, or skills..."
                className="flex-1 outline-none text-gray-700"
              />
              <button className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition">
                Search
              </button>
            </div>
          </div>

          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            {user ? (
              <Link
                to="/jobs"
                className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:bg-blue-700 transition"
              >
                Explore Jobs
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:bg-blue-700 transition"
                >
                  Get Started
                </Link>

                <Link
                  to="/jobs"
                  className="bg-white text-blue-600 border border-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transition"
                >
                  Browse Jobs
                </Link>
              </>
            )}
          </div>
        </div>

      </div>

      {/* HERO SECTION */}

      {/* STATS SECTION */}
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8 text-center py-16">

        <div className="bg-white shadow-xl rounded-3xl p-10 hover:scale-105 transition">
          <Briefcase className="mx-auto text-blue-600" size={40} />
          <h2 className="text-3xl font-bold mt-4">5000+</h2>
          <p className="text-gray-600 mt-2">Active Jobs</p>
        </div>

        <div className="bg-white shadow-xl rounded-3xl p-10 hover:scale-105 transition">
          <Users className="mx-auto text-purple-600" size={40} />
          <h2 className="text-3xl font-bold mt-4">1200+</h2>
          <p className="text-gray-600 mt-2">Trusted Companies</p>
        </div>

        <div className="bg-white shadow-xl rounded-3xl p-10 hover:scale-105 transition">
          <CheckCircle className="mx-auto text-green-600" size={40} />
          <h2 className="text-3xl font-bold mt-4">8000+</h2>
          <p className="text-gray-600 mt-2">Successful Applications</p>
        </div>

      </div>

      {/* WHY CHOOSE US */}
      <div className="bg-blue-600 text-white py-20">

        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-12">
            Why Choose Our Platform?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">

            <div>
              <h3 className="text-xl font-semibold">🚀 Fast Applications</h3>
              <p className="mt-3 text-blue-100">
                Apply to jobs with just one click and track status easily.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold">🏆 Top Companies</h3>
              <p className="mt-3 text-blue-100">
                Connect with verified companies and premium job listings.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold">📊 Real Time Tracking</h3>
              <p className="mt-3 text-blue-100">
                Monitor your application status instantly.
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* TESTIMONIAL SECTION */}
      <div className="max-w-6xl mx-auto px-6 py-20 text-center">

        <h2 className="text-4xl font-bold mb-12">
          What Our Users Say
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          <div className="bg-white shadow-xl rounded-3xl p-8">
            ⭐⭐⭐⭐⭐
            <p className="mt-4 text-gray-600">
              "Best platform to find tech jobs quickly!"
            </p>
            <h4 className="mt-4 font-semibold">– Rahul</h4>
          </div>

          <div className="bg-white shadow-xl rounded-3xl p-8">
            ⭐⭐⭐⭐⭐
            <p className="mt-4 text-gray-600">
              "Easy application and fast response from companies."
            </p>
            <h4 className="mt-4 font-semibold">– Priya</h4>
          </div>

          <div className="bg-white shadow-xl rounded-3xl p-8">
            ⭐⭐⭐⭐⭐
            <p className="mt-4 text-gray-600">
              "Amazing UI and smooth experience!"
            </p>
            <h4 className="mt-4 font-semibold">– Ankit</h4>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Home;