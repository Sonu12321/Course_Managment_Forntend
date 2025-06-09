import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { 
  FaUsers, 
  FaGraduationCap, 
  FaChartLine, 
  FaCalendarAlt, 
  FaBook, 
  FaMoneyBillWave,
  FaUserGraduate,
  FaChartBar,
  FaFileAlt
} from 'react-icons/fa';

const AdminMainPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [courseStats, setCourseStats] = useState(null);
  const [revenueStats, setRevenueStats] = useState(null);
  
  useEffect(() => {
    // Check if user is admin
    if (!user || user.role !== 'admin') {
      setError('Unauthorized access. Admin privileges required.');
      return;
    }
    
    fetchDashboardData();
  }, [user]);
  
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required. Please log in.');
        setLoading(false);
        return;
      }
      
      // Fetch all dashboard data in parallel
      const [dashboardResponse, userResponse, courseResponse, revenueResponse] = await Promise.all([
        axios.get('http://localhost:4569/api/admin/stats', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:4569/api/admin/users/stats', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:4569/api/admin/courses/stats', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:4569/api/admin/revenue/stats', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      
      if (dashboardResponse.data.success) {
        setDashboardStats(dashboardResponse.data.data);
      }
      
      if (userResponse.data.success) {
        setUserStats(userResponse.data.data);
      }
      
      if (courseResponse.data.success) {
        setCourseStats(courseResponse.data.data);
      }
      
      if (revenueResponse.data.success) {
        setRevenueStats(revenueResponse.data.data);
      }
      
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const navigateTo = (path) => {
    navigate(path);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error! </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Admin Control Panel</h1>
          <p className="text-sm text-gray-500">Welcome back, {user?.firstname || 'Admin'}. Here's your system overview.</p>
        </div>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>
      
      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div 
          onClick={() => navigateTo('/admin/users')} 
          className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition-all duration-300 cursor-pointer"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <FaUsers size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 uppercase">Total Users</p>
              <p className="text-2xl font-bold">{dashboardStats?.totalUsers || 0}</p>
              <p className="text-xs text-green-500">+{dashboardStats?.recentUsers || 0} this week</p>
            </div>
          </div>
        </div>
        
        <div 
          onClick={() => navigateTo('/admin/courses')} 
          className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition-all duration-300 cursor-pointer"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <FaGraduationCap size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 uppercase">Total Courses</p>
              <p className="text-2xl font-bold">{dashboardStats?.totalCourses || 0}</p>
              <p className="text-xs text-green-500">{dashboardStats?.publishedCourses || 0} published</p>
            </div>
          </div>
        </div>
        
        <div 
          onClick={() => navigateTo('/admin/financial')} 
          className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500 hover:shadow-lg transition-all duration-300 cursor-pointer"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
              <FaMoneyBillWave size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 uppercase">Total Revenue</p>
              <p className="text-2xl font-bold">${dashboardStats?.totalRevenue?.toFixed(2) || '0.00'}</p>
              <p className="text-xs text-purple-500">From {dashboardStats?.totalCourses || 0} courses</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500 hover:shadow-lg transition-all duration-300 cursor-pointer">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
              <FaFileAlt size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 uppercase">Certificates</p>
              <p className="text-2xl font-bold">{dashboardStats?.totalCertificates || 0}</p>
              <p className="text-xs text-yellow-500">Issued to students</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* User and Course Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Statistics */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-700">User Statistics</h3>
            <div className="p-2 rounded-full bg-blue-50 text-blue-600">
              <FaChartBar size={20} />
            </div>
          </div>
          
          {userStats ? (
            <div className="space-y-6">
              {/* User Roles Distribution */}
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-2">User Roles Distribution</h4>
                <div className="grid grid-cols-3 gap-4">
                  {userStats.usersByRole.map((role) => (
                    <div key={role._id} className="bg-gray-50 p-3 rounded-lg text-center">
                      <p className="text-xs text-gray-500 uppercase">{role._id || 'Unknown'}</p>
                      <p className="text-xl font-bold">{role.count}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Verification Status */}
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-2">Verification Status</h4>
                <div className="flex items-center">
                  <div className="flex-1 mr-4">
                    <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500" 
                        style={{ width: `${(userStats.verifiedUsers / (userStats.verifiedUsers + userStats.unverifiedUsers)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-sm">
                    <span className="text-green-500 font-medium">{userStats.verifiedUsers}</span>
                    <span className="text-gray-400"> / </span>
                    <span className="text-red-500 font-medium">{userStats.unverifiedUsers}</span>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Verified</span>
                  <span>Unverified</span>
                </div>
              </div>
              
              {/* Registration Trends */}
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-2">Monthly Registrations (This Year)</h4>
                <div className="h-32 flex items-end justify-around">
                  {userStats.registrationTrends.map((month) => {
                    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    const maxCount = Math.max(...userStats.registrationTrends.map(m => m.count));
                    const height = (month.count / maxCount) * 100;
                    
                    return (
                      <div key={month._id} className="flex flex-col items-center">
                        <div 
                          className="w-8 bg-blue-500 rounded-t-md" 
                          style={{ height: `${height}%` }}
                        ></div>
                        <p className="text-xs text-gray-500 mt-1">{monthNames[month._id - 1]}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No user statistics available</p>
          )}
          
          <button 
            onClick={() => navigateTo('/admin/users')} 
            className="mt-6 w-full py-2 bg-blue-50 text-blue-600 rounded-md text-sm font-medium hover:bg-blue-100 transition-colors duration-200"
          >
            View User Management
          </button>
        </div>
        
        {/* Course Statistics */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-700">Course Statistics</h3>
            <div className="p-2 rounded-full bg-green-50 text-green-600">
              <FaBook size={20} />
            </div>
          </div>
          
          {courseStats ? (
            <div className="space-y-6">
              {/* Course Status Distribution */}
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-2">Course Status</h4>
                <div className="grid grid-cols-3 gap-4">
                  {courseStats.coursesByStatus.map((status) => (
                    <div key={status._id} className="bg-gray-50 p-3 rounded-lg text-center">
                      <p className="text-xs text-gray-500 uppercase">{status._id || 'Unknown'}</p>
                      <p className="text-xl font-bold">{status.count}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Top Categories */}
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-2">Top Categories</h4>
                <div className="space-y-2">
                  {courseStats.coursesByCategory.slice(0, 3).map((category, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">{category._id || 'Uncategorized'}</span>
                          <span className="text-sm text-gray-500">{category.count} courses</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-500" 
                            style={{ width: `${(category.count / courseStats.coursesByCategory[0].count) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Top Rated Courses */}
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-2">Top Rated Courses</h4>
                <div className="space-y-2">
                  {courseStats.topRatedCourses.slice(0, 3).map((course, index) => (
                    <div key={course._id} className="flex items-center p-2 hover:bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center mr-3">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{course.title}</p>
                        <div className="flex items-center">
                          <div className="text-yellow-400 text-xs mr-1">
                            {'★'.repeat(Math.floor(course.rating))}
                            {course.rating % 1 >= 0.5 ? '½' : ''}
                          </div>
                          <span className="text-xs text-gray-500">({course.rating.toFixed(1)})</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No course statistics available</p>
          )}
          
          <button 
            onClick={() => navigateTo('/admin/courses')} 
            className="mt-6 w-full py-2 bg-green-50 text-green-600 rounded-md text-sm font-medium hover:bg-green-100 transition-colors duration-200"
          >
            View Course Management
          </button>
        </div>
      </div>
      
      {/* Revenue Overview */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-700">Revenue Overview</h3>
          <div className="p-2 rounded-full bg-purple-50 text-purple-600">
            <FaMoneyBillWave size={20} />
          </div>
        </div>
        
        {revenueStats ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Revenue */}
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-4">Monthly Revenue (This Year)</h4>
              <div className="h-48 flex items-end justify-around">
                {revenueStats.monthlyRevenue.map((month) => {
                  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                  const maxRevenue = Math.max(...revenueStats.monthlyRevenue.map(m => m.total));
                  const height = (month.total / maxRevenue) * 100;
                  
                  return (
                    <div key={month._id} className="flex flex-col items-center">
                      <div 
                        className="w-8 bg-purple-500 rounded-t-md" 
                        style={{ height: `${height}%` }}
                      ></div>
                      <p className="text-xs text-gray-500 mt-1">{monthNames[month._id - 1]}</p>
                      <p className="text-xs font-medium">${month.total.toFixed(0)}</p>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Revenue Distribution */}
            <div className="space-y-6">
              {/* By Payment Type */}
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-2">Revenue by Payment Method</h4>
                <div className="space-y-3">
                  {revenueStats.revenueByPaymentType.map((payment) => {
                    const totalRevenue = revenueStats.revenueByPaymentType.reduce((sum, item) => sum + item.total, 0);
                    const percentage = (payment.total / totalRevenue) * 100;
                    
                    return (
                      <div key={payment._id} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{payment._id || 'Unknown'}</span>
                          <span>${payment.total.toFixed(2)} ({percentage.toFixed(1)}%)</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-purple-500" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* By Category */}
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-2">Top Revenue Categories</h4>
                <div className="space-y-3">
                  {revenueStats.revenueByCourseCategory.slice(0, 3).map((category) => {
                    const totalRevenue = revenueStats.revenueByCourseCategory.reduce((sum, item) => sum + item.total, 0);
                    const percentage = (category.total / totalRevenue) * 100;
                    
                    return (
                      <div key={category._id} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{category._id || 'Uncategorized'}</span>
                          <span>${category.total.toFixed(2)} ({percentage.toFixed(1)}%)</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-purple-500" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No revenue statistics available</p>
        )}
        
        <button 
          onClick={() => navigateTo('/admin/financial')} 
          className="mt-6 w-full py-2 bg-purple-50 text-purple-600 rounded-md text-sm font-medium hover:bg-purple-100 transition-colors duration-200"
        >
          View Financial Reports
        </button>
      </div>
    </div>
  );
};

export default AdminMainPage;