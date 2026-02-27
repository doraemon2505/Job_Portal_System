const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20 px-6">

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-gray-900">
            About <span className="text-blue-600">Our Platform</span>
          </h1>

          <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto">
            We connect talented professionals with top companies.
            Our mission is to make job searching simple, fast, and powerful.
          </p>
        </div>

        {/* MISSION & VISION */}
        <div className="grid md:grid-cols-2 gap-10">

          <div className="bg-white shadow-xl rounded-3xl p-10 hover:scale-105 transition duration-300">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">
              🚀 Our Mission
            </h2>
            <p className="text-gray-600 leading-relaxed">
              To empower job seekers by providing transparent,
              fast, and easy access to verified job opportunities
              from trusted companies worldwide.
            </p>
          </div>

          <div className="bg-white shadow-xl rounded-3xl p-10 hover:scale-105 transition duration-300">
            <h2 className="text-2xl font-bold text-purple-600 mb-4">
              🎯 Our Vision
            </h2>
            <p className="text-gray-600 leading-relaxed">
              To become the most trusted job portal platform
              where companies and professionals connect seamlessly
              with modern technology.
            </p>
          </div>

        </div>

        {/* WHY US SECTION */}
        <div className="mt-20 text-center">
          <h2 className="text-4xl font-bold mb-12">
            Why Choose Us?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">

            <div className="bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition">
              <h3 className="text-xl font-semibold text-blue-600 mb-3">
                ⚡ Fast Applications
              </h3>
              <p className="text-gray-600">
                Apply to jobs with one click and track your application
                status in real time.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition">
              <h3 className="text-xl font-semibold text-purple-600 mb-3">
                🏢 Verified Companies
              </h3>
              <p className="text-gray-600">
                Only trusted companies post jobs to ensure quality
                opportunities for users.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition">
              <h3 className="text-xl font-semibold text-green-600 mb-3">
                📊 Application Tracking
              </h3>
              <p className="text-gray-600">
                Monitor your job applications and status updates
                from your dashboard.
              </p>
            </div>

          </div>
        </div>

        {/* TEAM SECTION */}
        <div className="mt-20 text-center">
          <h2 className="text-4xl font-bold mb-12">
            Meet Our Team
          </h2>

          <div className="grid md:grid-cols-3 gap-8">

            <div className="bg-white rounded-3xl shadow-xl p-6 hover:-translate-y-2 transition">
              <div className="w-24 h-24 mx-auto bg-blue-200 rounded-full mb-4"></div>
              <h3 className="font-semibold text-lg">Team Member 1</h3>
              <p className="text-gray-500">Frontend Developer</p>
            </div>

            <div className="bg-white rounded-3xl shadow-xl p-6 hover:-translate-y-2 transition">
              <div className="w-24 h-24 mx-auto bg-purple-200 rounded-full mb-4"></div>
              <h3 className="font-semibold text-lg">Team Member 2</h3>
              <p className="text-gray-500">Backend Developer</p>
            </div>

            <div className="bg-white rounded-3xl shadow-xl p-6 hover:-translate-y-2 transition">
              <div className="w-24 h-24 mx-auto bg-green-200 rounded-full mb-4"></div>
              <h3 className="font-semibold text-lg">Team Member 3</h3>
              <p className="text-gray-500">UI/UX Designer</p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default About;