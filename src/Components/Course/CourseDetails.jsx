import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import CommentReviews from './CommentReviews';
import CoursePurchaseController from './CoursePurchaseController';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactConfetti from 'react-confetti';
import './CourseDetails.css'; // Import the custom CSS

function CourseDetails() {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [completedVideos, setCompletedVideos] = useState([]);
  const [progress, setProgress] = useState(0);
  const [videoEnded, setVideoEnded] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { courseId } = useParams();
  const navigate = useNavigate();
  const API_BASE_URL = 'https://course-creation-backend.onrender.com/api';

  // Function to fetch course details
  const fetchCourseDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required. Please log in.');
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/courses/courses/${courseId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const courseData = response.data.course;
      setCourse(courseData);
      
      // Set the preview video as the initially selected video
      setSelectedVideo({
        title: 'Course Preview',
        url: courseData.previewVideo,
        description: 'Preview of the course content',
        isPreview: true
      });

      // If course is purchased, fetch progress data
      if (courseData.isPurchased) {
        fetchCourseProgress();
      }
    } catch (error) {
      console.error('Error fetching course details:', error);
      setError('Error fetching course details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch course progress
  const fetchCourseProgress = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get(`${API_BASE_URL}/courses/progress/status/${courseId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const progressData = response.data;
      setProgress(progressData.progress || 0);
      setCompletedVideos(progressData.completedVideos || []);
      
      // Update course with progress data
      setCourse(prevCourse => ({
        ...prevCourse,
        progress: progressData.progress || 0,
        completedVideos: progressData.completedVideos || []
      }));
    } catch (error) {
      console.error('Error fetching course progress:', error);
      // Don't show error to user, just log it
    }
  };

  // Function to mark a video as completed
  const markVideoAsCompleted = async (videoId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      // Don't mark if already completed
      if (completedVideos.includes(videoId)) return;

      const response = await axios.post(
        `${API_BASE_URL}/courses/progress/track-video`,
        { courseId, videoId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const updatedProgress = response.data;
      setProgress(updatedProgress.progress);
      setCompletedVideos(updatedProgress.completedVideos);
      
      // Update course with new progress data
      setCourse(prevCourse => ({
        ...prevCourse,
        progress: updatedProgress.progress,
        completedVideos: updatedProgress.completedVideos
      }));

      // Show confetti effect
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);

      // Show success toast with custom styling
      toast.success(
        <div className="flex flex-col items-center">
          <div className="text-xl font-bold mb-1">🎉 Congratulations! 🎉</div>
          <div>Video marked as completed!</div>
          <div className="text-sm mt-1">Progress: {updatedProgress.progress}%</div>
        </div>,
        {
          position: "top-center",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          className: "completion-toast",
          icon: "🏆"
        }
      );
      
      // Reset video ended state
      setVideoEnded(false);
    } catch (error) {
      console.error('Error marking video as completed:', error);
      toast.error('Failed to update progress', {
        position: "bottom-right",
        autoClose: 3000,
      });
    }
  };

  // Function to reset course progress
  const resetCourseProgress = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.post(
        `${API_BASE_URL}/courses/progress/reset/${courseId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setProgress(0);
      setCompletedVideos([]);
      
      // Update course with reset progress
      setCourse(prevCourse => ({
        ...prevCourse,
        progress: 0,
        completedVideos: []
      }));

      toast.info('Course progress has been reset', {
        position: "bottom-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error('Error resetting course progress:', error);
      toast.error('Failed to reset progress', {
        position: "bottom-right",
        autoClose: 3000,
      });
    }
  };

  // Handle video ended event
  const handleVideoEnded = () => {
    if (!selectedVideo.isPreview && course.isPurchased) {
      setVideoEnded(true);
    }
  };

  // Handle marking current video as completed
  const handleMarkComplete = () => {
    if (selectedVideo && !selectedVideo.isPreview) {
      markVideoAsCompleted(selectedVideo._id);
    }
  };

  useEffect(() => {
    fetchCourseDetails();
  }, [courseId]);

  const handleVideoSelect = (video, index) => {
    setSelectedVideo({
      ...video,
      index: index + 1,
      isPreview: false
    });
    setVideoEnded(false);
  };

  const handlePreviewSelect = () => {
    if (course) {
      setSelectedVideo({
        title: 'Course Preview',
        url: course.previewVideo,
        description: 'Preview of the course content',
        isPreview: true
      });
      setVideoEnded(false);
    }
  };

  const handleEnrollNow = () => {
    setShowPurchaseModal(true);
  };
  
  const handlePurchaseComplete = () => {
    // Refresh course data to update purchase status
    fetchCourseDetails();
    setShowPurchaseModal(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="bg-red-50 p-6 rounded-lg shadow-md max-w-2xl w-full">
          <h2 className="text-red-600 text-xl font-semibold mb-4">Error</h2>
          <p className="text-gray-700">{error}</p>
          <button 
            onClick={() => navigate(-1)} 
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="bg-yellow-50 p-6 rounded-lg shadow-md max-w-2xl w-full">
          <h2 className="text-yellow-600 text-xl font-semibold mb-4">Course Not Found</h2>
          <p className="text-gray-700">The requested course could not be found.</p>
          <button 
            onClick={() => navigate(-1)} 
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {/* Confetti effect when completing a video */}
      {showConfetti && (
        <ReactConfetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={500}
          gravity={0.2}
        />
      )}
      
      {/* Toast Container for notifications */}
      <ToastContainer />
      
      {/* Course Header */}
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="relative">
          <img 
            src={course.thumbnail} 
            alt={course.title} 
            className="w-full h-80 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
            <div className="p-6 text-white">
              <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
              <p className="text-lg opacity-90 mb-2">Category: {course.category}</p>
              <div className="flex items-center space-x-4">
                <p className="bg-blue-600 px-3 py-1 rounded-md">
                  ${course.price.toFixed(2)}
                </p>
                <p className="bg-green-600 px-3 py-1 rounded-md">
                  Duration: {course.duration}
                </p>
                {course.isPurchased && (
                  <p className="bg-green-600 px-3 py-1 rounded-md">
                    Purchased ✓
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Info */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">About This Course</h2>
              <p className="text-gray-600 leading-relaxed mb-6">{course.description}</p>
              
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Instructor</h2>
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-blue-100 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-800">
                    {course.instructor.firstname} {course.instructor.lastname}
                  </p>
                  <p className="text-gray-500 text-sm">{course.instructor.email}</p>
                </div>
              </div>
              
              {course.isPurchased ? (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-4">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <p className="text-green-700 font-medium">You have purchased this course</p>
                  </div>
                  <div className="mt-3">
                    <p className="text-sm text-green-600 mb-1">Your progress: {progress}%</p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                  </div>
                  {progress > 0 && (
                    <button 
                      onClick={resetCourseProgress}
                      className="mt-3 text-xs text-red-500 hover:text-red-700 underline"
                    >
                      Reset Progress
                    </button>
                  )}
                </div>
              ) : (
                <button 
                  onClick={handleEnrollNow}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200"
                >
                  Enroll Now - ${course.price.toFixed(2)}
                </button>
              )}
            </div>
          </div>
          
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              {/* Video Player Section */}
              <div className="bg-black">
                <div className="relative w-full" style={{ height: '400px' }}>
                  <video 
                    src={selectedVideo?.url} 
                    controls 
                    className="w-full h-full object-contain"
                    poster={selectedVideo?.isPreview ? course.thumbnail : null}
                    preload="metadata"
                    controlsList="nodownload"
                    onEnded={handleVideoEnded}
                  >
                    Your browser does not support the video tag.
                  </video>
                  {selectedVideo?.isPreview && (
                    <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                      Preview
                    </div>
                  )}
                </div>
              </div>
              
              {/* Video Info */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {selectedVideo?.isPreview ? 'Course Preview' : `${selectedVideo?.index}. ${selectedVideo?.title}`}
                  </h3>
                  
                  {/* Add Mark as Completed button for purchased courses and non-preview videos */}
                  {course.isPurchased && !selectedVideo?.isPreview && (
                    <div>
                      {completedVideos.includes(selectedVideo?._id) ? (
                        <div className="flex items-center text-green-600">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>Completed</span>
                        </div>
                      ) : (
                        <button 
                          onClick={handleMarkComplete}
                          className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                            videoEnded 
                              ? 'bg-green-500 text-white animate-pulse shadow-md transform hover:scale-105' 
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {videoEnded ? '✓ Mark as Completed!' : 'Mark as Completed'}
                        </button>
                      )}
                    </div>
                  )}
                </div>
                <p className="text-gray-600 mt-1">{selectedVideo?.description}</p>
              </div>
              
              {/* Video List */}
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Course Content</h3>
                
                {!course.isPurchased && course.videos.length === 0 && (
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-4">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <p className="text-yellow-700 font-medium">Purchase this course to access all videos</p>
                    </div>
                  </div>
                )}
                
                <div className="divide-y divide-gray-200">
                  {/* Preview Video */}
                  <div 
                    className={`p-3 hover:bg-gray-50 transition-colors duration-150 cursor-pointer ${selectedVideo?.isPreview ? 'bg-blue-50' : ''}`}
                    onClick={handlePreviewSelect}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-start space-x-3">
                        <div className={`${selectedVideo?.isPreview ? 'text-blue-600' : 'text-blue-500'} mt-1`}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <h3 className={`font-medium ${selectedVideo?.isPreview ? 'text-blue-600' : 'text-gray-800'}`}>Course Preview</h3>
                          <p className="text-gray-500 text-sm">Introduction to the course</p>
                        </div>
                      </div>
                      <div className="text-gray-500 text-sm flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Preview
                      </div>
                    </div>
                  </div>
                  
                  {/* Course Videos */}
                  {course.videos && course.videos.length > 0 ? (
                    course.videos.map((video, index) => (
                      <div 
                        key={index} 
                        className={`p-3 hover:bg-gray-50 transition-colors duration-150 cursor-pointer ${selectedVideo?.index === index + 1 ? 'bg-blue-50' : ''}`}
                        onClick={() => handleVideoSelect(video, index)}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-start space-x-3">
                            <div className={`${selectedVideo?.index === index + 1 ? 'text-blue-600' : 'text-blue-500'} mt-1`}>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div>
                              <h3 className={`font-medium ${selectedVideo?.index === index + 1 ? 'text-blue-600' : 'text-gray-800'}`}>
                                {index + 1}. {video.title}
                              </h3>
                              <p className="text-gray-500 text-sm">{video.description}</p>
                            </div>
                          </div>
                          <div className="text-gray-500 text-sm flex items-center">
                            {completedVideos && completedVideos.includes(video._id) && (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            )}
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {parseFloat(video.duration).toFixed(2)} min
                          </div>
                        </div>
                      </div>
                    ))
                  ) : !course.isPurchased && (
                    <div className="p-3 text-center text-gray-500">
                      <p>Purchase this course to access all {course.videos?.length || 'the'} videos</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Purchase Modal */}
      {showPurchaseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Purchase Course</h2>
              <button 
                onClick={() => setShowPurchaseModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-1">{course.title}</h3>
                <p className="text-gray-500 text-sm">{course.category} • {course.duration}</p>
              </div>
              
              <CoursePurchaseController 
                courseId={courseId} 
                price={course.price} 
                onPurchaseComplete={handlePurchaseComplete} 
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Add CommentReviews component */}
      {course && (
        <div className="max-w-6xl mx-auto">
          <CommentReviews 
            courseId={courseId} 
            isPurchased={course.isPurchased} 
          />
        </div>
      )}
    </div>
  );
}

export default CourseDetails;