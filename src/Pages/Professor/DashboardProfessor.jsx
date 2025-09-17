import React from 'react';
import { Link } from 'react-router-dom';
import ScreenPro from '../../ExtraPages/ScreenPro';
import { BookOpen, Video, Upload, DollarSign } from 'lucide-react';

function DashboardProfessor() {
  const sections = [
    {
      title: 'Plan your course',
      description: 'Get organized and create the best possible learning experience',
      icon: <BookOpen className="h-10 w-10 text-blue-600 mb-4" />,
      items: [
        'Set your course goals',
        'Create an outline',
        'Plan your content',
        'Record your video lectures'
      ]
    },
    {
      title: 'Create your content',
      description: 'Build your course using our course creation tools',
      icon: <Video className="h-10 w-10 text-green-600 mb-4" />,
      items: [
        'Film & edit your video',
        'Build your curriculum',
        'Setup your test content',
        'Add course details'
      ]
    },
    {
      title: 'Publish your course',
      description: 'Setup your course landing page and pricing',
      icon: <Upload className="h-10 w-10 text-purple-600 mb-4" />,
      items: [
        'Price your course',
        'Course landing page',
        'Course messages',
        'Submit for review'
      ]
    }
  ];

  return (
    <>
      <ScreenPro />

      <div className="max-w-7xl mx-auto px-5 sm:px-10 lg:px-16 mt-20 relative z-20 pb-20">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-12 border border-blue-200">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-6 text-center select-none">
            Create Your Course
          </h1>
          <div className="w-28 h-1 bg-blue-500 rounded-full mx-auto mb-14 shadow-md"></div>

          <div className="grid md:grid-cols-3 gap-12">
            {sections.map((section, idx) => (
              <section
                key={idx}
                aria-labelledby={`section-${idx}`}
                className="bg-white rounded-2xl shadow-lg p-9 border-t-6 border-blue-500 hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1 cursor-pointer"
                tabIndex={0}
                role="region"
                aria-describedby={`desc-section-${idx}`}
              >
                <div className="flex flex-col items-center text-center mb-8">
                  {section.icon}
                  <h2
                    id={`section-${idx}`}
                    className="text-2xl font-semibold text-gray-900 mb-5 select-none"
                  >
                    {section.title}
                  </h2>
                </div>
                <p
                  id={`desc-section-${idx}`}
                  className="text-gray-700 mb-10 max-w-xs mx-auto leading-relaxed"
                >
                  {section.description}
                </p>
                <ul className="space-y-4 max-w-xs mx-auto">
                  {section.items.map((item, itemIndex) => (
                    <li
                      key={itemIndex}
                      className="flex items-center text-gray-800 p-3 rounded-lg hover:bg-blue-50 focus-visible:bg-blue-50 focus:outline-none transition-colors duration-200 cursor-pointer"
                      tabIndex={0}
                      role="link"
                    >
                      <span className="w-3 h-3 bg-blue-600 rounded-full mr-4 flex-shrink-0"></span>
                      <Link
                        to="#"
                        className="hover:text-blue-700 focus-visible:text-blue-700 transition-colors duration-200 truncate"
                        aria-label={`Go to ${item}`}
                        tabIndex={-1} // Link itself excluded from tab but contained in li as interactive
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          <div className="mt-20 text-center">
            <Link
              to="/CourseCreation"
              aria-label="Start creating your course"
              className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold py-4 px-12 rounded-3xl shadow-xl hover:shadow-2xl select-none transition duration-300 text-xl"
            >
              <DollarSign className="mr-4 h-6 w-6" />
              Start Creating Your Course
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default DashboardProfessor;
