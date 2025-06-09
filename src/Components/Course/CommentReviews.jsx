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
    // Fetch existing reviews and comments for this course
    const fetchReviewsAndComments = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Use the public endpoint if no token is available
        if (!token) {
          const response = await axios.get(`https://course-creation-backend.onrender.com/api/students/course/${courseId}`);
          
          if (response.data.success) {
            setExistingReviews(response.data.reviews || []);
            setExistingComments(response.data.comments || []);
          }
          setLoading(false);
          return;
        }

        // If token exists, use the authenticated endpoint
        const response = await axios.get(`https://course-creation-backend.onrender.com/api/students/course/${courseId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data.success) {
          setExistingReviews(response.data.reviews || []);
          setExistingComments(response.data.comments || []);
          
          // Set user-specific data
          setUserHasReviewed(response.data.hasUserReviewed || false);
          setUserReview(response.data.userReview || null);
          setUserComments(response.data.userComments || []);
          
          // If user has already reviewed, pre-fill the review form
          if (response.data.userReview) {
            setRating(response.data.userReview.rating || 0);
            setReviewComment(response.data.userReview.comment || '');
          }
        }
      } catch (error) {
        console.error('Error fetching reviews and comments:', error);
        // Don't set error here as it might not be critical
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchReviewsAndComments();
    }
  }, [courseId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!comment.trim()) {
      setError('Please enter a comment');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required. Please log in.');
        return;
      }
      
      const response = await axios.post('https://course-creation-backend.onrender.com/api/students/course-interaction', 
        { 
          courseId, 
          comment,
          interactionType: 'comment'
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        setCommentSuccess('Your comment has been added successfully!');
        setComment('');
        
        // Add the new comment to the existing comments
        const newComment = {
          _id: response.data.comment._id || Date.now().toString(),
          user: response.data.comment.user,
          comment: response.data.comment.comment,
          createdAt: response.data.comment.createdAt,
          rating: 0
        };
        
        setExistingComments([newComment, ...existingComments]);
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setCommentSuccess(null);
        }, 3000);
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      setError(error.response?.data?.message || 'Error submitting comment. Please try again.');
    }
  };
  
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }
    
    if (!reviewComment.trim()) {
      setError('Please enter a review comment');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required. Please log in.');
        return;
      }
      
      const response = await axios.post('https://course-creation-backend.onrender.com/api/students/review', 
        { 
          courseId, 
          rating,
          comment: reviewComment
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        setReviewSuccess(userHasReviewed ? 'Your review has been updated successfully!' : 'Your review has been submitted successfully!');
        setUserHasReviewed(true);
        
        // Add the new review to the existing reviews or update if exists
        const newReview = {
          _id: response.data.review._id || Date.now().toString(),
          user: response.data.review.user,
          comment: response.data.review.comment,
          rating: response.data.review.rating,
          createdAt: response.data.review.createdAt
        };
        
        // Update userReview state
        setUserReview(newReview);
        
        // Check if this user already has a review
        const existingReviewIndex = existingReviews.findIndex(
          review => review.user._id === response.data.review.user
        );
        
        if (existingReviewIndex !== -1) {
          // Update existing review
          const updatedReviews = [...existingReviews];
          updatedReviews[existingReviewIndex] = newReview;
          setExistingReviews(updatedReviews);
        } else {
          // Add new review
          setExistingReviews([newReview, ...existingReviews]);
        }
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setReviewSuccess(null);
        }, 3000);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      setError(error.response?.data?.message || 'Error submitting review. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Reviews & Comments</h2>
        
        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {isPurchased ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
            {/* Review Form */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 text-gray-700">
                {userHasReviewed ? 'Update Your Review' : 'Add a Review'}
              </h3>
              {reviewSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded mb-4">
                  {reviewSuccess}
                </div>
              )}
              <form onSubmit={handleReviewSubmit}>
                <div className="flex items-center mb-3">
                  <p className="mr-3 text-gray-700">Rating: <span className="text-red-500">*</span></p>
                  <div className="flex">
                    {[...Array(5)].map((_, index) => {
                      const ratingValue = index + 1;
                      return (
                        <label key={index} className="cursor-pointer">
                          <input
                            type="radio"
                            name="rating"
                            className="hidden"
                            value={ratingValue}
                            onClick={() => setRating(ratingValue)}
                          />
                          <FaStar
                            className="mr-1"
                            size={24}
                            color={ratingValue <= (hover || rating) ? "#FFD700" : "#e4e5e9"}
                            onMouseEnter={() => setHover(ratingValue)}
                            onMouseLeave={() => setHover(0)}
                          />
                        </label>
                      );
                    })}
                  </div>
                </div>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="4"
                  placeholder="Write your review here..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                ></textarea>
                <button
                  type="submit"
                  className="mt-3 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  {userHasReviewed ? 'Update Review' : 'Submit Review'}
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-6 py-4 rounded-lg mb-6">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="font-medium">You need to purchase this course to add reviews or comments.</p>
            </div>
          </div>
        )}
        
        {/* Display Reviews */}
        {existingReviews.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Course Reviews</h3>
            <div className="space-y-4">
              {existingReviews.map((review) => (
                <div key={review._id} className="border-b border-gray-200 pb-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        {review.user.profileImage ? (
                          <img 
                            src={review.user.profileImage} 
                            alt={`${review.user.firstname} ${review.user.lastname}`} 
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-medium">
                              {review.user.firstname?.charAt(0)}{review.user.lastname?.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          {review.user.firstname} {review.user.lastname}
                        </p>
                        <div className="flex items-center mt-1">
                          {[...Array(5)].map((_, index) => (
                            <FaStar 
                              key={index}
                              className="mr-1" 
                              size={16} 
                              color={index < review.rating ? "#FFD700" : "#e4e5e9"} 
                            />
                          ))}
                          <span className="text-sm text-gray-500 ml-2">
                            {formatDate(review.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="mt-2 text-gray-600">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Display Comments */}
        {existingComments.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Course Comments</h3>
            <div className="space-y-4">
              {existingComments.map((comment) => (
                <div key={comment._id} className="border-b border-gray-200 pb-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        {comment.user.profileImage ? (
                          <img 
                            src={comment.user.profileImage} 
                            alt={`${comment.user.firstname} ${comment.user.lastname}`} 
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-medium">
                              {comment.user.firstname?.charAt(0)}{comment.user.lastname?.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          {comment.user.firstname} {comment.user.lastname}
                        </p>
                        <span className="text-sm text-gray-500">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="mt-2 text-gray-600">{comment.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {existingReviews.length === 0 && existingComments.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No reviews or comments yet. Be the first to share your thoughts!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentReviews;