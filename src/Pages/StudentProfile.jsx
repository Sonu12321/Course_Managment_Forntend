import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { InputBox, Button } from '../Components/Contianer';
import { FaGraduationCap, FaCreditCard, FaUser, FaEdit, FaCamera, FaBook, FaCalendarAlt, FaCheckCircle } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Import Material UI components
import { 
    Card, CardContent, CardMedia, CardActions, 
    Typography, Box, Chip, LinearProgress, 
    Collapse, IconButton, Avatar, Grid, Paper, 
    Divider, Tabs, Tab, Badge
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SchoolIcon from '@mui/icons-material/School';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

// Styled components for Material UI
const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        backgroundColor: '#44b700',
        color: '#44b700',
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        '&::after': {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            animation: 'ripple 1.2s infinite ease-in-out',
            border: '1px solid currentColor',
            content: '""',
        },
    },
    '@keyframes ripple': {
        '0%': {
            transform: 'scale(.8)',
            opacity: 1,
        },
        '100%': {
            transform: 'scale(2.4)',
            opacity: 0,
        },
    },
}));

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
    // Add new state for course progress
    const [courseProgress, setCourseProgress] = useState({});
    const [profile, setProfile] = useState({
        firstName: '',
        lastName: '',
        profileImage: null,
    });
    // State for expanded cards
    const [expanded, setExpanded] = useState({});

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

    const fetchCourseProgress = async (courseId) => {
        try {
            const response = await axios.get(
                `https://course-creation-backend.onrender.com/api/progress/course/${courseId}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (response.data.success) {
                return response.data.progress;
            }
            return null;
        } catch (error) {
            console.error(`Error fetching progress for course ${courseId}:`, error);
            return null;
        }
    };

    const fetchEnrolledCourses = async () => {
        try {
            const response = await axios.get('https://course-creation-backend.onrender.com/api/students/enrolled-courses', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (response.data.success) {
                // Ensure we have unique courses by courseId
                const uniqueCourses = Array.from(
                    new Map(response.data.courses.map(course => [course.courseId, course]))
                ).map(([_, course]) => course);
                
                setEnrolledCourses(uniqueCourses);
                
                // Fetch progress for each course
                const progressData = {};
                for (const course of uniqueCourses) {
                    const progress = await fetchCourseProgress(course.courseId);
                    if (progress) {
                        progressData[course.courseId] = progress;
                    }
                }
                setCourseProgress(progressData);
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

    // Handle card expansion
    const handleExpandClick = (courseId) => {
        setExpanded(prev => ({
            ...prev,
            [courseId]: !prev[courseId]
        }));
    };

    // Render the profile tab content with enhanced styling
    const renderProfileTab = () => (
        <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <Box sx={{ 
                height: '120px', 
                background: 'linear-gradient(90deg, #3f51b5 0%, #2196f3 100%)' 
            }}/>
            
            {/* Profile Image Section */}
            <Box sx={{ position: 'relative', px: 3 }}>
                <Box 
                    onClick={handleImageClick}
                    sx={{
                        width: 120,
                        height: 120,
                        borderRadius: '50%',
                        bgcolor: 'white',
                        border: '4px solid white',
                        overflow: 'hidden',
                        position: 'absolute',
                        top: -60,
                        boxShadow: 3,
                        cursor: 'pointer',
                        '&:hover .overlay': {
                            opacity: 0.7
                        }
                    }}
                >
                    {imagePreview ? (
                        <img 
                            src={imagePreview} 
                            alt="Profile" 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    ) : (
                        <Box sx={{ 
                            width: '100%', 
                            height: '100%', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            bgcolor: 'grey.100'
                        }}>
                            <FaUser style={{ fontSize: '2.5rem', color: '#9e9e9e' }} />
                        </Box>
                    )}
                    <Box className="overlay" sx={{
                        position: 'absolute',
                        inset: 0,
                        bgcolor: 'black',
                        opacity: 0,
                        transition: 'opacity 0.3s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <FaCamera style={{ color: 'white', fontSize: '1.5rem' }} />
                    </Box>
                </Box>
                
                {showImageInput && (
                    <Box sx={{ mt: 10, mb: 2, maxWidth: 'md' }}>
                        <Box sx={{ p: 2, border: '1px solid', borderColor: 'grey.200', borderRadius: 1, bgcolor: 'grey.50' }}>
                            <input
                                type="file"
                                onChange={handleImageChange}
                                accept="image/*"
                                style={{
                                    width: '100%',
                                    fontSize: '0.875rem',
                                    color: 'grey.500'
                                }}
                            />
                        </Box>
                    </Box>
                )}
            </Box>

            <Box sx={{ p: 4, pt: 10 }}>
                <Typography variant="h5" fontWeight="bold" color="text.primary" mb={3}>
                    Personal Information
                </Typography>
                
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2" mb={1}>
                                First Name
                            </Typography>
                            <InputBox
                                value={profile.firstName}
                                onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                                required
                                className="w-full focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter your first name"
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2" mb={1}>
                                Last Name
                            </Typography>
                            <InputBox
                                value={profile.lastName}
                                onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                                required
                                className="w-full focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter your last name"
                            />
                        </Grid>

                        <Grid item xs={12} mt={2}>
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
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </Paper>
    );

    // Render the courses tab content with Material UI cards
    const renderCoursesTab = () => (
        <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <Box sx={{ 
                p: 3, 
                borderBottom: '1px solid', 
                borderColor: 'divider',
                background: 'linear-gradient(90deg, #e3f2fd 0%, #e8eaf6 100%)'
            }}>
                <Typography variant="h5" fontWeight="bold" color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
                    <FaBook style={{ marginRight: '0.75rem', color: '#3f51b5' }} /> My Enrolled Courses
                </Typography>
            </Box>
            
            <Box sx={{ p: 3 }}>
                {enrolledCourses.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 8, px: 2 }}>
                        <Avatar sx={{ 
                            width: 80, 
                            height: 80, 
                            bgcolor: '#e3f2fd', 
                            mx: 'auto', 
                            mb: 2 
                        }}>
                            <SchoolIcon sx={{ fontSize: 40, color: '#2196f3' }} />
                        </Avatar>
                        <Typography variant="h6" color="text.primary" mb={1}>
                            No Courses Yet
                        </Typography>
                        <Typography variant="body1" color="text.secondary" mb={3} sx={{ maxWidth: 400, mx: 'auto' }}>
                            You haven't enrolled in any courses yet. Browse our catalog to find courses that match your interests.
                        </Typography>
                        <Button 
                            onClick={() => navigate('/courses')}
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
                        >
                            Browse Courses
                        </Button>
                    </Box>
                ) : (
                    <Grid container spacing={3}>
                        {enrolledCourses.map((course) => {
                            const progress = courseProgress[course.courseId];
                            const completionPercentage = progress ? progress.completionPercentage || 0 : 0;
                            const isCompleted = completionPercentage >= 100 || course.status === 'completed';
                            
                            return (
                                <Grid item xs={12} sm={6} md={4} key={course.courseId}>
                                    <Card 
                                        sx={{ 
                                            height: '100%', 
                                            display: 'flex', 
                                            flexDirection: 'column',
                                            transition: 'transform 0.3s, box-shadow 0.3s',
                                            '&:hover': {
                                                transform: 'translateY(-4px)',
                                                boxShadow: 6
                                            }
                                        }}
                                    >
                                        <CardMedia
                                            component="img"
                                            height="140"
                                            image={course.courseDetails?.thumbnail || 'https://via.placeholder.com/300x140?text=Course'}
                                            alt={course.courseDetails?.title || 'Course'}
                                            sx={{ 
                                                position: 'relative',
                                                '&::after': {
                                                    content: '""',
                                                    position: 'absolute',
                                                    bottom: 0,
                                                    left: 0,
                                                    right: 0,
                                                    height: '50%',
                                                    background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)'
                                                }
                                            }}
                                        />
                                        
                                        <Box sx={{ position: 'relative', mt: -6, px: 2, zIndex: 1 }}>
                                            <Chip
                                                label={isCompleted ? 'Completed' : 'In Progress'}
                                                color={isCompleted ? 'success' : 'primary'}
                                                size="small"
                                                icon={isCompleted ? <FaCheckCircle /> : undefined}
                                                sx={{ fontWeight: 'medium' }}
                                            />
                                        </Box>
                                        
                                        <CardContent sx={{ flexGrow: 1, pt: 1 }}>
                                            <Typography variant="h6" component="div" gutterBottom noWrap>
                                                {course.courseDetails?.title || 'Course Title'}
                                            </Typography>
                                            
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, color: 'text.secondary' }}>
                                                <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                                <Typography variant="body2">
                                                    {formatDate(course.enrollmentDate)}
                                                </Typography>
                                            </Box>
                                            
                                            <Box sx={{ mb: 2 }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Progress
                                                    </Typography>
                                                    <Typography variant="body2" fontWeight="medium">
                                                        {completionPercentage.toFixed(1)}%
                                                    </Typography>
                                                </Box>
                                                <LinearProgress 
                                                    variant="determinate" 
                                                    value={completionPercentage} 
                                                    color={isCompleted ? 'success' : 'primary'}
                                                    sx={{ height: 6, borderRadius: 3 }}
                                                />
                                            </Box>
                                            
                                            {progress && (
                                                <Typography variant="body2" color="text.secondary" mb={2}>
                                                    <b>{progress.watchedVideos?.length || 0}</b> of <b>{progress.totalVideos || 0}</b> videos completed
                                                </Typography>
                                            )}
                                            
                                            <Typography variant="body2" color="text.secondary" sx={{
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                                mb: 2
                                            }}>
                                                {course.courseDetails?.subtitle || 'Continue your learning journey with this course.'}
                                            </Typography>
                                        </CardContent>
                                        
                                        <CardActions disableSpacing>
                                            <Button 
                                                onClick={() => navigate(`/course/${course.courseId}`)}
                                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
                                                startIcon={isCompleted ? <FaCheckCircle /> : <PlayArrowIcon />}
                                            >
                                                {isCompleted ? 'Review Course' : 'Continue Learning'}
                                            </Button>
                                            <ExpandMore
                                                expand={expanded[course.courseId] || false}
                                                onClick={() => handleExpandClick(course.courseId)}
                                                aria-expanded={expanded[course.courseId] || false}
                                                aria-label="show more"
                                            >
                                                <ExpandMoreIcon />
                                            </ExpandMore>
                                        </CardActions>
                                        
                                        <Collapse in={expanded[course.courseId] || false} timeout="auto" unmountOnExit>
                                            <CardContent>
                                                <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                                                    Course Details
                                                </Typography>
                                                <Divider sx={{ mb: 2 }} />
                                                
                                                {course.courseDetails?.description && (
                                                    <Typography paragraph>
                                                        {course.courseDetails.description}
                                                    </Typography>
                                                )}
                                                
                                                {course.courseDetails?.instructor && (
                                                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                                                        <Avatar 
                                                            src={course.courseDetails.instructorImage || undefined} 
                                                            alt={course.courseDetails.instructor}
                                                            sx={{ width: 32, height: 32, mr: 1 }}
                                                        />
                                                        <Typography variant="body2">
                                                            Instructor: <b>{course.courseDetails.instructor}</b>
                                                        </Typography>
                                                    </Box>
                                                )}
                                                
                                                {course.courseDetails?.category && (
                                                    <Chip 
                                                        label={course.courseDetails.category} 
                                                        size="small" 
                                                        sx={{ mt: 2 }}
                                                    />
                                                )}
                                            </CardContent>
                                        </Collapse>
                                    </Card>
                                </Grid>
                            );
                        })}
                    </Grid>
                )}
            </Box>
        </Paper>
    );

    // Render the payments tab content with enhanced styling
    const renderPaymentsTab = () => (
        <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <Box sx={{ 
                p: 3, 
                borderBottom: '1px solid', 
                borderColor: 'divider',
                background: 'linear-gradient(90deg, #e3f2fd 0%, #e8eaf6 100%)'
            }}>
                <Typography variant="h5" fontWeight="bold" color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
                    <FaCreditCard style={{ marginRight: '0.75rem', color: '#3f51b5' }} /> Pending Payments
                </Typography>
            </Box>
            
            <Box sx={{ p: 3 }}>
                {pendingInstallments.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 8, px: 2 }}>
                        <Avatar sx={{ 
                            width: 80, 
                            height: 80, 
                            bgcolor: '#e8f5e9', 
                            mx: 'auto', 
                            mb: 2 
                        }}>
                            <FaCheckCircle style={{ fontSize: 40, color: '#4caf50' }} />
                        </Avatar>
                        <Typography variant="h6" color="text.primary" mb={1}>
                            All Payments Completed
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400, mx: 'auto' }}>
                            You don't have any pending payments at the moment.
                        </Typography>
                    </Box>
                ) : (
                    <Box sx={{ overflowX: 'auto' }}>
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
                    </Box>
                )}
            </Box>
        </Paper>
    );

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', py: 6, px: 2 }}>
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
            
            <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
                <Typography variant="h4" fontWeight="bold" textAlign="center" mb={1}>
                    Student Dashboard
                </Typography>
                <Typography variant="body1" color="text.secondary" textAlign="center" mb={4}>
                    Manage your profile, courses, and payments
                </Typography>
                
                {error && (
                    <Box sx={{ 
                        bgcolor: '#ffebee', 
                        borderLeft: '4px solid #f44336',
                        color: '#c62828',
                        p: 2,
                        borderRadius: 1,
                        mb: 3,
                        display: 'flex',
                        alignItems: 'flex-start'
                    }}>
                        <Box sx={{ mt: 0.5, mr: 1.5 }}>
                            <svg style={{ height: 20, width: 20 }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </Box>
                        <Typography variant="body2">{error}</Typography>
                    </Box>
                )}
                
                {success && (
                    <Box sx={{ 
                        bgcolor: '#e8f5e9', 
                        borderLeft: '4px solid #4caf50',
                        color: '#2e7d32',
                        p: 2,
                        borderRadius: 1,
                        mb: 3,
                        display: 'flex',
                        alignItems: 'flex-start'
                    }}>
                        <Box sx={{ mt: 0.5, mr: 1.5 }}>
                            <svg style={{ height: 20, width: 20 }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </Box>
                        <Typography variant="body2">{success}</Typography>
                    </Box>
                )}

                {/* Dashboard Tabs - Material UI styled */}
                <Paper elevation={1} sx={{ borderRadius: 3, mb: 3, p: 0.5 }}>
                    <Tabs
                        value={activeTab}
                        onChange={(_, newValue) => setActiveTab(newValue)}
                        variant="fullWidth"
                        indicatorColor="primary"
                        textColor="primary"
                        sx={{ 
                            '& .MuiTab-root': {
                                minHeight: 48,
                                borderRadius: 2,
                                fontWeight: 500,
                                transition: 'all 0.2s',
                                '&.Mui-selected': {
                                    background: 'linear-gradient(90deg, #e3f2fd 0%, #e8eaf6 100%)',
                                }
                            }
                        }}
                    >
                        <Tab 
                            value="profile" 
                            label={
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <FaUser style={{ marginRight: 8, fontSize: 16 }} />
                                    Profile
                                </Box>
                            }
                        />
                        <Tab 
                            value="courses" 
                            label={
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <FaGraduationCap style={{ marginRight: 8, fontSize: 16 }} />
                                    My Courses
                                    {enrolledCourses.length > 0 && (
                                        <Chip 
                                            label={enrolledCourses.length} 
                                            size="small" 
                                            color="primary" 
                                            sx={{ ml: 1, height: 20, minWidth: 20 }}
                                        />
                                    )}
                                </Box>
                            }
                        />
                        <Tab 
                            value="payments" 
                            label={
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <FaCreditCard style={{ marginRight: 8, fontSize: 16 }} />
                                    Payments
                                    {pendingInstallments.length > 0 && (
                                        <Chip 
                                            label={pendingInstallments.length} 
                                            size="small" 
                                            color="error" 
                                            sx={{ ml: 1, height: 20, minWidth: 20 }}
                                        />
                                    )}
                                </Box>
                            }
                        />
                    </Tabs>
                </Paper>

                {/* Tab Content */}
                <Box sx={{ mt: 3 }}>
                    {activeTab === 'profile' && renderProfileTab()}
                    {activeTab === 'courses' && renderCoursesTab()}
                    {activeTab === 'payments' && renderPaymentsTab()}
                </Box>
            </Box>
        </Box>
    );
};

export default StudentProfile;