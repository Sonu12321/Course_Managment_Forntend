import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaStar } from 'react-icons/fa';

const CommentReviews = ({ courseId, isPurchased }) => {
  const [comment, setComment] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [commentSuccess, setCommentSuccess] = useState(null);
  const [reviewSuccess, setReviewSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [existingReviews, setExistingReviews] = useState([]);
  const [existingComments, setExistingComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [userHasReviewed, setUserHasReviewed] = useState(false);
  const [userReview, setUserReview] = useState(null);
  const [userComments, setUserComments] = useState([]);

  useEffect(() => {
    const fetchReviewsAndComments = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          const response = await axios.get(`https://course-creation-backend.onrender.com/api/students/course/${courseId}`);
          if (response.data.success) {
            setExistingReviews(response.data.reviews || []);
            setExistingComments(response.data.comments || []);
          }
          setLoading(false);
          return;
        }
        const response = await axios.get(`https://course-creation-backend.onrender.com/api/students/course/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
          setExistingReviews(response.data.reviews || []);
          setExistingComments(response.data.comments || []);
          setUserHasReviewed(response.data.hasUserReviewed || false);
          setUserReview(response.data.userReview || null);
          setUserComments(response.data.userComments || []);
          if (response.data.userReview) {
            setRating(response.data.userReview.rating || 0);
            setReviewComment(response.data.userReview.comment || '');
          }
        }
      } catch { }
      finally { setLoading(false); }
    };

    if (courseId) fetchReviewsAndComments();
  }, [courseId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!comment.trim()) { setError('Please enter a comment'); return; }
    try {
      const token = localStorage.getItem('token');
      if (!token) { setError('Authentication required. Please log in.'); return; }
      const response = await axios.post('https://course-creation-backend.onrender.com/api/students/course-interaction',
        { courseId, comment, interactionType: 'comment' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setCommentSuccess('Your comment has been added successfully!');
        setComment('');
        const newComment = {
          _id: response.data.comment._id || Date.now().toString(),
          user: response.data.comment.user,
          comment: response.data.comment.comment,
          createdAt: response.data.comment.createdAt,
          rating: 0
        };
        setExistingComments([newComment, ...existingComments]);
        setTimeout(() => { setCommentSuccess(null); }, 2500);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Error submitting comment. Please try again.');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (rating === 0) { setError('Please select a rating'); return; }
    if (!reviewComment.trim()) { setError('Please enter a review comment'); return; }
    try {
      const token = localStorage.getItem('token');
      if (!token) { setError('Authentication required. Please log in.'); return; }
      const response = await axios.post('https://course-creation-backend.onrender.com/api/students/review',
        { courseId, rating, comment: reviewComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setReviewSuccess(userHasReviewed ? 'Your review has been updated!' : 'Your review has been submitted!');
        setUserHasReviewed(true);
        const newReview = {
          _id: response.data.review._id || Date.now().toString(),
          user: response.data.review.user,
          comment: response.data.review.comment,
          rating: response.data.review.rating,
          createdAt: response.data.review.createdAt
        };
        setUserReview(newReview);
        const existingReviewIndex = existingReviews.findIndex(
          review => review.user._id === response.data.review.user
        );
        if (existingReviewIndex !== -1) {
          const updatedReviews = [...existingReviews];
          updatedReviews[existingReviewIndex] = newReview;
          setExistingReviews(updatedReviews);
        } else {
          setExistingReviews([newReview, ...existingReviews]);
        }
        setTimeout(() => { setReviewSuccess(null); }, 2500);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Error submitting review. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-900/60 via-slate-900/80 to-violet-800/90 rounded-3xl shadow-2xl border border-violet-700/20 overflow-hidden mb-12 p-1.5">
      <div className="px-8 py-8 relative backdrop-blur-lg">
        <h2 className="text-3xl font-bold mb-8 text-violet-200 tracking-wide">
          Reviews & Comments
        </h2>

        {error && (
          <div className="bg-red-900/20 border border-red-400 text-red-300 px-4 py-3 rounded-2xl mb-4 shadow">
            {error}
          </div>
        )}

        {isPurchased ? (
          <div className="flex flex-col md:flex-row gap-8 transition-all">
            {/* REVIEW FORM */}
            <div className="flex-1 bg-slate-900/60 rounded-2xl border border-violet-700/30 shadow-lg p-6 animate-fadeInUp select-none">
              <h3 className="text-xl font-semibold mb-4 text-white/90">
                {userHasReviewed ? 'Update Your Review' : 'Add a Review'}
              </h3>
              {reviewSuccess && (
                <div className="bg-green-800/20 border border-green-300 text-green-200 py-2 px-4 rounded-xl mb-3 text-center">
                  {reviewSuccess}
                </div>
              )}
              <form onSubmit={handleReviewSubmit}>
                <div className="flex items-center mb-5">
                  <span className="mr-3 text-violet-300 text-lg font-semibold">Rating<span className="text-pink-500">*</span>:</span>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, idx) => {
                      const ratingValue = idx + 1;
                      return (
                        <label key={idx} className="cursor-pointer">
                          <input
                            type="radio"
                            name="rating"
                            className="hidden"
                            value={ratingValue}
                            onClick={() => setRating(ratingValue)}
                          />
                          <FaStar
                            className="transition-all drop-shadow"
                            size={28}
                            color={ratingValue <= (hover || rating) ? "#c084fc" : "#3b314c"}
                            style={{ filter: ratingValue <= (hover || rating) ? 'drop-shadow(0 0 8px #c084fc)' : '' }}
                            onMouseEnter={() => setHover(ratingValue)}
                            onMouseLeave={() => setHover(0)}
                          />
                        </label>
                      );
                    })}
                  </div>
                </div>
                <textarea
                  className="w-full p-4 mb-3 border-0 rounded-xl bg-slate-800/60 text-white outline-none focus:ring-2 focus:ring-violet-400"
                  rows="4"
                  placeholder="Write your review here..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                />
                <button
                  type="submit"
                  className="w-full rounded-xl px-4 py-2 mt-1 bg-gradient-to-r from-fuchsia-600 via-violet-700 to-pink-700 hover:from-indigo-700 hover:to-fuchsia-600 text-white font-semibold text-lg shadow-xl hover:scale-105 transition-all"
                >{userHasReviewed ? 'Update Review' : 'Submit Review'}</button>
              </form>
            </div>
            {/* COMMENT FORM */}
          
          </div>
        ) : (
          <div className="bg-yellow-600/10 border border-yellow-400/30 text-yellow-300 px-6 py-4 rounded-2xl mb-6 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Purchase this course to review or comment.</span>
          </div>
        )}

        {/* REVIEWS LIST */}
        {existingReviews.length > 0 && (
          <div className="mt-10">
            <h3 className="text-2xl font-semibold mb-6 text-pink-200">Course Reviews</h3>
            <div className="space-y-8">
              {existingReviews.map((review) => (
                <div key={review._id} className="bg-slate-900/50 border border-violet-700/30 rounded-2xl px-6 py-5 shadow flex gap-4 items-center">
                  <div className="flex-shrink-0">
                    {review.user.profileImage ? (
                      <img
                        src={review.user.profileImage}
                        alt={`${review.user.firstname} ${review.user.lastname}`}
                        className="h-12 w-12 rounded-full object-cover border-2 border-violet-400 shadow"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-violet-500 flex items-center justify-center text-xl font-bold text-white border-2 border-violet-700 shadow">
                        {review.user.firstname?.charAt(0)}{review.user.lastname?.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-4 mb-1">
                      <span className="font-semibold text-lg text-violet-200 truncate">{review.user.firstname} {review.user.lastname}</span>
                      <span className="text-xs text-violet-400 uppercase tracking-wider">{formatDate(review.createdAt)}</span>
                    </div>
                    <div className="flex gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          size={18}
                          color={i < review.rating ? "#facc15" : "#4b3b74"}
                          className={i < review.rating ? "drop-shadow-glow" : ""}
                        />
                      ))}
                    </div>
                    <p className="text-gray-200">{review.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* COMMENTS LIST */}
        {existingComments.length > 0 && (
          <div className="mt-10">
            <h3 className="text-2xl font-semibold mb-6 text-fuchsia-200">Course Comments</h3>
            <div className="space-y-8">
              {existingComments.map((comment) => (
                <div key={comment._id} className="bg-slate-900/40 border border-pink-700/30 rounded-2xl px-6 py-5 shadow flex gap-4 items-center">
                  <div className="flex-shrink-0">
                    {comment.user.profileImage ? (
                      <img
                        src={comment.user.profileImage}
                        alt={`${comment.user.firstname} ${comment.user.lastname}`}
                        className="h-12 w-12 rounded-full object-cover border-2 border-pink-400 shadow"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-pink-600 flex items-center justify-center text-xl font-bold text-white border-2 border-pink-700 shadow">
                        {comment.user.firstname?.charAt(0)}{comment.user.lastname?.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-4 mb-1">
                      <span className="font-semibold text-lg text-pink-200 truncate">{comment.user.firstname} {comment.user.lastname}</span>
                      <span className="text-xs text-pink-300 uppercase tracking-wider">{formatDate(comment.createdAt)}</span>
                    </div>
                    <p className="text-gray-200">{comment.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EMPTY STATE */}
        {existingReviews.length === 0 && existingComments.length === 0 && (
          <div className="text-center py-12 mt-8 text-violet-300/80 italic text-lg font-medium">
            No reviews or comments yet. Be the <span className="text-pink-300 font-bold">first</span> to share your thoughts!
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentReviews;
