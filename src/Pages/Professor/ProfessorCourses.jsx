import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { Button } from '../../Components/Contianer';
import { BookOpen, Edit, Trash2, Loader2, Eye, MessageSquare, Star, CheckCircle, BarChart, X } from 'lucide-react';

const ProfessorCourses = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0
  });
  const [reviewsData, setReviewsData] = useState({ 
    courses: [], 
    totalReviews: 0, 
    overallAverageRating: 0, 
    courseCount: 0 
  });
  const [showReviews, setShowReviews] = useState(false);
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
      const courseResponse = await axios.get('https://course-creation-backend.onrender.com/api/courses/professor-courses', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const fetchedCourses = courseResponse.data.courses;
      setCourses(fetchedCourses);

      const published = fetchedCourses.filter((course) => course.status === 'published').length;
      setStats({
        total: fetchedCourses.length,
        published: published,
        draft: fetchedCourses.length - published,
      });

      const reviewsResponse = await axios.get('https://course-creation-backend.onrender.com/api/students/professor/reviews', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReviewsData(reviewsResponse.data);
    } catch (error) {
      console.error('Error fetching courses or reviews:', error);
      setError('Failed to fetch data. ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
      setLoadingReviews(false);
    }
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
      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white px-4">
        <Loader2 className="w-14 h-14 text-blue-400 animate-spin mb-5" />
        <h2 className="text-2xl font-semibold">Loading your courses...</h2>
        <p className="text-gray-300 mt-2 max-w-xl text-center">Please wait while we fetch your course data.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4 sm:px-6 lg:px-12 text-white">
      <div className="max-w-7xl mx-auto bg-slate-800 bg-opacity-80 rounded-2xl shadow-2xl p-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b border-slate-700 pb-6 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight select-none">My Courses</h1>
            <p className="text-lg text-slate-300 mt-1 max-w-xl">
              Manage your educational content and track student progress with ease.
            </p>
          </div>
          <div className="flex gap-4 w-full max-w-md md:w-auto">
            <Button
              onClick={toggleReviewsSection}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg shadow-md transition transform hover:-translate-y-0.5 flex items-center justify-center"
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              {showReviews ? 'Hide Reviews' : 'View Course Reviews'}
            </Button>
            <Button
              onClick={() => navigate('/CourseCreation')}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md transition transform hover:-translate-y-0.5 flex items-center justify-center"
            >
              <BookOpen className="mr-2 h-5 w-5" />
              Create New Course
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            {
              label: "Total Courses",
              value: stats.total,
              icon: <BookOpen className="h-7 w-7 text-blue-500" />,
              borderColor: "border-blue-500",
              bgColor: "bg-blue-100",
              iconColor: "text-blue-600",
            },
            {
              label: "Published",
              value: stats.published,
              icon: <CheckCircle className="h-7 w-7 text-green-500" />,
              borderColor: "border-green-500",
              bgColor: "bg-green-100",
              iconColor: "text-green-600",
            },
            {
              label: "Drafts",
              value: stats.draft,
              icon: <Edit className="h-7 w-7 text-yellow-500" />,
              borderColor: "border-yellow-500",
              bgColor: "bg-yellow-100",
              iconColor: "text-yellow-600",
            },
            {
              label: "Average Rating",
              value: reviewsData.overallAverageRating ? reviewsData.overallAverageRating.toFixed(1) : "0.0",
              icon: <Star className="h-7 w-7 text-purple-500" />,
              borderColor: "border-purple-500",
              bgColor: "bg-purple-100",
              iconColor: "text-purple-600",
            },
          ].map(({ label, value, icon, borderColor, bgColor, iconColor }) => (
            <div
              key={label}
              className={`bg-slate-900 rounded-xl shadow-lg p-6 border-l-4 ${borderColor} hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-slate-300">{label}</h3>
                  <p className="text-4xl font-bold text-white mt-2">{value}</p>
                </div>
                <div className={`p-3 ${bgColor} rounded-full`}>
                  {icon}
                </div>
              </div>
            </div>
          ))}
        </section>

        {error && (
          <div className="bg-red-700 bg-opacity-80 text-red-200 p-4 rounded-lg mb-10 border border-red-600 shadow-lg flex items-center gap-3">
            <X className="w-6 h-6" />
            <p className="font-semibold">{error}</p>
          </div>
        )}

        {/* Reviews Section */}
        {showReviews && (
          <section className="bg-slate-800 rounded-xl shadow-lg p-8 mb-10 border border-slate-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold">Course Reviews</h2>
              <Button
                onClick={toggleReviewsSection}
                className="text-slate-400 hover:text-slate-300 p-2 rounded-full hover:bg-slate-700 transition-colors duration-200"
                aria-label="Close reviews section"
              >
                <X size={28} />
              </Button>
            </div>

            {loadingReviews ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                <span className="ml-3 text-lg text-slate-300">Loading reviews...</span>
              </div>
            ) : reviewsData.courses.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <MessageSquare className="h-16 w-16 mx-auto mb-6" />
                <p className="text-xl font-medium">No reviews found for your courses yet.</p>
                <p className="mt-2">Encourage your students to leave feedback!</p>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="bg-purple-900 p-5 rounded-lg border border-purple-700 flex items-center justify-between shadow-sm">
                  <h3 className="text-xl font-semibold flex items-center gap-3 text-purple-300">
                    <BarChart className="h-6 w-6" />
                    Overall Review Summary
                  </h3>
                  <p className="text-lg font-medium text-purple-200">
                    <span className="font-bold">{reviewsData.courseCount}</span> courses, <span className="font-bold">{reviewsData.totalReviews}</span> reviews, <span className="font-bold">{reviewsData.overallAverageRating.toFixed(1)}</span> average rating
                  </p>
                </div>

                {reviewsData.courses.map(course => (
                  <div key={course.courseId} className="border rounded-xl p-6 shadow-sm bg-slate-900 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center mb-5 gap-5">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="h-20 w-20 object-cover rounded-lg border border-slate-700 shadow-sm"
                      />
                      <div>
                        <h3 className="text-xl font-bold text-white">{course.title}</h3>
                        <p className="text-md text-slate-300 mt-1">
                          <span className="font-semibold">{course.reviewCount}</span> reviews • <span className="font-semibold">{course.averageRating.toFixed(1)}</span> average rating
                        </p>
                      </div>
                    </div>
                    {course.reviews.length === 0 ? (
                      <p className="text-slate-400 italic text-center py-4">No reviews for this course yet.</p>
                    ) : (
                      <div className="space-y-6 mt-4">
                        {course.reviews.map(review => (
                          <div key={review.reviewId} className="bg-slate-800 p-5 rounded-lg border border-slate-700 shadow-sm">
                            <div className="flex items-start gap-4">
                              <img
                                src={review.user.profileImage || 'https://via.placeholder.com/50'}
                                alt={review.user.name}
                                className="h-12 w-12 rounded-full border border-slate-700"
                              />
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <div>
                                    <p className="text-md font-semibold text-white">{review.user.name}</p>
                                    <div className="flex mt-1">{renderStars(review.rating)}</div>
                                  </div>
                                  <p className="text-sm text-slate-400">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                                <p className="mt-2 text-slate-300 leading-relaxed">{review.comment}</p>
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
          </section>
        )}

        {/* Empty State */}
        {courses.length === 0 && !loading ? (
          <div className="bg-slate-800 rounded-xl p-12 border border-slate-700 text-center">
            <div className="w-24 h-24 mx-auto bg-blue-700 rounded-full flex items-center justify-center mb-6">
              <BookOpen className="h-12 w-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3">No courses yet</h3>
            <p className="text-slate-300 mb-8 max-w-md mx-auto">
              Start creating your first course to share your knowledge with students worldwide.
            </p>
            <Button
              onClick={() => navigate('/CourseCreation')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-lg shadow-md transition transform hover:-translate-y-0.5 text-lg font-semibold"
            >
              Create Your First Course
            </Button>
          </div>
        ) : (
          /* Courses Table */
          <div className="overflow-x-auto rounded-xl shadow-lg border border-slate-700 bg-slate-800 p-6">
            <table className="min-w-full divide-y divide-slate-700">
              <thead className="bg-slate-900">
                <tr>
                  {['Course', 'Category', 'Price', 'Duration', 'Status', 'Actions'].map((header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider select-none"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {courses.map(course => {
                  const reviewData = reviewsData.courses.find(c => c.courseId === course._id) || {
                    averageRating: 0,
                    reviewCount: 0,
                  };
                  return (
                    <tr key={course._id} className="hover:bg-slate-700 transition-colors duration-150 cursor-pointer">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-4">
                          <div className="h-14 w-14 flex-shrink-0 rounded-lg border border-slate-700 shadow-sm overflow-hidden">
                            <img
                              src={course.thumbnail}
                              alt={course.title}
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          </div>
                          <div>
                            <div className="text-white font-semibold text-base">{course.title}</div>
                            <div className="text-slate-400 text-sm truncate max-w-xs">{course.description?.substring(0, 70)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 inline-flex text-xs font-semibold rounded-full bg-blue-700 text-blue-300">
                          {course.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-white">
                        ${course.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-400">
                        {course.duration} hours
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${
                            course.status === 'published'
                              ? 'bg-green-700 text-green-300'
                              : 'bg-yellow-700 text-yellow-300'
                          }`}
                        >
                          {course.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                        <button
                          onClick={() => navigate(`/update-course/${course._id}`)}
                          className="text-indigo-400 hover:text-indigo-600 p-2 rounded-md hover:bg-indigo-700 transition"
                          title="Edit Course"
                          aria-label={`Edit ${course.title}`}
                        >
                          <Edit size={20} />
                        </button>
                        <button
                          onClick={() => navigate(`/course/${course._id}`)}
                          className="text-blue-400 hover:text-blue-600 p-2 rounded-md hover:bg-blue-700 transition"
                          title="Preview Course"
                          aria-label={`Preview ${course.title}`}
                        >
                          <Eye size={20} />
                        </button>
                        <button
                          onClick={() => console.log(`Delete course ${course._id}`)} // Replace with actual delete logic
                          className="text-red-500 hover:text-red-700 p-2 rounded-md hover:bg-red-700 transition"
                          title="Delete Course"
                          aria-label={`Delete ${course.title}`}
                        >
                          <Trash2 size={20} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfessorCourses;
