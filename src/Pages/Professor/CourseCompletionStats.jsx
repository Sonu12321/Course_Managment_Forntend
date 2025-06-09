import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { jwtDecode } from "jwt-decode"
import { Button } from '../../Components/Contianer'
import { Loader2, ArrowLeft, CheckCircle, Clock, AlertCircle, Search } from 'lucide-react'

const CourseCompletionStats = () => {
    const navigate = useNavigate()
    const { courseId } = useParams()
    const token = localStorage.getItem('token')
    const [courseData, setCourseData] = useState(null)
    const [completionData, setCompletionData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [searchTerm, setSearchTerm] = useState("")
    const [filteredStudents, setFilteredStudents] = useState([])

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
            fetchCourseData()
            fetchCompletionData()
        } catch (error) {
            console.error('Token validation error:', error)
            navigate('/login')
        }
    }, [token, navigate, courseId])

    useEffect(() => {
        if (completionData && completionData.students) {
            setFilteredStudents(
                completionData.students.filter(student => 
                    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    student.email.toLowerCase().includes(searchTerm.toLowerCase())
                )
            )
        }
    }, [searchTerm, completionData])

    const fetchCourseData = async () => {
        try {
            const response = await axios.get(`http://localhost:4569/api/courses/${courseId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            setCourseData(response.data.course)
        } catch (error) {
            console.error("Error fetching course data:", error)
            setError("Failed to fetch course data. " + (error.response?.data?.message || error.message))
        }
    }

    const fetchCompletionData = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`http://localhost:4569/api/users/course-completion-stats/${courseId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            setCompletionData(response.data)
            setFilteredStudents(response.data.students || [])
        } catch (error) {
            console.error("Error fetching completion data:", error)
            setError("Failed to fetch completion data. " + (error.response?.data?.message || error.message))
        } finally {
            setLoading(false)
        }
    }

    const getStatusBadgeClass = (status) => {
        switch(status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'in-progress':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    }

    const getStatusIcon = (status) => {
        switch(status) {
            case 'completed':
                return <CheckCircle size={16} className="mr-1 text-green-500" />;
            case 'in-progress':
                return <Clock size={16} className="mr-1 text-blue-500" />;
            default:
                return <AlertCircle size={16} className="mr-1 text-gray-500" />;
        }
    }

    if (loading) return (
        <div className="min-h-screen flex justify-center items-center">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            <span className="ml-2 text-lg">Loading completion statistics...</span>
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <Button 
                        onClick={() => navigate('/professor-courses')}
                        className="mb-4 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md flex items-center"
                    >
                        <ArrowLeft className="mr-2 h-5 w-5" />
                        Back to Courses
                    </Button>
                    
                    {courseData && (
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex flex-col md:flex-row items-center md:items-start">
                                <img 
                                    src={courseData.thumbnail} 
                                    alt={courseData.title} 
                                    className="w-24 h-24 rounded-lg object-cover"
                                />
                                <div className="md:ml-6 mt-4 md:mt-0 text-center md:text-left">
                                    <h1 className="text-2xl font-bold text-gray-800">{courseData.title}</h1>
                                    <p className="text-gray-600">{courseData.category} • {courseData.duration} hours</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {error && (
                    <div className="bg-red-50 text-red-500 p-4 rounded-lg text-center mb-6 border border-red-200">
                        <p className="font-medium">{error}</p>
                    </div>
                )}

                {completionData && (
                    <>
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                                <h3 className="text-lg font-medium text-gray-700">Total Enrollments</h3>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{completionData.stats.enrollmentCount}</p>
                            </div>
                            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                                <h3 className="text-lg font-medium text-gray-700">Completed</h3>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{completionData.stats.completedCount}</p>
                            </div>
                            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
                                <h3 className="text-lg font-medium text-gray-700">In Progress</h3>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{completionData.stats.inProgressCount}</p>
                            </div>
                            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
                                <h3 className="text-lg font-medium text-gray-700">Completion Rate</h3>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{completionData.stats.completionRate}%</p>
                            </div>
                        </div>

                        {/* Search Bar */}
                        <div className="mb-6">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Search by name or email"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Students List */}
                        <div className="bg-white shadow rounded-lg overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-xl font-semibold text-gray-800">Student Progress</h2>
                            </div>
                            
                            {filteredStudents.length === 0 ? (
                                <div className="p-6 text-center">
                                    <p className="text-gray-500">No students found matching your search criteria.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrolled Date</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Activity</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {filteredStudents.map((student) => (
                                                <tr key={student.userId} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="h-10 w-10 flex-shrink-0">
                                                                <img 
                                                                    className="h-10 w-10 rounded-full object-cover" 
                                                                    src={student.profileImage || 'https://via.placeholder.com/40'} 
                                                                    alt={student.name} 
                                                                />
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                                                <div className="text-sm text-gray-500">{student.email}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(student.completionStatus)}`}>
                                                            <div className="flex items-center">
                                                                {getStatusIcon(student.completionStatus)}
                                                                {student.completionStatus === 'completed' 
                                                                    ? 'Completed' 
                                                                    : student.completionStatus === 'in-progress'
                                                                        ? 'In Progress'
                                                                        : 'Not Started'}
                                                            </div>
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2 max-w-xs">
                                                                <div 
                                                                    className={`h-2.5 rounded-full ${
                                                                        student.completionStatus === 'completed' 
                                                                            ? 'bg-green-500' 
                                                                            : 'bg-blue-500'
                                                                    }`}
                                                                    style={{ width: `${student.progress}%` }}
                                                                ></div>
                                                            </div>
                                                            <span className="text-sm text-gray-500">{student.progress}%</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {new Date(student.enrolledAt).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {new Date(student.lastUpdated).toLocaleDateString()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default CourseCompletionStats