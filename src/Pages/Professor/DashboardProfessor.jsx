import React from 'react'
import { Link } from 'react-router-dom'
import ScreenPro from '../../ExtraPages/ScreenPro'
import { BookOpen, Video, Upload, DollarSign } from 'lucide-react'

function DashboardProfessor() {
  const sections = [
    {
      title: "Plan your course",
      description: "Get organized and create the best possible learning experience",
      icon: <BookOpen className="h-10 w-10 text-blue-500 mb-4" />,
      items: [
        "Set your course goals",
        "Create an outline",
        "Plan your content",
        "Record your video lectures"
      ]
    },
    {
      title: "Create your content",
      description: "Build your course using our course creation tools",
      icon: <Video className="h-10 w-10 text-green-500 mb-4" />,
      items: [
        "Film & edit your video",
        "Build your curriculum",
        "Setup your test content",
        "Add course details"
      ]
    },
    {
      title: "Publish your course",
      description: "Setup your course landing page and pricing",
      icon: <Upload className="h-10 w-10 text-purple-500 mb-4" />,
      items: [
        "Price your course",
        "Course landing page",
        "Course messages",
        "Submit for review"
      ]
    }
  ]

  return (
    <>
      <ScreenPro/>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 relative z-20 pb-16">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl p-8 border border-blue-100">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
            Create Your Course
          </h1>
          <div className="w-20 h-1 bg-blue-600 mx-auto mb-8"></div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {sections.map((section, index) => (
              <div 
                key={index} 
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-t-4 border-blue-500"
              >
                <div className="flex flex-col items-center text-center mb-4">
                  {section.icon}
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    {section.title}
                  </h2>
                </div>
                <p className="text-gray-600 mb-6 text-center">
                  {section.description}
                </p>
                <ul className="space-y-3">
                  {section.items.map((item, itemIndex) => (
                    <li 
                      key={itemIndex}
                      className="flex items-center text-gray-700 p-2 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                    >
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      <Link 
                        to="#" 
                        className="hover:text-blue-600 transition-colors duration-200"
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link 
              to="/CourseCreation" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300 shadow-lg hover:shadow-xl inline-flex items-center"
            >
              <DollarSign className="mr-2 h-5 w-5" />
              Start Creating Your Course
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default DashboardProfessor