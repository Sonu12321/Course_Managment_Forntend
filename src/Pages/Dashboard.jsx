import React from 'react';
import { Link } from 'react-router-dom';
import { FaGraduationCap, FaBook, FaUsers, FaChalkboardTeacher } from 'react-icons/fa';
import img from '../public/LandingPage.jpg'
import Rotation from '../Components/DashBoardComponents/Rotation';
const Dashboard = () => {
  const features = [
    {
      icon: <FaGraduationCap className="text-4xl text-blue-600" />,
      title: "Quality Education",
      description: "Access to premium courses taught by industry experts"
    },
    {
      icon: <FaBook className="text-4xl text-blue-600" />,
      title: "Diverse Courses",
      description: "Wide range of subjects to choose from"
    },
    {
      icon: <FaUsers className="text-4xl text-blue-600" />,
      title: "Community Learning",
      description: "Connect with fellow learners worldwide"
    },
    {
      icon: <FaChalkboardTeacher className="text-4xl text-blue-600" />,
      title: "Expert Instructors",
      description: "Learn from the best in their fields"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-300 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 lg:flex lg:items-center lg:gap-8">
            <div className="relative pb-8 sm:pb-16 md:pb-20 lg:w-1/2 lg:pb-28 xl:pb-32">
              <main className="mt-10 mx-auto px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                <div className="sm:text-center lg:text-left">
                  <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                    <span className="block">Transform your future with</span>
                    <span className="block text-blue-600">Online Learning</span>
                  </h1>
                  <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                    Embark on a journey of knowledge and growth. Access world-class education from anywhere, at any time.
                  </p>
                  <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="relative rounded-full shadow-lg overflow-hidden">
                      <Link
                        to="/Cards"
                        className="relative w-full flex items-center justify-center gap-2 px-8 py-5 md:px-10 md:py-4 border-2 border-white/30 text-base md:text-lg font-bold rounded-full text-white bg-blue-700 hover:bg-blue-800 transition-all duration-300 ease-in-out transform hover:scale-105 overflow-hidden"
                      >
                        Browse Courses
                        {/* Optional: you can add an icon here if needed */}
                        <span className="absolute inset-0 before:absolute before:w-24 before:h-full before:bg-gradient-to-r before:from-transparent before:via-white/70 before:to-transparent before:opacity-60 before:top-0 before:-left-24 hover:before:animate-shine"></span>
                      </Link>
                    </div>

                    <div className="mt-3 sm:mt-0 sm:ml-3">
                      <Link 
                        to="/register" 
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-2xl text-blue-700 bg-blue-100 hover:bg-blue-200 hover:scale-110 transform transition-all duration-500 ease-in-out md:py-4 md:text-lg md:px-10"
                      >
                        Get Started
                      </Link>
                    </div>
                  </div>
                </div>
              </main>
            </div>

            {/* Image Section */}
            <div className="hidden lg:block lg:w-1/2">
              <div className="relative h-1/2">
                <img 
                  src={img} 
                  alt="Learning Platform" 
                  className="w-full h-[400px] object-cover rounded-3xl shadow-xl transform hover:scale-105 transition-transform duration-500 ease-in-out"
                />
                {/* Decorative Elements */}
                <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-blue-100 rounded-full opacity-50"></div>
                <div className="absolute -top-16 -right-16 w-32 h-32 bg-blue-200 rounded-full opacity-30"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
  <Rotation/>
      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              A better way to learn
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Choose from thousands of online courses with new additions published every month.
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <div key={index} className="pt-6">
                  <div className="flow-root bg-white rounded-lg px-6 pb-8 shadow-lg">
                    <div className="-mt-6">
                      <div className="flex items-center justify-center">
                        <span className="p-3 bg-blue-50 rounded-md">
                          {feature.icon}
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight text-center">
                        {feature.title}
                      </h3>
                      <p className="mt-5 text-base text-gray-500 text-center">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
    
    </div>
  );
};

export default Dashboard;