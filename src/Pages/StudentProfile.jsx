import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { InputBox, Button } from '../Components/Contianer';
import { FaGraduationCap, FaCreditCard, FaUser, FaEdit, FaCamera, FaBook, FaCalendarAlt, FaCheckCircle } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StudentProfile = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showImageInput, setShowImageInput] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [activeTab, setActiveTab] = useState('profile');
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [pendingInstallments, setPendingInstallments] = useState([]);
    const [profile, setProfile] = useState({
        firstName: '',
        lastName: '',
        profileImage: null,
    });

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const decoded = jwtDecode(token);
            if (decoded.role !== 'user') {
                navigate('/');
                return;
            }
            fetchProfile();
            fetchEnrolledCourses();
            fetchPendingInstallments();
        } catch (error) {
            navigate('/login');
        }
    }, [token, navigate]);

    const fetchProfile = async () => {
        try {
            const response = await axios.get('https://course-creation-backend.onrender.com/api/students/profile', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            // Check if the response contains student data
            if (response.data.success && response.data.student) {
                setProfile(prev => ({
                    ...prev,
                    firstName: response.data.student.firstname,
                    lastName: response.data.student.lastname,
                }));
                
                // Set image preview if exists
                if (response.data.student.profileImage) {
                    setImagePreview(response.data.student.profileImage);
                }
            } else {
                setError("Failed to fetch profile data");
                toast.error("Failed to fetch profile data");
            }
        } catch (error) {
            console.error("Profile fetch error:", error);
            const errorMsg = "Failed to fetch profile: " + (error.response?.data?.message || error.message);
            setError(errorMsg);
            toast.error(errorMsg);
        }
    };

    const fetchEnrolledCourses = async () => {
        try {
            const response = await axios.get('https://course-creation-backend.onrender.com/api/students/enrolled-courses', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (response.data.success) {
                setEnrolledCourses(response.data.courses || []);
            } else {
                console.error("Failed to fetch enrolled courses");
            }
        } catch (error) {
            console.error("Error fetching enrolled courses:", error);
        }
    };

    const fetchPendingInstallments = async () => {
        try {
            const response = await axios.get('https://course-creation-backend.onrender.com/api/students/pending-installments', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (response.data.success) {
                setPendingInstallments(response.data.installments || []);
            } else {
                console.error("Failed to fetch pending installments");
            }
        } catch (error) {
            console.error("Error fetching pending installments:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        const formData = new FormData();
        formData.append('firstName', profile.firstName);
        formData.append('lastName', profile.lastName);
        if (profile.profileImage) formData.append('profileImage', profile.profileImage);

        try {
            const response = await axios.put('https://course-creation-backend.onrender.com/api/students/Studentupdate', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.success) {
                const successMsg = response.data.message || "Profile updated successfully";
                setSuccess(successMsg);
                toast.success(successMsg);
                setProfile(prev => ({ 
                    ...prev, 
                    currentPassword: '', 
                    newPassword: '' 
                }));
                fetchProfile(); // Refresh profile data after update
            } else {
                const errorMsg = response.data.message || "Failed to update profile";
                setError(errorMsg);
                toast.error(errorMsg);
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Error updating profile";
            setError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleImageClick = () => {
        setShowImageInput(!showImageInput);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfile({ ...profile, profileImage: file });
            setImagePreview(URL.createObjectURL(file));
            setShowImageInput(false);
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Render the profile tab content with enhanced styling
    const renderProfileTab = () => (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-32"></div>
            
            {/* Profile Image Section - Repositioned for better visual appeal */}
            <div className="relative px-6">
                <div 
                    className="w-32 h-32 rounded-full bg-white border-4 border-white overflow-hidden cursor-pointer absolute -top-16 shadow-lg"
                    onClick={handleImageClick}
                >
                    {imagePreview ? (
                        <img 
                            src={imagePreview} 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <FaUser className="text-gray-400 text-4xl" />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all flex items-center justify-center">
                        <FaCamera className="text-white opacity-0 hover:opacity-100 text-xl" />
                    </div>
                </div>
                
                {showImageInput && (
                    <div className="mt-20 mb-4 max-w-md">
                        <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                            <input
                                type="file"
                                onChange={handleImageChange}
                                accept="image/*"
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                        </div>
                    </div>
                )}
            </div>

            <div className="p-8 pt-20">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Personal Information</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                            <InputBox
                                value={profile.firstName}
                                onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                                required
                                className="w-full focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter your first name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                            <InputBox
                                value={profile.lastName}
                                onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                                required
                                className="w-full focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter your last name"
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Updating Profile...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center">
                                    <FaEdit className="mr-2" /> Update Profile
                                </span>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );

    // Render the courses tab content with enhanced styling
    const renderCoursesTab = () => (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <FaBook className="mr-3 text-blue-600" /> My Enrolled Courses
                </h2>
            </div>
            
            <div className="p-6">
                {enrolledCourses.length === 0 ? (
                    <div className="text-center py-16 px-4">
                        <div className="bg-blue-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                            <FaGraduationCap className="text-4xl text-blue-500" />
                        </div>
                        <h3 className="text-xl font-medium text-gray-800 mb-2">No Courses Yet</h3>
                        <p className="text-gray-500 mb-6 max-w-md mx-auto">You haven't enrolled in any courses yet. Browse our catalog to find courses that match your interests.</p>
                        <Button 
                            onClick={() => navigate('/courses')}
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
                        >
                            Browse Courses
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {enrolledCourses.map((course) => (
                            <div key={course.courseId} className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col">
                                <div className="h-40 bg-gradient-to-r from-blue-400 to-indigo-500 relative overflow-hidden">
                                    {course.courseDetails?.thumbnail && (
                                        <img 
                                            src={course.courseDetails.thumbnail} 
                                            alt={course.courseDetails?.title || 'Course'} 
                                            className="w-full h-full object-cover opacity-90"
                                        />
                                    )}
                                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                                        <h3 className="font-semibold text-lg text-white truncate">
                                            {course.courseDetails?.title || 'Course Title'}
                                        </h3>
                                    </div>
                                </div>
                                <div className="p-4 flex-grow">
                                    <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
                                        <span className="flex items-center">
                                            <FaCalendarAlt className="mr-1 text-blue-500" /> 
                                            {formatDate(course.enrollmentDate)}
                                        </span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            course.status === 'completed' 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-blue-100 text-blue-800'
                                        }`}>
                                            {course.status === 'completed' ? (
                                                <span className="flex items-center">
                                                    <FaCheckCircle className="mr-1" /> Completed
                                                </span>
                                            ) : 'Active'}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                        {course.courseDetails?.subtitle || 'Continue your learning journey with this course.'}
                                    </p>
                                </div>
                                <div className="p-4 pt-0 mt-auto">
                                    <Button 
                                        onClick={() => navigate(`/course/${course.courseId}`)}
                                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
                                    >
                                        Continue Learning
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );

    // Render the payments tab content with enhanced styling
    const renderPaymentsTab = () => (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <FaCreditCard className="mr-3 text-blue-600" /> Pending Payments
                </h2>
            </div>
            
            <div className="p-6">
                {pendingInstallments.length === 0 ? (
                    <div className="text-center py-16 px-4">
                        <div className="bg-green-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                            <FaCheckCircle className="text-4xl text-green-500" />
                        </div>
                        <h3 className="text-xl font-medium text-gray-800 mb-2">All Payments Completed</h3>
                        <p className="text-gray-500 max-w-md mx-auto">You don't have any pending payments at the moment.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {pendingInstallments.map((installment) => (
                                    <tr key={installment.installmentId} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 rounded-md overflow-hidden">
                                                    <img 
                                                        className="h-10 w-10 object-cover" 
                                                        src={installment.courseThumbnail || 'https://via.placeholder.com/40?text=Course'} 
                                                        alt={installment.courseTitle} 
                                                    />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{installment.courseTitle}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">${installment.amount.toFixed(2)}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-700">{formatDate(installment.dueDate)}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                installment.status === 'overdue' 
                                                    ? 'bg-red-100 text-red-800' 
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {installment.status === 'overdue' ? 'Overdue' : 'Pending'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <Button 
                                                onClick={() => navigate(`/payment/${installment.purchaseId}/${installment.installmentId}`)}
                                                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
                                            >
                                                Pay Now
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <ToastContainer 
                position="top-right" 
                autoClose={5000} 
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-center mb-2">Student Dashboard</h1>
                <p className="text-gray-500 text-center mb-8">Manage your profile, courses, and payments</p>
                
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 flex items-start">
                        <div className="flex-shrink-0 mt-0.5">
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm">{error}</p>
                        </div>
                    </div>
                )}
                
                {success && (
                    <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-lg mb-6 flex items-start">
                        <div className="flex-shrink-0 mt-0.5">
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm">{success}</p>
                        </div>
                    </div>
                )}

                {/* Dashboard Tabs - Enhanced with better styling */}
                <div className="bg-white rounded-xl shadow-sm mb-6 p-1">
                    <div className="flex flex-wrap">
                        <button
                            className={`flex items-center px-6 py-3 font-medium text-sm rounded-lg transition-all duration-200 ${
                                activeTab === 'profile' 
                                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700' 
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                            onClick={() => setActiveTab('profile')}
                        >
                            <FaUser className={`mr-2 ${activeTab === 'profile' ? 'text-blue-600' : 'text-gray-400'}`} /> 
                            Profile
                        </button>
                        <button
                            className={`flex items-center px-6 py-3 font-medium text-sm rounded-lg transition-all duration-200 ${
                                activeTab === 'courses' 
                                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700' 
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                            onClick={() => setActiveTab('courses')}
                        >
                            <FaGraduationCap className={`mr-2 ${activeTab === 'courses' ? 'text-blue-600' : 'text-gray-400'}`} /> 
                            My Courses
                            {enrolledCourses.length > 0 && (
                                <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                                    {enrolledCourses.length}
                                </span>
                            )}
                        </button>
                        <button
                            className={`flex items-center px-6 py-3 font-medium text-sm rounded-lg transition-all duration-200 ${
                                activeTab === 'payments' 
                                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700' 
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                            onClick={() => setActiveTab('payments')}
                        >
                            <FaCreditCard className={`mr-2 ${activeTab === 'payments' ? 'text-blue-600' : 'text-gray-400'}`} /> 
                            Payments
                            {pendingInstallments.length > 0 && (
                                <span className="ml-2 bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                                    {pendingInstallments.length}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="mt-6">
                    {activeTab === 'profile' && renderProfileTab()}
                    {activeTab === 'courses' && renderCoursesTab()}
                    {activeTab === 'payments' && renderPaymentsTab()}
                </div>
            </div>
        </div>
    );
};

export default StudentProfile;