const About = () => {
  return (
    <div className="min-h-screen bg-linear-to-r from-zinc-500 via-stone-600 to-zinc-900 py-20 px-6">

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-green-900">
            About <span className="text-blue-600">Our Platform</span>
          </h1>

          <p className="mt-6 text-lg text-gray-300 max-w-3xl mx-auto font-bold">
            We connect talented professionals with top companies.
            Our mission is to make job searching simple, fast, and powerful.
          </p>
        </div>

        {/* MISSION & VISION */}
        <div className="grid md:grid-cols-2 gap-10">

          <div className="bg-gray-300 shadow-xl rounded-3xl p-10 hover:scale-105 transition duration-300 ">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">
              🚀 Our Mission
            </h2>
            <p className="text-gray-600 leading-relaxed">
              To empower job seekers by providing transparent,
              fast, and easy access to verified job opportunities
              from trusted companies worldwide.
            </p>
          </div>

          <div className="bg-gray-300 shadow-xl rounded-3xl p-10 hover:scale-105 transition duration-300">
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

            <div className="bg-gray-300 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition cursor-pointer">
              <h3 className="text-xl font-semibold text-blue-600 mb-3">
                ⚡ Fast Applications
              </h3>
              <p className="text-gray-600">
                Apply to jobs with one click and track your application
                status in real time.
              </p>
            </div>

            <div className="bg-gray-300 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition cursor-pointer">
              <h3 className="text-xl font-semibold text-purple-600 mb-3">
                🏢 Verified Companies
              </h3>
              <p className="text-gray-600">
                Only trusted companies post jobs to ensure quality
                opportunities for users.
              </p>
            </div>

            <div className="bg-gray-300 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition cursor-pointer">
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

            <div className="bg-gray-300 rounded-3xl shadow-xl p-6 hover:-translate-y-2 transition cursor-pointer">
              <div className="w-24 h-24 mx-auto bg-blue-300 rounded-full mb-4 ">
               <img src="https://t4.ftcdn.net/jpg/01/93/84/25/360_F_193842588_Oe7qZ7HejoIzyXZwaIiQBY6sjuU96nPK.jpg" 
               className="object-cover w-24 h-24 rounded-full" alt="" />
                </div>
              <h3 className="font-semibold text-lg">Team Member 1</h3>
              <p className="text-gray-500">Frontend Developer</p>
            </div>

            <div className="bg-gray-300 rounded-3xl shadow-xl p-6 hover:-translate-y-2 transition cursor-pointer">
              <div className="w-24 h-24 mx-auto bg-purple-200 rounded-full mb-4">
                <img src="https://img.freepik.com/free-photo/close-up-portrait-beautiful-young-brunette-female-sitting-white-desk-front-computer-home_176532-7908.jpg?semt=ais_rp_progressive&w=740&q=80" className="object-cover w-24 h-24 rounded-full" alt="" />
              </div>
              <h3 className="font-semibold text-lg">Team Member 2</h3>
              <p className="text-gray-500">Backend Developer</p>
            </div>

            <div className="bg-gray-300 rounded-3xl shadow-xl p-6 hover:-translate-y-2 transition cursor-pointer">
              <div className="w-24 h-24 mx-auto bg-green-200 rounded-full mb-4">
                <img src="https://t4.ftcdn.net/jpg/03/69/19/81/360_F_369198116_K0sFy2gRTo1lmIf5jVGeQmaIEibjC3NN.jpg"
                className="w-24 h-24 rounded-full" alt="" />
              </div>
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