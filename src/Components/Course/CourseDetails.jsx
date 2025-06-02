import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
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
    const [videoEnded, setVideoEnded] = useState(false);
    const [completedVideos, setCompletedVideos] = useState([]);
    const { courseId } = useParams();
    const navigate = useNavigate();
    const API_BASE_URL = 'https://course-creation-backend.onrender.com/api';
    const progressUpdateTimeout = useRef(null);

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
        } catch (error) {
            console.error('Error fetching course details:', error);
            setError('Error fetching course details. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourseDetails();
    }, [courseId]);

    useEffect(() => {
        if (course?.isPurchased) {
            const fetchProgress = async () => {
                try {
                    const response = await axios.get(
                        `https://course-creation-backend.onrender.com/api/progress/course/${courseId}`,
                        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
                    );

                    if (response.data.success && response.data.progress) {
                        // Extract completed videos from watchedVideos array
                        const watchedUrls = response.data.progress.watchedVideos || [];
                        
                        // Find the video IDs that match the watched URLs
                        const completed = course.videos
                            .filter(video => watchedUrls.includes(video.url))
                            .map(video => video._id);
                        
                        setCompletedVideos(completed);
                    }
                } catch (error) {
                    console.error('Error fetching progress:', error);
                }
            };
            fetchProgress();
        }
    }, [courseId, course?.isPurchased, course?.videos]);

    const handleVideoSelect = (video, index) => {
        setSelectedVideo({ ...video, index: index + 1, isPreview: false });
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

    const handleEnrollNow = () => setShowPurchaseModal(true);

    const handlePurchaseComplete = () => {
        fetchCourseDetails();
        setShowPurchaseModal(false);
    };

    const handleVideoEnded = () => setVideoEnded(true);

    const handleVideoProgress = async (watchTime) => {
        if (!selectedVideo || selectedVideo.isPreview || !course?.isPurchased) return;

        try {
            if (progressUpdateTimeout.current) clearTimeout(progressUpdateTimeout.current);

            progressUpdateTimeout.current = setTimeout(async () => {
                // Mark video as watched when user has watched enough of it (e.g., 80% or more)
                // You can adjust this threshold as needed
                const videoElement = document.querySelector('video');
                if (videoElement && (watchTime / videoElement.duration) >= 0.8) {
                    const response = await axios.post(
                        'https://course-creation-backend.onrender.com/api/progress/mark-watched',
                        { 
                            courseId: course._id, 
                            videoUrl: selectedVideo.url 
                        },
                        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
                    );

                    if (response.data.success) {
                        // Update completed videos list
                        if (!completedVideos.includes(selectedVideo._id)) {
                            setCompletedVideos(prev => [...prev, selectedVideo._id]);
                        }
                        
                        toast.success('Progress saved', {
                            position: 'bottom-right',
                            autoClose: 2000,
                            hideProgressBar: true,
                            closeOnClick: true,
                            pauseOnHover: false,
                            draggable: true
                        });
                    }
                }
            }, 3000);
        } catch (error) {
            console.error('Error updating video progress:', error);
            toast.error('Failed to save progress');
        }
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
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
            <ToastContainer />
            <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden mb-10">
                <div className="relative">
                    <img 
                        src={course.thumbnail || 'https://via.placeholder.com/1200x400?text=Course+Thumbnail'} 
                        alt={course.title} 
                        className="w-full h-64 sm:h-80 md:h-96 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent flex flex-col justify-end">
                        <div className="p-6 sm:p-8 text-white">
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 drop-shadow-md">{course.title}</h1>
                            <p className="text-lg sm:text-xl opacity-90 mb-3 drop-shadow-sm">Category: {course.category}</p>
                            <div className="flex flex-wrap items-center gap-3">
                                <p className="bg-blue-600 hover:bg-blue-700 transition-colors px-4 py-2 rounded-lg text-sm font-semibold shadow-md">
                                    ${course.price.toFixed(2)}
                                </p>
                                <p className="bg-green-600 hover:bg-green-700 transition-colors px-4 py-2 rounded-lg text-sm font-semibold shadow-md">
                                    Duration: {course.duration}
                                </p>
                                {course.isPurchased && (
                                    <p className="flex items-center bg-teal-500 px-4 py-2 rounded-lg text-sm font-semibold shadow-md">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 00-5.516 0 3.066 3.066 0 00-1.03 2.288A3.066 3.066 0 003.067 9.5l.003.001.003.001.002.001.001.001L10 16.25l6.928-6.748.001-.001.002-.001.003-.001.003-.001a3.066 3.066 0 003.067-3.757 3.066 3.066 0 00-1.03-2.288 3.066 3.066 0 00-5.516 0c-.18-.024-.362-.04-.546-.052A3.066 3.066 0 0010 3.455z" clipRule="evenodd" />
                                        </svg>
                                        Purchased
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {course.isPurchased && (
                <div className="max-w-6xl mx-auto -mt-6 mb-8 z-10 relative">
                    <div className="bg-white rounded-xl shadow-md p-4 flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            <div className="bg-blue-100 p-3 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-800">Your Progress</h3>
                                <p className="text-sm text-gray-500">
                                    {completedVideos.length} of {course.videos.length} videos completed
                                </p>
                            </div>
                        </div>
                        <div className="w-48">
                            <div className="relative pt-1">
                                <div className="overflow-hidden h-2 text-xs flex rounded bg-blue-200">
                                    <div
                                        style={{ width: `${(completedVideos.length / course.videos.length) * 100}%` }}
                                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                                    ></div>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => document.getElementById('course-progress-section').scrollIntoView({ behavior: 'smooth' })}
                            className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm font-medium transition-colors duration-150"
                        >
                            View Details
                        </button>
                    </div>
                </div>
            )}

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
                                <>
                                    <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-4">
                                        <div className="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            <p className="text-green-700 font-medium">You have purchased this course</p>
                                        </div>
                                    </div>
                                    <div id="course-progress-section" className="mt-6">
                                        <CourseProgress courseId={course._id} />
                                    </div>
                                </>
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
                                        onTimeUpdate={(e) => handleVideoProgress(Math.floor(e.target.currentTime))}
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
                            <div className="p-4 border-b border-gray-200">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-xl font-semibold text-gray-800">
                                        {selectedVideo?.isPreview ? 'Course Preview' : `${selectedVideo?.index}. ${selectedVideo?.title}`}
                                    </h3>
                                </div>
                                <p className="text-gray-600 mt-1">{selectedVideo?.description}</p>
                            </div>
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
                                    <div
                                        className={`p-3 hover:bg-gray-50 transition-colors duration-150 cursor-pointer ${selectedVideo?.isPreview ? 'bg-blue-50' : ''}`}
                                        onClick={handlePreviewSelect}
                                    >
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-start space-x-3">
                                                <div className={`${selectedVideo?.isPreview ? 'text-blue-600' : 'text-blue-500'} mt-1`}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
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
                                    {course.videos && course.videos.length > 0 ? (
                                        course.videos.map((video, index) => {
                                            const isCompleted = completedVideos.includes(video._id);
                                            return (
                                                <div
                                                    key={index}
                                                    className={`p-3 hover:bg-gray-50 transition-colors duration-150 cursor-pointer ${selectedVideo?.index === index + 1 ? 'bg-blue-50' : ''} ${isCompleted ? 'border-l-4 border-green-500' : ''}`}
                                                    onClick={() => handleVideoSelect(video, index)}
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <div className="flex items-start space-x-3">
                                                            <div className={`${selectedVideo?.index === index + 1 ? 'text-blue-600' : isCompleted ? 'text-green-500' : 'text-blue-500'} mt-1`}>
                                                                {isCompleted ? (
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                                    </svg>
                                                                ) : (
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                                                    </svg>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <h3 className={`font-medium ${selectedVideo?.index === index + 1 ? 'text-blue-600' : 'text-gray-800'}`}>
                                                                    {index + 1}. {video.title}
                                                                </h3>
                                                                <p className="text-gray-500 text-sm">{video.description}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            {isCompleted && (
                                                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                                                    Completed
                                                                </span>
                                                            )}
                                                            <div className="text-gray-500 text-sm flex items-center">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                                {parseFloat(video.duration).toFixed(2)} min
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
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
            {course && (
                <div className="max-w-6xl mx-auto">
                    <CommentReviews courseId={courseId} isPurchased={course.isPurchased} />
                </div>
            )}
        </div>
    );
}

export default CourseDetails;