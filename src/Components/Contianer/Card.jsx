import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BookOpen, User, Clock, Tag, AlertCircle, Loader2, Lock } from 'lucide-react';

const CourseCard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Dummy course data to show when user is not logged in
  const dummyCourses = [
    {
      _id: 'dummy1',
      title: 'Introduction to Web Development',
      description: 'Learn the fundamentals of HTML, CSS, and JavaScript to build modern websites from scratch.',
      thumbnail: 'https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      price: 49.99,
      instructor: { firstname: 'John', lastname: 'Doe' },
      category: 'Web Development',
      level: 'Beginner'
    },
    {
      _id: 'dummy2',
      title: 'Advanced React Patterns',
      description: 'Master advanced React concepts including hooks, context API, and performance optimization techniques.',
      thumbnail: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      price: 79.99,
      instructor: { firstname: 'Sarah', lastname: 'Johnson' },
      category: 'JavaScript',
      level: 'Advanced'
    },
    {
      _id: 'dummy3',
      title: 'Python for Data Science',
      description: 'Learn how to use Python for data analysis, visualization, and machine learning applications.',
      thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      price: 0,
      instructor: { firstname: 'Michael', lastname: 'Chen' },
      category: 'Data Science',
      level: 'Intermediate'
    },
    {
      _id: 'dummy4',
      title: 'UI/UX Design Fundamentals',
      description: 'Learn the principles of user interface and user experience design to create beautiful, functional products.',
      thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      price: 59.99,
      instructor: { firstname: 'Emma', lastname: 'Wilson' },
      category: 'Design',
      level: 'Beginner'
    },
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      fetchCourses(token);
    } else {
      // If not authenticated, show dummy data and stop loading
      setCourses(dummyCourses);
      setLoading(false);
    }
  }, []);

  const fetchCourses = async (token) => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:4569/api/courses/admin/courses', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setCourses(response.data.courses);
      } else {
        setError('Failed to fetch courses');
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError('Error fetching courses. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (courseId) => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      navigate('/login', { state: { from: `/course/${courseId}` } });
    } else {
      navigate(`/course/${courseId}`);
    }
  };

  const filteredCourses = filter === 'all' 
    ? courses 
    : courses.filter(course => {
        if (filter === 'free') return course.price === 0;
        if (filter === 'paid') return course.price > 0;
        return true;
      });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 w-full">
        <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
        <p className="text-blue-700 font-medium text-lg">Loading courses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-2xl p-6 my-8 rounded-xl bg-red-50 border border-red-200 shadow-sm">
        <div className="flex items-center space-x-3">
          <AlertCircle className="h-6 w-6 text-red-500" />
          <h3 className="font-semibold text-red-700">Unable to load courses</h3>
        </div>
        <p className="mt-2 text-red-600 pl-9">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 ml-9 px-4 py-2 bg-red-100 hover:bg-red-200 rounded-lg text-red-700 font-medium transition-colors duration-200"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Courses Dashboard</h2>
        
        {!isAuthenticated && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-start">
            <Lock className="h-5 w-5 text-yellow-500 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-yellow-700 font-medium">You're viewing a preview of our courses</p>
              <p className="text-yellow-600 text-sm mt-1">
                <a href="/login" className="text-blue-600 hover:underline font-medium">Log in</a> or 
                <a href="/register" className="text-blue-600 hover:underline font-medium ml-1">register</a> to access all courses and features.
              </p>
            </div>
          </div>
        )}
        
        <div className="flex flex-wrap gap-3 mb-6">
          <button 
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              filter === 'all' 
                ? 'bg-blue-500 text-white shadow-md' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Courses
          </button>
          <button 
            onClick={() => setFilter('free')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              filter === 'free' 
                ? 'bg-blue-500 text-white shadow-md' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Free Courses
          </button>
          <button 
            onClick={() => setFilter('paid')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              filter === 'paid' 
                ? 'bg-blue-500 text-white shadow-md' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Paid Courses
          </button>
        </div>
      </div>

      {filteredCourses.length === 0 ? (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-8 text-center">
          <BookOpen className="h-12 w-12 mx-auto text-blue-400 mb-3" />
          <h3 className="text-xl font-medium text-blue-700 mb-2">No courses available</h3>
          <p className="text-blue-600 max-w-md mx-auto">
            {filter !== 'all' 
              ? `No ${filter} courses found. Try selecting a different filter.` 
              : "There are no courses available at the moment."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCourses.map((course) => (
            <div 
              key={course._id} 
              className="group bg-white rounded-xl overflow-hidden flex flex-col shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className="relative">
                {course.thumbnail ? (
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                    <BookOpen className="h-12 w-12 text-white" />
                  </div>
                )}
                
                {course.price !== undefined && (
                  <div className="absolute top-4 right-4">
                    <div className={`px-3 py-1 rounded-full font-medium text-sm shadow-lg ${
                      course.price === 0 
                        ? 'bg-green-500 text-white' 
                        : 'bg-blue-500 text-white'
                    }`}>
                      {course.price === 0 ? 'Free' : `$${course.price.toFixed(2)}`}
                    </div>
                  </div>
                )}
                
                {!isAuthenticated && (
                  <div className="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white bg-opacity-90 px-4 py-2 rounded-lg shadow-lg">
                      <p className="text-gray-800 font-medium flex items-center">
                        <Lock className="h-4 w-4 mr-1" /> Login to view
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-5 flex-grow flex flex-col">
                <h3 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors mb-2 line-clamp-2">
                  {course.title}
                </h3>
                
                <div className="flex items-center mb-3 text-gray-500">
                  <User className="h-4 w-4 mr-1" />
                  <span className="text-sm">
                    {course.instructor?.firstname} {course.instructor?.lastname}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-3">
                  {course.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {course.category && (
                    <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-md text-xs font-medium">
                      {course.category}
                    </span>
                  )}
                  {course.level && (
                    <span className="px-2 py-1 bg-purple-50 text-purple-600 rounded-md text-xs font-medium">
                      {course.level}
                    </span>
                  )}
                </div>
                
                <button
                  onClick={() => handleViewDetails(course._id)}
                  className={`w-full py-3 rounded-lg font-medium mt-auto transform transition-all duration-200 hover:translate-y-px hover:shadow-lg ${
                    isAuthenticated 
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                      : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
                  }`}
                >
                  {isAuthenticated ? 'View Details' : 'Login to View'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseCard;