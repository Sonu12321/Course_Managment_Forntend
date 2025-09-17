import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import CommentReviews from './CommentReviews';
import CoursePurchaseController from './CoursePurchaseController';
import CourseProgress from './CourseProgress';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function CourseDetails() {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [certificate, setCertificate] = useState(null);
  const [completedVideos, setCompletedVideos] = useState([]);
  const { courseId } = useParams();
  const navigate = useNavigate();
  const API_BASE_URL = 'https://course-creation-backend.onrender.com/api';
  const progressUpdateTimeout = useRef(null);

  // Fetch course details
  const fetchCourseDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required. Please log in.');
        setLoading(false);
        return;
      }
      const response = await axios.get(`${API_BASE_URL}/courses/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const courseData = response.data.course;
      setCourse(courseData);
      setSelectedVideo({
        title: 'Course Preview',
        url: courseData.previewVideo,
        description: 'Preview of the course content',
        isPreview: true
      });
    } catch {
      setError('Error fetching course details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseDetails();
  }, [courseId]);

  // Fetch progress and certificate
  useEffect(() => {
    if (course?.isPurchased) {
      const fetchProgress = async () => {
        try {
          const response = await axios.get(
            `${API_BASE_URL}/progress/course/${courseId}`,
            { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
          );
          if (response.data.success && response.data.progress) {
            const watchedUrls = response.data.progress.watchedVideos || [];
            const completed = course.videos.filter(video => watchedUrls.includes(video.url)).map(video => video._id);
            setCompletedVideos(completed);
          }
        } catch {}
      };
      fetchProgress();

      const checkCertificate = async () => {
        try {
          const token = localStorage.getItem('token');
          if (token) {
            const certResponse = await axios.get(
              `${API_BASE_URL}/certificates/course/${courseId}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            if (certResponse.data.success) setCertificate(certResponse.data.certificate);
          }
        } catch {}
      };
      checkCertificate();
    }
  }, [courseId, course?.isPurchased, course?.videos]);

  const handleVideoSelect = (video, index) => setSelectedVideo({ ...video, index: index + 1, isPreview: false });

  const handlePreviewSelect = () => {
    if (course) {
      setSelectedVideo({
        title: 'Course Preview',
        url: course.previewVideo,
        description: 'Preview of the course content',
        isPreview: true
      });
    }
  };

  const handleVideoProgress = async (watchTime) => {
    if (!selectedVideo || selectedVideo.isPreview || !course?.isPurchased) return;
    try {
      if (progressUpdateTimeout.current) clearTimeout(progressUpdateTimeout.current);
      progressUpdateTimeout.current = setTimeout(async () => {
        const videoElement = document.querySelector('video');
        if (videoElement && (watchTime / videoElement.duration) >= 0.8) {
          const response = await axios.post(
            `${API_BASE_URL}/progress/mark-watched`,
            { courseId: course._id, videoUrl: selectedVideo.url },
            { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
          );
          if (response.data.success && !completedVideos.includes(selectedVideo._id)) {
            setCompletedVideos(prev => [...prev, selectedVideo._id]);
            toast.success('Progress saved 🎉', { position: 'bottom-right', autoClose: 2000 });
          }
        }
      }, 3000);
    } catch {
      toast.error('Failed to save progress');
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-violet-400 drop-shadow-glow" />
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        <div className="bg-red-900/30 backdrop-blur-lg border border-red-500/80 p-8 rounded-3xl shadow-2xl max-w-md w-full text-white">
          <h2 className="text-3xl font-bold text-red-400 mb-4">Error</h2>
          <p className="mb-6 text-lg tracking-wide">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-gradient-to-r from-pink-500 to-red-500 py-3 px-8 rounded-2xl font-semibold shadow-xl hover:scale-105 transition-transform duration-300"
          >
            Go Back
          </button>
        </div>
      </div>
    );

  if (!course)
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        <div className="bg-yellow-900/30 backdrop-blur-lg border border-yellow-400/70 p-8 rounded-3xl shadow-2xl max-w-md w-full text-white text-center">
          <h2 className="text-3xl font-bold text-yellow-300 mb-4">Course Not Found</h2>
          <p className="mb-6 text-lg tracking-wide">The requested course could not be found.</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-gradient-to-r from-yellow-400 to-amber-600 py-3 px-8 rounded-2xl font-semibold shadow-xl hover:scale-105 transition-transform duration-300"
          >
            Go Back
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden py-10 px-6 md:px-10">
      <ToastContainer />
      {/* Hero Section */}
      <section className="mx-auto max-w-6xl -mb-10">
        <div className="relative z-20 bg-slate-900/85 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row items-center border border-slate-600/20 hover:shadow-[0_0_24px_rgba(192,132,252,0.85)] transition-shadow duration-500">
          <img
            src={course.thumbnail || 'https://via.placeholder.com/1200x400?text=Course+Thumbnail'}
            alt={course.title}
            className="md:w-2/5 w-full h-72 object-cover brightness-[0.75]"
            loading="lazy"
            draggable={false}
          />
          <div className="flex-1 px-8 py-12 flex flex-col justify-center gap-4 text-left text-white select-none">
            <h1 className="text-4xl md:text-5xl font-extrabold text-violet-400 tracking-tight drop-shadow-xl">
              {course.title}
            </h1>
            <p className="text-xl text-gray-300 tracking-wide max-w-3xl">{course.category}</p>
            <p className="text-lg text-gray-400 max-w-3xl">{course.description}</p>

            <div className="flex items-center gap-6 mt-6">
              <div className="flex flex-col items-center justify-center text-violet-300 text-sm select-text">
                <span className="text-xs uppercase tracking-widest font-semibold">Duration</span>
                <span className="font-medium text-white">{course.duration}</span>
              </div>
              {course.isPurchased && (
                <span className="rounded-3xl bg-gradient-to-r from-teal-500 to-teal-700 py-2 px-6 text-white font-semibold shadow-md shadow-teal-400 select-none">
                  Purchased
                </span>
              )}
              {!course.isPurchased && (
                <button
                  onClick={() => setShowPurchaseModal(true)}
                  className="ml-auto rounded-3xl py-3 px-8 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 hover:scale-105 shadow-lg hover:shadow-pink-500 transition-transform duration-300 font-bold text-white select-none"
                >
                  Enroll Now &mdash; ${course.price.toFixed(2)}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto mt-24 flex flex-col md:flex-row gap-12">
        {/* Left: Video + Course Content */}
        <article className="flex-1 space-y-8 bg-slate-900/70 border border-violet-700/30 backdrop-blur-lg rounded-3xl shadow-xl p-8 animate-fadeInUp">
          {/* Video Player */}
          <div className="relative rounded-3xl border border-violet-600 overflow-hidden shadow-lg shadow-violet-900 group">
            <video
              src={selectedVideo?.url}
              controls
              className="w-full h-96 object-contain bg-black rounded-3xl"
              onTimeUpdate={(e) => handleVideoProgress(Math.floor(e.target.currentTime))}
              poster={course.thumbnail}
              preload="metadata"
            />
            {selectedVideo?.isPreview && (
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-gradient-to-r from-violet-700/90 to-violet-400/75 text-white text-xs font-semibold shadow-md select-none">
                Preview
              </span>
            )}
          </div>
          {/* Selected Video Info */}
          <div>
            <h3 className="text-xl font-bold text-violet-400 select-text">
              {selectedVideo?.isPreview ? 'Course Preview' : `${selectedVideo?.index}. ${selectedVideo?.title}`}
            </h3>
            <p className="text-gray-400 text-sm mt-2 select-text">{selectedVideo?.description}</p>
          </div>
          {/* Course Content List */}
          <div>
            <h3 className="text-violet-400 font-bold mb-4 select-none text-lg tracking-wide">Course Content</h3>
            <div className="flex flex-col gap-3">
              {course.videos.map((video, index) => {
                const isCompleted = completedVideos.includes(video._id);
                const isSelected = selectedVideo?.index === index + 1 && !selectedVideo?.isPreview;
                return (
                  <button
                    key={index}
                    onClick={() => handleVideoSelect(video, index)}
                    className={`flex justify-between items-center rounded-2xl px-6 py-4 border transition-transform duration-200 shadow-md cursor-pointer focus:outline-none ${
                      isSelected
                        ? 'bg-gradient-to-r from-violet-700 via-pink-600 to-violet-900 border-violet-500 scale-105 shadow-violet-700'
                        : 'bg-slate-800 border-slate-600 hover:bg-slate-700/90 hover:scale-[1.02]'
                    }`}
                    aria-current={isSelected ? 'true' : 'false'}
                  >
                    <div className="text-left">
                      <h4
                        className={`font-semibold ${isSelected ? 'text-pink-300' : 'text-white'} truncate max-w-xl`}
                        title={video.title}
                      >
                        {index + 1}. {video.title}
                      </h4>
                      <p className="text-gray-400 text-xs truncate max-w-xl">{video.description}</p>
                    </div>
                    <div className="flex items-center gap-3 whitespace-nowrap">
                      {isCompleted && (
                        <span className="bg-green-400/25 text-green-300 text-xs px-3 py-1 rounded-full font-bold shadow-md select-none cursor-default">
                          Completed
                        </span>
                      )}
                      <span className="text-violet-400 text-xs select-none">{Number(video.duration).toFixed(2)} min</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          {/* Progress Bar if purchased */}
          {course.isPurchased && (
            <section className="mt-10 bg-gradient-to-r from-violet-800 to-slate-800 rounded-3xl shadow-lg p-6 border border-violet-700/60 flex flex-col gap-3">
              <h3 className="font-bold text-violet-300 text-lg select-none">Your Progress</h3>
              <div className="flex items-center gap-5">
                <div className="w-full h-3 rounded-lg bg-slate-700/70 overflow-hidden shadow-inner border border-violet-900/50">
                  <div
                    style={{ width: `${(completedVideos.length / course.videos.length) * 100}%` }}
                    className="h-full bg-gradient-to-r from-violet-500 to-pink-400 transition-all duration-300"
                  />
                </div>
                <span className="text-pink-300 text-xs font-semibold select-none">{completedVideos.length} / {course.videos.length} completed</span>
              </div>
            </section>
          )}
          {/* Certificate Panel */}
          {course.isPurchased && certificate && (
            <section className="mt-10 bg-gradient-to-r from-green-800/60 to-teal-800/60 rounded-3xl shadow-xl border border-green-400/40 p-6 flex items-center justify-between animate-fadeInUp select-none">
              <div className="flex items-center gap-4">
                <span className="text-4xl text-green-400">🎓</span>
                <div>
                  <h3 className="font-bold text-green-300 mb-1 select-text">Course Completed!</h3>
                  <p className="text-gray-300 text-xs select-text">
                    You've earned a certificate for this course
                  </p>
                </div>
              </div>
              <Link
                to={`/certificate/${certificate.certificateId}`}
                className="bg-gradient-to-r from-green-400 to-teal-400 px-5 py-3 rounded-2xl text-green-900 font-bold hover:scale-110 transition-transform shadow-lg hover:ring-2 hover:ring-green-500"
                aria-label="View your course completion certificate"
              >
                View Certificate
              </Link>
            </section>
          )}
        </article>

        {/* Right: Sidebar with Instructor and Progress */}
        <aside className="w-full md:w-80 sticky top-24 bg-slate-900/60 backdrop-blur-lg border border-violet-700/30 rounded-3xl shadow-xl flex flex-col items-center px-8 py-10 gap-8 animate-fadeInRight select-none">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-violet-300 mb-2">Instructor</h2>
            <p className="text-white text-lg font-medium truncate">
              {course.instructor.firstname} {course.instructor.lastname}
            </p>
            <p className="text-gray-400 text-sm truncate">{course.instructor.email}</p>
          </div>
          <div className="w-20 h-20 rounded-full bg-violet-700/50 border-4 border-violet-400 shadow-lg animate-pulse grid place-items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <circle cx={12} cy={8} r={4} stroke="white" strokeWidth={2} />
              <ellipse cx={12} cy={16} rx={6} ry={7} stroke="white" strokeWidth={2} />
            </svg>
          </div>
          <CourseProgress courseId={course._id} />
        </aside>
      </section>

      {/* Purchase Modal */}
      {showPurchaseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-2xl p-6">
          <div className="bg-slate-900/95 rounded-3xl shadow-2xl p-10 max-w-md w-full border border-violet-400/30 animate-fadeInUp">
            <header className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-violet-400">Purchase Course</h2>
              <button
                onClick={() => setShowPurchaseModal(false)}
                className="text-pink-400 hover:text-red-600 focus:outline-none"
                aria-label="Close purchase modal"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </header>
            <article className="mb-10 select-text">
              <h3 className="font-medium text-white text-2xl mb-1">{course.title}</h3>
              <p className="text-violet-300 text-md truncate">{course.category} &bull; {course.duration}</p>
            </article>
            <CoursePurchaseController
              courseId={courseId}
              price={course.price}
              onPurchaseComplete={() => {
                fetchCourseDetails();
                setShowPurchaseModal(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Comments Section */}
      <section className="max-w-5xl mx-auto mt-16 mb-16 animate-fadeIn">
        <CommentReviews courseId={courseId} isPurchased={course.isPurchased} />
      </section>
    </div>
  );
}

export default CourseDetails;

