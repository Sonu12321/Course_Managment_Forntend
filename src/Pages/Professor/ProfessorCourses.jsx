import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { jwtDecode } from "jwt-decode"
import { Button } from '../../Components/Contianer'
import { BookOpen, Edit, Trash2, Loader2, Eye, Users, Heart, CheckCircle, BarChart, Filter, RefreshCw, ChevronDown } from 'lucide-react'

const ProfessorCourses = () => {
    const navigate = useNavigate()
    const token = localStorage.getItem('token')
    const [courses, setCourses] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [courseStats, setCourseStats] = useState({})
    const [completionStats, setCompletionStats] = useState({})
    const [stats, setStats] = useState({
        total: 0,
        published: 0,
        draft: 0
    })
    const [refreshing, setRefreshing] = useState(false)

    useEffect(() => {
        if (!token) {
            navigate('/login')
            return
        }

        try {
            const decoded = jwtDecode(token)
            if (decoded.role !== 'professor') {
                navigate('/')
                return
            }
            fetchProfessorCourses()
        } catch (error) {
            console.error('Token validation error:', error)
            navigate('/login')
        }
    }, [token, navigate])

    const fetchProfessorCourses = async () => {
        try {
            setLoading(true)
            const response = await axios.get('https://course-creation-backend.onrender.com/api/courses/professor-courses', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            
            const fetchedCourses = response.data.courses
            setCourses(fetchedCourses)
            
            // Calculate stats
            const published = fetchedCourses.filter(course => course.status === 'published').length
            setStats({
                total: fetchedCourses.length,
                published: published,
                draft: fetchedCourses.length - published
            })

            // Fetch enrollment and wishlist stats for each course
            const statsPromises = fetchedCourses.map(async (course) => {
                try {
                    const enrollmentResponse = await axios.get(`https://course-creation-backend.onrender.com/api/courses/${course._id}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    
                    return {
                        courseId: course._id,
                        enrolledCount: enrollmentResponse.data.course.enrolledStudents || 0,
                        wishlistCount: course.wishlistCount || 0
                    };
                } catch (error) {
                    console.error(`Error fetching stats for course ${course._id}:`, error);
                    return { courseId: course._id, enrolledCount: 0, wishlistCount: 0 };
                }
            });
            
            const courseStatsResults = await Promise.all(statsPromises);
            const statsMap = {};
            courseStatsResults.forEach(stat => {
                statsMap[stat.courseId] = stat;
            });
            
            setCourseStats(statsMap);

            // Fetch completion statistics for each course
            const completionPromises = fetchedCourses.map(async (course) => {
                try {
                    const completionResponse = await axios.get(`https://course-creation-backend.onrender.com/api/users/course-completion-stats/${course._id}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    
                    return {
                        courseId: course._id,
                        stats: completionResponse.data.stats || {
                            enrollmentCount: 0,
                            completedCount: 0,
                            inProgressCount: 0,
                            notStartedCount: 0,
                            completionRate: 0
                        }
                    };
                } catch (error) {
                    console.error(`Error fetching completion stats for course ${course._id}:`, error);
                    return { 
                        courseId: course._id, 
                        stats: {
                            enrollmentCount: 0,
                            completedCount: 0,
                            inProgressCount: 0,
                            notStartedCount: 0,
                            completionRate: 0
                        } 
                    };
                }
            });
            
            const completionResults = await Promise.all(completionPromises);
            const completionMap = {};
            completionResults.forEach(stat => {
                completionMap[stat.courseId] = stat.stats;
            });
            
            setCompletionStats(completionMap);
        } catch (error) {
            console.error("Error fetching courses:", error)
            setError("Failed to fetch courses. " + (error.response?.data?.message || error.message))
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

    const handleRefresh = () => {
        setRefreshing(true)
        fetchProfessorCourses()
    }

    const handleDelete = async (courseId) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            try {
                setLoading(true)
                await axios.delete(`https://course-creation-backend.onrender.com/api/courses/${courseId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                fetchProfessorCourses() // Refresh the list
            } catch (error) {
                setError("Failed to delete course: " + (error.response?.data?.message || error.message))
                setLoading(false)
            }
        }
    }

    if (loading && courses.length === 0) return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <span className="text-xl font-medium text-gray-700">Loading your courses...</span>
            <p className="text-gray-500 mt-2">Please wait while we fetch your course data</p>
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">My Courses</h1>
                        <p className="text-gray-600 mt-1">Manage your educational content and track student progress</p>
                    </div>
                    <div className="flex space-x-3 mt-4 md:mt-0">
                       
                        <Button 
                            onClick={() => navigate('/CourseCreation')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md shadow-sm transition-all flex items-center"
                        >
                            <BookOpen className="mr-2 h-5 w-5" />
                            Create New Course
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-medium text-gray-700">Total Courses</h3>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
                            </div>
                            <div className="p-3 bg-blue-50 rounded-lg">
                                <BookOpen className="h-6 w-6 text-blue-500" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition-shadow">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-medium text-gray-700">Published</h3>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.published}</p>
                            </div>
                            <div className="p-3 bg-green-50 rounded-lg">
                                <CheckCircle className="h-6 w-6 text-green-500" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500 hover:shadow-lg transition-shadow">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-medium text-gray-700">Drafts</h3>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.draft}</p>
                            </div>
                            <div className="p-3 bg-yellow-50 rounded-lg">
                                <Edit className="h-6 w-6 text-yellow-500" />
                            </div>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center mb-6 border border-red-200 shadow-sm animate-fadeIn">
                        <p className="font-medium">{error}</p>
                    </div>
                )}

                {courses.length === 0 ? (
                    <div className="bg-white shadow-md rounded-xl p-10 text-center">
                        <div className="w-20 h-20 mx-auto bg-blue-50 rounded-full flex items-center justify-center mb-4">
                            <BookOpen className="h-10 w-10 text-blue-500" />
                        </div>
                        <h3 className="text-xl font-medium text-gray-800 mb-2">No courses yet</h3>
                        <p className="text-gray-500 mb-6 max-w-md mx-auto">Start creating your first course to share your knowledge with students around the world</p>
                        <Button 
                            onClick={() => navigate('/CourseCreation')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md shadow-sm transition-all"
                        >
                            Create Your First Course
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Table Controls */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
                            <div className="text-sm text-gray-500">
                                Showing <span className="font-medium text-gray-700">{courses.length}</span> courses
                            </div>
                           
                        </div>

                        {/* Course Table */}
                        <div className="bg-white shadow-md rounded-xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Engagement</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completion</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {courses.map((course) => (
                                            <tr key={course._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200">
                                                            <img className="h-12 w-12 object-cover" src={course.thumbnail} alt={course.title} />
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">{course.title}</div>
                                                            <div className="text-sm text-gray-500 truncate max-w-xs">{course.description?.substring(0, 60)}...</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                        {course.category}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">${course.price}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500">{course.duration} hours</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        course.status === 'published' 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                        {course.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex flex-col space-y-1">
                                                        <div className="flex items-center text-sm text-gray-500">
                                                            <Users size={16} className="mr-1.5 text-blue-500" />
                                                            <span className="font-medium">{courseStats[course._id]?.enrolledCount || 0}</span>
                                                            <span className="ml-1 text-xs text-gray-400">enrolled</span>
                                                        </div>
                                                        <div className="flex items-center text-sm text-gray-500">
                                                            <Heart size={16} className="mr-1.5 text-red-500" />
                                                            <span className="font-medium">{courseStats[course._id]?.wishlistCount || 0}</span>
                                                            <span className="ml-1 text-xs text-gray-400">wishlisted</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex flex-col">
                                                        <div className="flex items-center text-sm text-gray-500 mb-1.5">
                                                            <CheckCircle size={16} className="mr-1.5 text-green-500" />
                                                            <span className="font-medium">{completionStats[course._id]?.completedCount || 0}</span>
                                                            <span className="mx-1 text-gray-400">/</span>
                                                            <span>{completionStats[course._id]?.enrollmentCount || 0}</span>
                                                            <span className="ml-1 text-xs text-gray-400">completed</span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                                            <div 
                                                                className="bg-green-500 h-2 rounded-full" 
                                                                style={{ width: `${completionStats[course._id]?.completionRate || 0}%` }}
                                                            ></div>
                                                        </div>
                                                        <div className="text-xs text-gray-500 mt-1.5">
                                                            <span className="font-medium">{completionStats[course._id]?.completionRate || 0}%</span> completion rate
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex space-x-1">
                                                        <button
                                                            onClick={() => navigate(`/update-course/${course._id}`)}
                                                            className="text-indigo-600 hover:text-indigo-900 p-1.5 rounded-full hover:bg-indigo-50 transition-colors"
                                                            title="Edit course"
                                                        >
                                                            <Edit size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => navigate(`/course/${course._id}`)}
                                                            className="text-blue-600 hover:text-blue-900 p-1.5 rounded-full hover:bg-blue-50 transition-colors"
                                                            title="Preview course"
                                                        >
                                                            <Eye size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => navigate(`/course-analytics/${course._id}`)}
                                                            className="text-purple-600 hover:text-purple-900 p-1.5 rounded-full hover:bg-purple-50 transition-colors"
                                                            title="View analytics"
                                                        >
                                                            <BarChart size={18} />
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                handleDelete(course._id);
                                                            }}
                                                            className="text-red-600 hover:text-red-900 p-1.5 rounded-full hover:bg-red-50 transition-colors"
                                                            title="Delete course"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ProfessorCourses
