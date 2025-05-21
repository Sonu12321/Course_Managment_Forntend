import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { InputBox, Button } from '../Components/Contianer';
import { FaGraduationCap, FaCreditCard, FaUser, FaEdit } from 'react-icons/fa';

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
        email: '',
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
                    email: response.data.student.email,
                }));
                
                // Set image preview if exists
                if (response.data.student.profileImage) {
                    setImagePreview(response.data.student.profileImage);
                }
            } else {
                setError("Failed to fetch profile data");
            }
        } catch (error) {
            console.error("Profile fetch error:", error);
            setError("Failed to fetch profile: " + (error.response?.data?.message || error.message));
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
        formData.append('email', profile.email);
        if (profile.currentPassword) formData.append('currentPassword', profile.currentPassword);
        if (profile.newPassword) formData.append('newPassword', profile.newPassword);
        if (profile.profileImage) formData.append('profileImage', profile.profileImage);

        try {
            const response = await axios.put('https://course-creation-backend.onrender.com/api/students/Studentupdate', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.success) {
                setSuccess(response.data.message);
                setProfile(prev => ({ 
                    ...prev, 
                    currentPassword: '', 
                    newPassword: '' 
                }));
                fetchProfile(); // Refresh profile data after update
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            setError(error.response?.data?.message || "Error updating profile");
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

    // Render the profile tab content
    const renderProfileTab = () => (
        <>
            {/* Profile Image Section */}
            <div className="flex flex-col items-center mb-8">
                <div 
                    className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden cursor-pointer relative"
                    onClick={handleImageClick}
                >
                    {imagePreview ? (
                        <img 
                            src={imagePreview} 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <span className="text-gray-500">No Image</span>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all flex items-center justify-center">
                        <span className="text-white opacity-0 hover:opacity-100">Update Photo</span>
                    </div>
                </div>
                
                {showImageInput && (
                    <div className="mt-4">
                        <input
                            type="file"
                            onChange={handleImageChange}
                            accept="image/*"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">First Name</label>
                        <InputBox
                            value={profile.firstName}
                            onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Last Name</label>
                        <InputBox
                            value={profile.lastName}
                            onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <InputBox
                            type="email"
                            value={profile.email}
                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                            required
                        />
                    </div>

                    
                </div>

                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full"
                >
                    {loading ? "Updating..." : "Update Profile"}
                </Button>
            </form>
        </>
    );

    // Render the courses tab content
    const renderCoursesTab = () => (
        <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-2xl font-semibold mb-6">My Enrolled Courses</h2>
            
            {enrolledCourses.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <FaGraduationCap className="mx-auto text-5xl mb-4 text-blue-400" />
                    <p>You haven't enrolled in any courses yet.</p>
                    <Button 
                        onClick={() => navigate('/courses')}
                        className="mt-4"
                    >
                        Browse Courses
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {enrolledCourses.map((course) => (
                        <div key={course.courseId} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            {/* <div className="h-40 overflow-hidden">
                                <img 
                                    src={course.courseDetails.thumbnail || 'https://via.placeholder.com/300x200?text=No+Image'} 
                                    alt={course.courseDetails.title} 
                                    className="w-full h-full object-cover"
                                />
                            </div> */}
                            <div className="p-4">
                                {/* <h3 className="font-semibold text-lg mb-2 truncate">{course.courseDetails.title}</h3>
                                <p className="text-sm text-gray-600 mb-2 truncate">{course.courseDetails.subtitle}</p> */}
                                <div className="flex justify-between items-center text-sm text-gray-500">
                                    <span>Enrolled: {formatDate(course.enrollmentDate)}</span>
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                        course.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                                    }`}>
                                        {course.status === 'completed' ? 'Completed' : 'Active'}
                                    </span>
                                </div>
                                <Button 
                                    onClick={() => navigate(`/course/${course.courseId}`)}
                                    className="w-full mt-4"
                                >
                                    Continue Learning
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    // Render the payments tab content
    const renderPaymentsTab = () => (
        <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-2xl font-semibold mb-6">Pending Payments</h2>
            
            {pendingInstallments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <FaCreditCard className="mx-auto text-5xl mb-4 text-green-400" />
                    <p>You don't have any pending payments.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
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
                                <tr key={installment.installmentId}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <img 
                                                    className="h-10 w-10 rounded-full object-cover" 
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
                                        <div className="text-sm text-gray-900">${installment.amount.toFixed(2)}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{formatDate(installment.dueDate)}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
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
                                            className="text-sm"
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
    );

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-center mb-8">Student Dashboard</h1>
                
                {error && (
                    <div className="bg-red-50 text-red-500 p-3 rounded-lg text-center mb-4">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="bg-green-50 text-green-500 p-3 rounded-lg text-center mb-4">
                        {success}
                    </div>
                )}

                {/* Dashboard Tabs */}
                <div className="flex flex-wrap mb-6 border-b">
                    <button
                        className={`flex items-center px-6 py-3 font-medium text-sm ${
                            activeTab === 'profile' 
                                ? 'text-blue-600 border-b-2 border-blue-600' 
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                        onClick={() => setActiveTab('profile')}
                    >
                        <FaUser className="mr-2" /> Profile
                    </button>
                    <button
                        className={`flex items-center px-6 py-3 font-medium text-sm ${
                            activeTab === 'courses' 
                                ? 'text-blue-600 border-b-2 border-blue-600' 
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                        onClick={() => setActiveTab('courses')}
                    >
                        <FaGraduationCap className="mr-2" /> My Courses
                        {enrolledCourses.length > 0 && (
                            <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                                {enrolledCourses.length}
                            </span>
                        )}
                    </button>
                    <button
                        className={`flex items-center px-6 py-3 font-medium text-sm ${
                            activeTab === 'payments' 
                                ? 'text-blue-600 border-b-2 border-blue-600' 
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                        onClick={() => setActiveTab('payments')}
                    >
                        <FaCreditCard className="mr-2" /> Payments
                        {pendingInstallments.length > 0 && (
                            <span className="ml-2 bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                                {pendingInstallments.length}
                            </span>
                        )}
                    </button>
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