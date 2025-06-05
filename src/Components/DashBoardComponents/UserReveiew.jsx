import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../Components/Contianer/Button';
import { FaGraduationCap, FaBook, FaUsers, FaChalkboardTeacher } from 'react-icons/fa';

// Simple Card component to replace shadcn UI Card
const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      {children}
    </div>
  );
};

// Simple CardContent component to replace shadcn UI CardContent
const CardContent = ({ children, className = '' }) => {
  return (
    <div className={`p-4 ${className}`}>
      {children}
    </div>
  );
};

const features = [
  {
    icon: <FaGraduationCap className="text-4xl text-blue-600" />,
    title: 'Course Management',
    description: 'Create, manage, and update courses with ease.',
  },
  {
    icon: <FaBook className="text-4xl text-blue-600" />,
    title: 'Student Tracking',
    description: 'Track student progress, grades, and attendance.',
  },
  {
    icon: <FaUsers className="text-4xl text-blue-600" />,
    title: 'Admin Dashboard',
    description: 'Powerful tools for instructors and admins.',
  },
  {
    icon: <FaChalkboardTeacher className="text-4xl text-blue-600" />,
    title: 'Community Learning',
    description: 'Connect with learners and educators worldwide.',
  },
];

const UserReveiew = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50 text-gray-900">
    
      {/* Hero Section */}
      <section className="relative py-20 px-6 lg:flex lg:items-center lg:max-w-7xl lg:mx-auto lg:gap-8">
        <div className="lg:w-1/2 text-center lg:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6">
            Transform Your <span className="text-blue-600">Learning Experience</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0">
            Streamline online teaching and learning with CoursePilot, the modern course management platform trusted by thousands.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link to="/register">
              <Button bgColor="bg-blue-600" className="text-lg px-8 py-3 rounded-full hover:bg-blue-700">
                Get Started
              </Button>
            </Link>
            <Link to="/courses">
              <Button bgColor="bg-transparent" textColor="text-blue-600" className="text-lg px-8 py-3 rounded-full border border-blue-600 hover:bg-blue-100">
                Browse Courses
              </Button>
            </Link>
          </div>
        </div>
        <div className="lg:w-1/2 mt-8 lg:mt-0">
          <img
            src="https://images.unsplash.com/photo-1516321310762-479437144403?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80"
            alt="Students learning online"
            className="w-full h-[400px] object-cover rounded-2xl shadow-xl transform hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-blue-100 rounded-full opacity-50 hidden lg:block"></div>
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-100 rounded-full opacity-30 hidden lg:block"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-base text-blue-600 font-semibold uppercase">Features</h2>
          <h3 className="text-3xl md:text-4xl font-extrabold mt-2">Why Choose CoursePilot?</h3>
          <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
            Discover a better way to manage and deliver education with our comprehensive platform.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="shadow-lg rounded-2xl hover:scale-105 transition-transform duration-300"
              >
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">{feature.icon}</div>
                  <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-100 to-purple-100 text-center">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Join 10,000+ Learners & Educators</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Trusted by institutions and individuals worldwide for seamless course management.
          </p>
          <img
            src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80"
            alt="Global community of learners"
            className="w-full h-[300px] object-cover rounded-2xl shadow-lg mb-8"
          />
          <Link to="/demo">
            <Button bgColor="bg-transparent" textColor="text-blue-600" className="text-lg px-8 py-3 rounded-full border border-blue-600 hover:bg-blue-100">
              View Demo
            </Button>
          </Link>
        </div>
      </section>

    
    </div>
  );
};

export default UserReveiew;