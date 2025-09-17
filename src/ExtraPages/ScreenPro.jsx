import React from 'react';
import backgroundImage from '../public/teacher-online-class.jpg';
import { useNavigate } from 'react-router-dom';

function ScreenPro() {
  const navigate = useNavigate();
  return (
    <section
      className="min-h-screen bg-cover bg-center bg-no-repeat relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.25), rgba(243, 244, 246, 0.85)), url(${backgroundImage})`,
        backgroundAttachment: 'fixed',
      }}
      aria-label="Instructor platform promotional banner"
    >
      <div className="min-h-screen flex items-center">
        <div className="container mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
          <div className="max-w-3xl">
            <div className="bg-white/30 backdrop-blur-md p-10 rounded-2xl shadow-xl border border-white/40">
              <h2 className="text-sm uppercase tracking-widest text-blue-600 font-bold mb-3 select-none">
                Instructor Platform
              </h2>
              <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-8 font-limelight leading-tight tracking-tight">
                Lead the way <br />
                in learning
              </h1>
              <div className="w-20 h-1 bg-blue-600 rounded-full mb-8"></div>
              <p className="text-xl sm:text-2xl font-medium text-gray-800 font-poppins mb-10 leading-relaxed">
                Become part of our teaching community and share your expertise with the world.
              </p>
              <button
                onClick={() => navigate('/CourseCreation')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50"
                aria-label="Start teaching today"
              >
                Start Teaching Today
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative blob elements */}
      <div className="pointer-events-none absolute top-20 right-10 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
      <div className="pointer-events-none absolute bottom-20 left-10 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
    </section>
  );
}

export default ScreenPro;
