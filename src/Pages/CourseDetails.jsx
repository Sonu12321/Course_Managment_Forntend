// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { loadStripe } from '@stripe/stripe-js';

// // Import components
// import CourseHeader from '../components/course/CourseHeader';
// import VideoPlayer from '../components/course/VideoPlayer';
// import CourseOverview from '../components/course/CourseOverview';
// import CourseContent from '../components/course/CourseContent';
// import CourseReviews from '../components/course/CourseReviews';
// import CourseSidebar from '../components/course/CourseSidebar';
// import PaymentModal from '../components/course/PaymentModal';
// import CourseCompletionCertificate from '../Components/course/CourseCompletionCertificate';

// const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// const CourseDetails = () => {
//   const { courseId } = useParams();
//   const navigate = useNavigate();
//   const [course, setCourse] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [activeTab, setActiveTab] = useState('overview');
//   const [isEnrolled, setIsEnrolled] = useState(false);
//   const [currentVideo, setCurrentVideo] = useState(null);
//   const [relatedCourses, setRelatedCourses] = useState([]);
  
//   // Payment related states
//   const [paymentLoading, setPaymentLoading] = useState(false);
//   const [paymentError, setPaymentError] = useState('');
//   const [paymentSuccess, setPaymentSuccess] = useState(false);
//   const [showPaymentModal, setShowPaymentModal] = useState(false);
//   const [clientSecret, setClientSecret] = useState('');
//   const [paymentType, setPaymentType] = useState('full');
//   const [installmentPlan, setInstallmentPlan] = useState('6');
  
//   // Course completion related states
//   const [courseProgress, setCourseProgress] = useState(0);
//   const [completedVideos, setCompletedVideos] = useState([]);
//   const [showCertificate, setShowCertificate] = useState(false);
//   const [isCourseCompleted, setIsCourseCompleted] = useState(false);

//   useEffect(() => {
//     const fetchCourseDetails = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         if (!token) {
//           setError('Authentication required. Please log in.');
//           setLoading(false);
//           return;
//         }

//         // Fetch course details
//         const response = await axios.get(`https://course-creation-backend.onrender.com/api/Courseget/details/${courseId}`, {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         });

//         if (response.data.success) {
//           setCourse(response.data.course);
//           setIsEnrolled(response.data.course.isEnrolled);
          
//           // Set the preview video as the current video
//           if (response.data.course.content && response.data.course.content.length > 0) {
//             setCurrentVideo(response.data.course.content[0]);
//           }
          
//           // Fetch related courses
//           const relatedResponse = await axios.get(`https://course-creation-backend.onrender.com/api/Courseget/related/${courseId}`, {
//             headers: {
//               Authorization: `Bearer ${token}`
//             }
//           });
          
//           if (relatedResponse.data.success) {
//             setRelatedCourses(relatedResponse.data.courses);
//           }

//           // If enrolled, fetch course completion status
//           if (response.data.course.isEnrolled) {
//             fetchCourseCompletionStatus();
//           }
//         } else {
//           setError('Failed to fetch course details');
//         }
//       } catch (error) {
//         console.error('Error fetching course details:', error);
//         setError('Error fetching course details. Please try again later.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCourseDetails();
//   }, [courseId]);

//   // Fetch course completion status
//   const fetchCourseCompletionStatus = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) return;

//       const response = await axios.get(
//         `https://course-creation-backend.onrender.com/api/course-completion/status/${courseId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         }
//       );

//       if (response.data.success) {
//         setCourseProgress(response.data.progress);
//         setCompletedVideos(response.data.completedVideos || []);
//         setIsCourseCompleted(response.data.completionStatus === 'completed');
//       }
//     } catch (error) {
//       console.error('Error fetching course completion status:', error);
//     }
//   };

//   const handleVideoCompleted = (video) => {
//     // Add video to completed videos if not already included
//     if (!completedVideos.includes(video._id)) {
//       setCompletedVideos([...completedVideos, video._id]);
      
//       // Recalculate progress
//       if (course && course.content) {
//         const newProgress = Math.round(((completedVideos.length + 1) / course.content.length) * 100);
//         setCourseProgress(newProgress);
        
//         // Check if course is now completed
//         if (newProgress >= 100) {
//           setIsCourseCompleted(true);
//         }
//       }
//     }
//   };

//   const handleCourseCompletion = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         navigate('/login');
//         return;
//       }

//       // Call the backend API to mark the course as completed
//       const response = await axios.post(
//         `https://course-creation-backend.onrender.com/api/student/track-progress`,
//         {
//           courseId: course._id,
//           videoId: currentVideo._id,
//           completed: true
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       if (response.data.success) {
//         setIsCourseCompleted(true);
//         // Show certificate if course is completed
//         if (response.data.isCompleted) {
//           setShowCertificate(true);
//         } else {
//           alert('Course progress updated!');
//         }
//       } else {
//         alert('Failed to update course progress. Please try again.');
//       }
//     } catch (error) {
//       console.error('Error marking course as completed:', error);
//       alert('Error updating course progress. Please try again.');
//     }
//   };

//   const handleEnroll = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         navigate('/login');
//         return;
//       }
//       setPaymentLoading(true);
//       setPaymentError('');
//       // 1. Initiate purchase to get clientSecret
//       const response = await axios.post(
//         'https://course-creation-backend.onrender.com/api/purchase/initiate',
//         {
//           courseId: courseId,
//           paymentType: paymentType,
//           installmentPlan: paymentType === 'installment' ? installmentPlan : undefined,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );
//       if (response.data.clientSecret) {
//         setClientSecret(response.data.clientSecret);
//         setShowPaymentModal(true);
//       } else {
//         setPaymentError('Could not initiate payment.');
//       }
//     } catch (error) {
//       setPaymentError(error.response?.data?.message || 'Failed to initiate payment.');
//     } finally {
//       setPaymentLoading(false);
//     }
//   };

//   const handlePaymentSuccess = async (paymentIntent) => {
//     try {
//       const token = localStorage.getItem('token');
//       setPaymentLoading(true);
//       // 2. Confirm payment with backend
//       await axios.post(
//         'https://course-creation-backend.onrender.com/api/purchase/confirm',
//         { paymentIntentId: paymentIntent.id },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );
//       setPaymentSuccess(true);
//       setShowPaymentModal(false);
//       // Optionally, refresh course details or redirect
//       setIsEnrolled(true);
//     } catch (error) {
//       setPaymentError('Payment was processed but enrollment failed. Please contact support.');
//     } finally {
//       setPaymentLoading(false);
//     }
//   };

//   const handleAddToWishlist = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         navigate('/login');
//         return;
//       }

//       // Add to wishlist using our new controller
//       const response = await axios.post(`https://course-creation-backend.onrender.com/api/Courseget/wishlist/${courseId}`, {}, {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });

//       if (response.data.success) {
//         alert('Added to wishlist!');
//       } else {
//         alert('Failed to add to wishlist. Please try again.');
//       }
//     } catch (error) {
//       console.error('Error adding to wishlist:', error);
//       alert('Error adding to wishlist. Please try again.');
//     }
//   };

//   const handleVideoSelect = (video) => {
//     // If user is enrolled or the video is a preview, play it
//     if (isEnrolled || video.isPreview) {
//       setCurrentVideo(video);
//     } else {
//       // Otherwise show a message that they need to enroll
//       alert('Please enroll in this course to access all content');
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="container mx-auto px-4 py-8">
//         <div className="bg-red-50 text-red-600 p-6 rounded-lg shadow-md">
//           <h2 className="text-xl font-bold mb-2">Error</h2>
//           <p>{error}</p>
//           <button 
//             onClick={() => navigate('/')}
//             className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
//           >
//             Return to Home
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (!course) {
//     return (
//       <div className="container mx-auto px-4 py-8">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold mb-2">Course Not Found</h2>
//           <button 
//             onClick={() => navigate('/')}
//             className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
//           >
//             Return to Home
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-gray-50 min-h-screen pb-12">
//       {/* Course Header */}
//       <CourseHeader 
//         course={course}
//         isEnrolled={isEnrolled}
//         handleEnroll={handleEnroll}
//         handleAddToWishlist={handleAddToWishlist}
//         paymentLoading={paymentLoading}
//       />
      
//       {/* Main Content */}
//       <div className="container mx-auto px-4 py-8">
//         {/* Course Progress Bar (for enrolled users) */}
//         {isEnrolled && (
//           <div className="mb-6 bg-white p-4 rounded-lg shadow">
//             <div className="flex justify-between items-center mb-2">
//               <h3 className="font-semibold">Course Progress</h3>
//               <span className="text-sm font-medium">{courseProgress}% Complete</span>
//             </div>
//             <div className="w-full bg-gray-200 rounded-full h-2.5">
//               <div 
//                 className="bg-blue-600 h-2.5 rounded-full" 
//                 style={{ width: `${courseProgress}%` }}
//               ></div>
//             </div>
//             {isCourseCompleted && (
//               <div className="mt-4 flex justify-end">
//                 <button 
//                   onClick={() => setShowCertificate(true)}
//                   className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
//                 >
//                   View Certificate
//                 </button>
//               </div>
//             )}
//           </div>
//         )}

//         <div className="flex flex-col lg:flex-row gap-8">
//           {/* Left Column - Video Player and Content */}
//           <div className="lg:w-2/3">
//             {/* Video Player */}
//             <VideoPlayer 
//               currentVideo={currentVideo} 
//               course={course} 
//               isEnrolled={isEnrolled}
//               onVideoCompleted={handleVideoCompleted}
//             />
            
//             {/* Tabs */}
//             <div className="mb-6">
//               <div className="flex border-b border-gray-200">
//                 <button 
//                   onClick={() => setActiveTab('overview')}
//                   className={`px-6 py-3 font-medium ${activeTab === 'overview' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
//                 >
//                   Overview
//                 </button>
//                 <button 
//                   onClick={() => setActiveTab('content')}
//                   className={`px-6 py-3 font-medium ${activeTab === 'content' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
//                 >
//                   Course Content
//                 </button>
//                 <button 
//                   onClick={() => setActiveTab('reviews')}
//                   className={`px-6 py-3 font-medium ${activeTab === 'reviews' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
//                 >
//                   Reviews
//                 </button>
//               </div>
              
//               <div className="py-6">
//                 {activeTab === 'overview' && <CourseOverview course={course} />}
                
//                 {activeTab === 'content' && (
//                   <CourseContent 
//                     course={course}
//                     handleVideoSelect={handleVideoSelect}
//                     currentVideo={currentVideo}
//                     isEnrolled={isEnrolled}
//                     completedVideos={completedVideos}
//                   />
//                 )}
                
//                 {activeTab === 'reviews' && <CourseReviews course={course} />}
                
//                 {/* Course Completion Button */}
//                 {isEnrolled && !isCourseCompleted && courseProgress > 0 && (
//                   <button 
//                     onClick={handleCourseCompletion}
//                     className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
//                   >
//                     Mark Course as Completed
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>
          
//           {/* Right Column - Course Sidebar */}
//           <div className="lg:w-1/3">
//             <CourseSidebar 
//               course={course}
//               isEnrolled={isEnrolled}
//               paymentType={paymentType}
//               setPaymentType={setPaymentType}
//               installmentPlan={installmentPlan}
//               setInstallmentPlan={setInstallmentPlan}
//               handleEnroll={handleEnroll}
//               handleAddToWishlist={handleAddToWishlist}
//               paymentLoading={paymentLoading}
//             />
//           </div>
//         </div>
//       </div>

//       {/* Payment Modal */}
//       <PaymentModal 
//         showPaymentModal={showPaymentModal}
//         clientSecret={clientSecret}
//         paymentError={paymentError}
//         handlePaymentSuccess={handlePaymentSuccess}
//         setPaymentError={setPaymentError}
//         setShowPaymentModal={setShowPaymentModal}
//         stripePromise={stripePromise}
//       />

//       {/* Certificate Modal */}
//       {showCertificate && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full overflow-auto max-h-screen">
//             <CourseCompletionCertificate 
//               courseId={courseId} 
//               onClose={() => setShowCertificate(false)} 
//             />
//           </div>
//         </div>
//       )}
// 4    </div>
//   );
// };

// export default CourseDetails;