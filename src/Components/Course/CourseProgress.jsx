import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const CourseProgress = ({ courseId }) => {
  const [progress, setProgress] = useState(null);
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [certificateLoading, setCertificateLoading] = useState(false);
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
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.success) {
          setProgress(response.data.progress);

          if (response.data.progress.completionPercentage === 100) {
            fetchCertificate();
          }
        } else {
          setError('Failed to fetch progress');
        }
      } catch (error) {
        setError('Failed to fetch progress');
        console.error('Fetch error:', error);
      }
      setLoading(false);
    };

    const fetchCertificate = async () => {
      try {
        const response = await axios.get(
          `https://course-creation-backend.onrender.com/api/certificates/course/${courseId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.success) {
          setCertificate(response.data.certificate);
        }
      } catch {
        console.log('No certificate found for this course');
      }
    };

    fetchProgress();
  }, [courseId, token]);

  const generateCertificate = async () => {
    if (!courseId || !token) return;

    setCertificateLoading(true);

    try {
      const response = await axios.post(
        `https://course-creation-backend.onrender.com/api/certificates/generate/${courseId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setCertificate(response.data.certificate);
        toast.success('Certificate generated successfully!');
      } else {
        toast.error(response.data.message || 'Failed to generate certificate');
      }
    } catch (error) {
      console.error('Certificate generation error:', error);
      toast.error(error.response?.data?.message || 'Failed to generate certificate');
    } finally {
      setCertificateLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-6">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-600 text-red-400 rounded-xl p-5 mb-6 shadow-md">
        <p>{error}</p>
      </div>
    );
  }

  if (!progress) {
    return (
      <div className="bg-yellow-900/20 border border-yellow-600 text-yellow-400 rounded-xl p-5 mb-6 shadow-md text-center">
        <p>No progress data available</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-purple-900/70 via-slate-900/80 to-violet-800/90 rounded-3xl shadow-2xl border border-violet-700/30 text-gray-100 max-w-xl mx-auto">
      <h2 className="text-3xl font-extrabold mb-8 text-violet-300 tracking-wide select-none">
        Course Progress
      </h2>

      {/* Progress Bar */}
      <section className="mb-10">
        <div className="flex justify-between mb-2 items-center">
          <span className="text-sm font-semibold uppercase bg-green-700/30 text-green-300 px-3 py-1 rounded-full select-none">
            Progress
          </span>
          <span className="text-sm font-semibold text-green-300 select-none">
            {(progress.completionPercentage || 0).toFixed(1)}%
          </span>
        </div>
        <div className="w-full h-3 rounded-full bg-green-600/20 overflow-hidden shadow-inner">
          <div
            style={{ width: `${progress.completionPercentage || 0}%` }}
            className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-700 ease-in-out"
          />
        </div>

        <div className="mt-6 flex justify-between text-sm font-medium text-green-200 select-none">
          <p>
            Completed: <span className="font-bold">{progress.watchedVideos?.length || 0}</span> /{' '}
            <span className="font-bold">{progress.totalVideos || 0}</span> videos
          </p>
          <p>
            Last Updated:{' '}
            <time dateTime={progress.lastUpdated || new Date().toISOString()}>
              {new Date(progress.lastUpdated || Date.now()).toLocaleDateString()}
            </time>
          </p>
        </div>
      </section>

      {/* Certificate Section */}
      {progress.completionPercentage === 100 && (
        <section className="mb-10 p-5 bg-green-900/20 rounded-lg border border-green-700 shadow-inner select-none">
          <div className="flex items-center space-x-4 mb-5">
            <div className="bg-green-600 rounded-full p-2 shadow-md shadow-green-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 text-green-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-green-300">Course Completed!</h3>
          </div>

          {certificate ? (
            <div>
              <p className="text-green-200 mb-6">
                Congratulations! You've earned a certificate for completing this course.
              </p>
              <Link
                to={`/certificate/${certificate.certificateId}`}
                className="inline-block bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition transform hover:scale-105"
              >
                View Certificate
              </Link>
            </div>
          ) : (
            <div>
              <p className="text-green-200 mb-6">
                You've completed this course! Generate your certificate of completion.
              </p>
              <button
                onClick={generateCertificate}
                disabled={certificateLoading}
                className="inline-flex items-center justify-center bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition transform disabled:cursor-not-allowed disabled:opacity-60"
              >
                {certificateLoading ? (
                  <>
                    <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></span>
                    Generating...
                  </>
                ) : (
                  'Generate Certificate'
                )}
              </button>
            </div>
          )}
        </section>
      )}

      {/* Video Progress List */}
      <section>
        <h3 className="text-2xl font-semibold text-indigo-300 mb-6 flex items-center gap-2 select-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-indigo-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
            <path d="M14 6a2 2 0 012-2h2a2 2 0 012 2v8a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
          </svg>
          Video Progress
        </h3>

        {progress.course?.videos?.length > 0 ? (
          <div className="space-y-3 max-h-[360px] overflow-auto">
            {progress.course.videos.map((video, index) => {
              const isWatched = progress.watchedVideos.includes(video.url);
              return (
                <article
                  key={video._id || index}
                  className={`flex items-center gap-4 p-4 rounded-lg border shadow-sm transition-colors duration-300 ${
                    isWatched
                      ? 'bg-green-900/20 border-green-600 text-green-300'
                      : 'bg-slate-800 border-slate-700 text-gray-300'
                  }`}
                >
                  <div
                    className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center font-semibold ${
                      isWatched ? 'bg-green-600 text-green-100' : 'bg-gray-700 text-gray-500'
                    }`}
                    aria-label={isWatched ? 'Completed' : 'Not started'}
                  >
                    {isWatched ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold truncate" title={video.title || `Video ${index + 1}`}>
                      {video.title || `Video ${index + 1}`}
                    </h4>
                    <div className="flex items-center gap-1 text-sm text-gray-400 mt-0.5 select-none">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 text-indigo-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <time>{video.duration ? `${video.duration} min` : 'No duration info'}</time>
                    </div>
                  </div>
                  <div>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold select-none ${
                        isWatched ? 'bg-green-600 text-green-100' : 'bg-gray-700 text-gray-300'
                      }`}
                    >
                      {isWatched ? 'Completed' : 'Not Started'}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 bg-slate-800 rounded-lg border border-slate-700 text-slate-400 font-medium select-none">
            No video progress available
          </div>
        )}
      </section>
    </div>
  );
};

export default CourseProgress;
