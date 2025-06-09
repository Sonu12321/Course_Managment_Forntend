import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import SearchFilter from '../components/courses/SearchFilter';
import CourseCard from '../components/courses/CourseCard';
import PaymentModal from '../components/courses/PaymentModal';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function CardForCourse() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [courses, setCourses] = useState([]);
    const [error, setError] = useState('');
    const [paymentType, setPaymentType] = useState('full');
    const [installmentPlan, setInstallmentPlan] = useState('3');
    const token = localStorage.getItem('token');
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [clientSecret, setClientSecret] = useState('');
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [categories] = useState(['Programming', 'Design', 'Business', 'Marketing', 'Music']);

    // Handle purchase initiation - updated to prevent any redirection
    const handlePurchase = async (course) => {
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            setLoading(true);
            setError('');
            setSelectedCourse(course);

            // Prevent any default navigation
            const response = await axios.post(
                'https://course-creation-backend.onrender.com/api/purchases/initiate',
                {
                    courseId: course._id,
                    paymentType,
                    installmentPlan: paymentType === 'installment' ? parseInt(installmentPlan) : undefined
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.clientSecret) {
                setClientSecret(response.data.clientSecret);
                setShowPaymentModal(true);
            } else {
                throw new Error('No client secret received from server');
            }
        } catch (error) {
            console.error('Purchase error:', error);
            setError(error.response?.data?.message || 'Failed to initiate purchase');
        } finally {
            setLoading(false);
        }
    };

    // Handle successful payment
    const handlePaymentSuccess = async (paymentIntent) => {
        try {
            // Update the purchase status in the backend
            await axios.post(
                'https://course-creation-backend.onrender.com/api/purchases/confirm',
                {
                    paymentIntentId: paymentIntent.id
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            setPaymentSuccess(true);
            setShowPaymentModal(false);
            
            // Redirect to course page or show success message
            setTimeout(() => {
                navigate(`/course/${selectedCourse._id}`);
            }, 2000);
        } catch (error) {
            console.error('Error confirming payment:', error);
            setError('Payment was processed but we had trouble updating your enrollment. Please contact support.');
        }
    };

    // Handle payment error
    const handlePaymentError = (errorMessage) => {
        setError(errorMessage);
    };

    // Fetch courses on component mount and when search/filter changes
    useEffect(() => {
        fetchCourses();
    }, [searchTerm, selectedCategory]);

    // Fetch courses from API
    const fetchCourses = async () => {
        try {
            // Add headers for authentication if token exists
            const config = token ? {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            } : {
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            // Add search and category parameters if needed
            const params = new URLSearchParams();
            if (searchTerm) params.append('search', searchTerm);
            if (selectedCategory) params.append('category', selectedCategory);

            const response = await axios.get(
                `https://course-creation-backend.onrender.com/api/courses/courses?${params.toString()}`, 
                config
            );
            setCourses(response.data.courses);
            setLoading(false);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to fetch courses');
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            {/* Search and Filter Section */}
            <SearchFilter 
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                categories={categories}
            />

            {/* Payment Success Message */}
            {paymentSuccess && (
                <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-md">
                    Payment successful! You now have access to the course.
                </div>
            )}

            {/* Courses Grid */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : courses.length === 0 ? (
                <div className="text-center py-10">
                    <p className="text-gray-500">No courses found. Try adjusting your search criteria.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map(course => (
                        <CourseCard 
                            key={course._id}
                            course={course}
                            paymentType={paymentType}
                            setPaymentType={setPaymentType}
                            installmentPlan={installmentPlan}
                            setInstallmentPlan={setInstallmentPlan}
                            handlePurchase={handlePurchase}
                            loading={loading}
                            error={error}
                        />
                    ))}
                </div>
            )}

            {/* Payment Modal */}
            <PaymentModal 
                showPaymentModal={showPaymentModal}
                setShowPaymentModal={setShowPaymentModal}
                selectedCourse={selectedCourse}
                paymentType={paymentType}
                installmentPlan={installmentPlan}
                clientSecret={clientSecret}
                stripePromise={stripePromise}
                handlePaymentSuccess={handlePaymentSuccess}
                handlePaymentError={handlePaymentError}
            />
        </div>
    );
}

export default CardForCourse;