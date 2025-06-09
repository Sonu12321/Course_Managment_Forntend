import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { Button } from '../../Components/Contianer';
import { BookOpen, Edit, Trash2, Loader2, Eye, Users, Heart, CheckCircle, BarChart, MessageSquare, Star, X } from 'lucide-react';

const ProfessorCourses = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [courseStats, setCourseStats] = useState({});
  const [completionStats, setCompletionStats] = useState({});
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0
  });
  const [refreshing, setRefreshing] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [reviewsData, setReviewsData] = useState({ 
    courses: [], 
    totalReviews: 0, 
    overallAverageRating: 0, 
    courseCount: 0 
  });
  const [loadingReviews, setLoadingReviews] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (decoded.role !== 'professor') {
        navigate('/');
        return;
      }
      fetchProfessorCourses();
    } catch (error) {
      console.error('Token validation error:', error);
      navigate('/login');
    }
  }, [token, navigate]);

  const fetchProfessorCourses = async () => {
    try {
      setLoading(true);
      // Fetch courses
      const courseResponse = await axios.get('https://course-creation-backend.onrender.com/api/courses/professor-courses', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const fetchedCourses = courseResponse.data.courses;
      setCourses(fetchedCourses);

      // Calculate course stats
      const published = fetchedCourses.filter((course) => course.status === 'published').length;
      setStats({
        total: fetchedCourses.length,
        published: published,
        draft: fetchedCourses.length - published,
      });

      // Fetch enrollment and wishlist stats
      
      // Fetch reviews
      // Fetch reviews
      const reviewsResponse = await axios.get('https://course-creation-backend.onrender.com/api/students/professor/reviews', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReviewsData(reviewsResponse.data);
    } catch (error) {
      console.error('Error fetching courses or reviews:', error);
      setError('Failed to fetch data. ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchProfessorCourses();
  };




  const toggleReviewsSection = () => {
    setShowReviews(!showReviews);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={16}
          className={i <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
        />
      );
    }
    return stars;
  };

  if (loading && courses.length === 0) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <span className="text-xl font-medium text-gray-700">Loading your courses...</span>
        <p className="text-gray-500 mt-2">Please wait while we fetch your course data</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b pb-6 border-gray-200">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">My Courses</h1>
            <p className="text-lg text-gray-600 mt-2">Manage your educational content and track student progress with ease.</p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mt-6 md:mt-0">
            <Button
              onClick={toggleReviewsSection}
              className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 flex items-center justify-center text-base font-semibold"
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              {showReviews ? 'Hide Reviews' : 'View Course Reviews'}
            </Button>
            <Button
              onClick={() => navigate('/CourseCreation')}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 flex items-center justify-center text-base font-semibold"
            >
              <BookOpen className="mr-2 h-5 w-5" />
              Create New Course
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Total Courses</h3>
                <p className="text-4xl font-bold text-gray-900 mt-2">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <BookOpen className="h-7 w-7 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Published</h3>
                <p className="text-4xl font-bold text-gray-900 mt-2">{stats.published}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-7 w-7 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500 hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Drafts</h3>
                <p className="text-4xl font-bold text-gray-900 mt-2">{stats.draft}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Edit className="h-7 w-7 text-yellow-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Average Rating</h3>
                <p className="text-4xl font-bold text-gray-900 mt-2">
                  {reviewsData.overallAverageRating ? reviewsData.overallAverageRating.toFixed(1) : "0.0"}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Star className="h-7 w-7 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 text-red-800 p-4 rounded-lg text-center mb-8 border border-red-300 shadow-sm animate-fadeIn transition-all duration-300">
            <p className="font-medium text-lg flex items-center justify-center"><X className="mr-2" />{error}</p>
          </div>
        )}

        {/* Reviews Section */}
        {showReviews && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-10 border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800">Course Reviews</h2>
              <Button
                onClick={toggleReviewsSection}
                className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              >
                <X size={28} />
              </Button>
            </div>
            {loadingReviews ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                <span className="ml-3 text-lg text-gray-600">Loading reviews...</span>
              </div>
            ) : reviewsData.courses.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-6" />
                <p className="text-xl text-gray-500 font-medium">No reviews found for your courses yet.</p>
                <p className="text-gray-400 mt-2">Encourage your students to leave feedback!</p>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="bg-purple-50 p-5 rounded-lg border border-purple-200 flex items-center justify-between shadow-sm">
                  <h3 className="text-xl font-semibold text-purple-800 flex items-center">
                    <BarChart className="mr-3 h-6 w-6" />
                    Overall Review Summary
                  </h3>
                  <p className="text-lg font-medium text-purple-700">
                    <span className="font-bold">{reviewsData.courseCount}</span> courses, <span className="font-bold">{reviewsData.totalReviews}</span> reviews, <span className="font-bold">{reviewsData.overallAverageRating.toFixed(1)}</span> average rating
                  </p>
                </div>
                {reviewsData.courses.map((course) => (
                  <div key={course.courseId} className="border rounded-xl p-6 shadow-sm bg-gray-50 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center mb-5">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="h-20 w-20 object-cover rounded-lg mr-5 border border-gray-200 shadow-sm"
                      />
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{course.title}</h3>
                        <p className="text-md text-gray-600 mt-1">
                          <span className="font-semibold">{course.reviewCount}</span> reviews • <span className="font-semibold">{course.averageRating.toFixed(1)}</span> average rating
                        </p>
                      </div>
                    </div>
                    {course.reviews.length === 0 ? (
                      <p className="text-gray-500 italic text-center py-4">No reviews for this course yet.</p>
                    ) : (
                      <div className="space-y-6 mt-4">
                        {course.reviews.map((review) => (
                          <div key={review.reviewId} className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                            <div className="flex items-start">
                              <img
                                src={review.user.profileImage || 'https://via.placeholder.com/50'} // Increased size for better visibility
                                alt={review.user.name}
                                className="h-12 w-12 rounded-full mr-4 border border-gray-200"
                              />
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <div>
                                    <p className="text-md font-semibold text-gray-900">{review.user.name}</p>
                                    <div className="flex mt-1">{renderStars(review.rating)}</div>
                                  </div>
                                  <p className="text-sm text-gray-500">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                                <p className="mt-2 text-gray-700 leading-relaxed">{review.comment}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {courses.length === 0 ? (
          <div className="bg-white shadow-lg rounded-xl p-12 text-center border border-gray-200">
            <div className="w-24 h-24 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <BookOpen className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">No courses yet</h3>
            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
              Start creating your first course to share your knowledge with students around the world.
            </p>
            <Button
              onClick={() => navigate('/CourseCreation')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 text-lg font-semibold"
            >
              Create Your First Course
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Table Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <div className="text-md text-gray-600">
                Showing <span className="font-bold text-gray-800">{courses.length}</span> courses
              </div>
            </div>

            {/* Course Table */}
            <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Course</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Duration</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {courses.map((course) => {
                      const courseReviewData = reviewsData.courses.find((c) => c.courseId === course._id) || {
                        averageRating: 0,
                        reviewCount: 0,
                      };
                      return (
                        <tr key={course._id} className="hover:bg-blue-50 transition-colors duration-150">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                                <img className="h-full w-full object-cover" src={course.thumbnail} alt={course.title} />
                              </div>
                              <div className="ml-4">
                                <div className="text-base font-medium text-gray-900">{course.title}</div>
                                <div className="text-sm text-gray-600 truncate max-w-xs mt-1">
                                  {course.description?.substring(0, 70)}...
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              {course.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">${course.price}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-600">{course.duration} hours</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${course.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                            >
                              {course.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex space-x-2 justify-end">
                              <button
                                onClick={() => navigate(`/update-course/${course._id}`)}
                                className="text-indigo-600 hover:text-indigo-900 p-2 rounded-full hover:bg-indigo-50 transition-colors duration-200" title="Edit course"
                              >
                                <Edit size={20} />
                              </button>
                              <button
                                onClick={() => navigate(`/course/${course._id}`)}
                                className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-50 transition-colors duration-200" title="Preview course"
                              >
                                <Eye size={20} />
                              </button>
                              <button
                                onClick={() => console.log('Delete course', course._id)} // Placeholder for delete action
                                className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-50 transition-colors duration-200" title="Delete course"
                              >
                                <Trash2 size={20} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfessorCourses;