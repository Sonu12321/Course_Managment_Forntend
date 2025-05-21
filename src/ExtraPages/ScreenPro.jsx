import React from 'react'
import backgroundImage from '../public/teacher-online-class.jpg'
import { useNavigate } from 'react-router-dom'

function ScreenPro() {
  const navigate = useNavigate()
  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat relative overflow-hidden"
      style={{ 
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(243, 244, 246, 0.85)), url(${backgroundImage})`,
        backgroundAttachment: 'fixed'
      }}
    >    
      <div className='min-h-screen flex items-center'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
          <div className='max-w-3xl'>
            <div className='bg-white/20 backdrop-blur-sm p-8 rounded-lg shadow-xl border border-white/30'>
              <h2 className='text-sm uppercase tracking-wider text-blue-600 font-bold mb-2'>
                Instructor Platform
              </h2>
              <h1 className='text-5xl sm:text-6xl font-bold text-gray-900 mb-6 font-limelight leading-tight'>
                Lead the way <br/>in learning
              </h1>
              <div className='w-20 h-1 bg-blue-600 mb-6'></div>
              <p className='text-xl sm:text-2xl font-medium text-gray-800 font-poppins mb-8'>
                Become part of our teaching community and share your expertise with the world.
              </p>
              <button onClick={()=>navigate('/CourseCreation')} className='bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1'>
                Start Teaching Today
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-20 left-10 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
    </div>
  )
}

export default ScreenPro