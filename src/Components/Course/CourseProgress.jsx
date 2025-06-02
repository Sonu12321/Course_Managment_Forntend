import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CourseProgress = ({ courseId }) => {
    const [progress, setProgress] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchProgress = async () => {
            if (!courseId || !token) {
                setError('Course ID and authentication are required');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(
                    `https://course-creation-backend.onrender.com/api/progress/course/${courseId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );

                if (response.data.success) {
                    setProgress(response.data.progress);
                } else {
                    setError('Failed to fetch progress');
                }
            } catch (error) {
                setError('Failed to fetch progress');
                console.error('Fetch error:', error);
            }
            setLoading(false);
        };

        fetchProgress();
    }, [courseId, token]);

    if (loading) {
        return (
            <div className="flex justify-center items-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-700">{error}</p>
            </div>
        );
    }

    if (!progress) {
        return (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-yellow-700">No progress data available</p>
            </div>
        );
    }

    return (
        <div className="p-6 bg-white rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Course Progress</h2>
            
            <div className="mb-8">
                {/* Progress Bar */}
                <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                        <div>
                            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">
                                Progress
                            </span>
                        </div>
                        <div className="text-right">
                            <span className="text-xs font-semibold inline-block text-green-600">
                                {(progress.completionPercentage || 0).toFixed(1)}%
                            </span>
                        </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-200">
                        <div 
                            style={{ width: `${progress.completionPercentage || 0}%` }} 
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500 transition-all duration-500 ease-in-out"
                        ></div>
                    </div>
                </div>
                
                <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700">
                        <span className="font-semibold">Completed:</span> {progress.watchedVideos?.length || 0} / {progress.totalVideos || 0} videos
                    </p>
                    <p className="text-gray-700">
                        <span className="font-semibold">Last Updated:</span> {new Date(progress.lastUpdated || Date.now()).toLocaleDateString()}
                    </p>
                </div>
            </div>

            <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                        <path d="M14 6a2 2 0 012-2h2a2 2 0 012 2v8a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
                    </svg>
                    Video Progress
                </h3>
                <div className="space-y-3">
                    {progress.course && progress.course.videos && progress.course.videos.length > 0 ? (
                        progress.course.videos.map((video, index) => {
                            const isWatched = progress.watchedVideos.includes(video.url);
                            return (
                                <div 
                                    key={video._id || index}
                                    className={`flex items-center gap-4 p-4 rounded-lg border ${isWatched ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'} transition-all duration-200`}
                                >
                                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isWatched ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                                        {isWatched ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        ) : (
                                            <span>{index + 1}</span>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-medium text-gray-800">
                                            {video.title || `Video ${index + 1}`}
                                        </h4>
                                        <div className="flex items-center mt-1 text-sm text-gray-600">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {video.duration ? `${video.duration} min` : 'No duration info'}
                                        </div>
                                    </div>
                                    <div className="flex-shrink-0">
                                        <span className={`px-2 py-1 text-xs rounded-full ${isWatched ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {isWatched ? 'Completed' : 'Not Started'}
                                        </span>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                            <p className="text-gray-500">No video progress available</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CourseProgress;