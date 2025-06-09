// import React, { useState, useEffect, lazy, Suspense } from 'react';
// import { useSelector } from 'react-redux';
// import { useLocation } from 'react-router-dom';
// import { 
//   FaUsers, 
//   FaGraduationCap, 
//   FaChartLine, 
//   FaCalendarAlt, 
//   FaBook, 
//   FaMoneyBillWave,
//   FaUserGraduate
// } from 'react-icons/fa';

// // Lazy loaded components
// const UserManagement = lazy(() => import('./UserManagement'));
// const CourseManagement = lazy(() => import('./CourseManagement'));

// const AdminDashboard = () => {
//   const location = useLocation();
//   const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'overview');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [stats, setStats] = useState({
//     totalUsers: 0,
//     totalCourses: 0,
//     activeUsers: 0,
//     pendingApprovals: 0,
//     totalRevenue: 0,
//     newUsersThisMonth: 0,
//     completionRate: 0,
//     averageRating: 0
//   });
  
//   const { user } = useSelector(state => state.auth);
  
//   // Update activeTab when location state changes
//   useEffect(() => {
//     if (location.state?.activeTab) {
//       setActiveTab(location.state.activeTab);
//     }
//   }, [location.state]);
  
//   useEffect(() => {
//     // Check if user is admin
//     if (!user || user.role !== 'admin') {
//       setError('Unauthorized access. Admin privileges required.');
//       return;
//     }
    
//     // Fetch dashboard stats
//     const fetchStats = async () => {
//       setLoading(true);
//       try {
//         // In a real application, this would be an API call
//         // For now using mock data with a simulated delay
//         setTimeout(() => {
//           setStats({
//             totalUsers: 156,
//             totalCourses: 42,
//             activeUsers: 89,
//             pendingApprovals: 12,
//             totalRevenue: 24850,
//             newUsersThisMonth: 28,
//             completionRate: 76,
//             averageRating: 4.7
//           });
//           setLoading(false);
//         }, 1000);
//       } catch (err) {
//         setError('Failed to load dashboard data');
//         setLoading(false);
//       }
//     };
    
//     fetchStats();
//   }, [user]);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
//         <strong className="font-bold">Error! </strong>
//         <span className="block sm:inline">{error}</span>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="flex justify-between items-center mb-8">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-800">
//             {activeTab === 'overview' && 'Dashboard Overview'}
//             {activeTab === 'users' && 'User Management'}
//             {activeTab === 'courses' && 'Course Management'}
//           </h1>
//           <p className="text-sm text-gray-500">Welcome back, {user?.firstname || 'Admin'}. Here's what's happening today.</p>
//         </div>
//         <div className="text-sm text-gray-500">
//           Last updated: {new Date().toLocaleString()}
//         </div>
//       </div>
      
//       {activeTab === 'overview' && (
//         <>
//           {/* Main Stats Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//             <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow duration-300">
//               <div className="flex items-center">
//                 <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
//                   <FaUsers size={24} />
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500 uppercase">Total Users</p>
//                   <p className="text-2xl font-bold">{stats.totalUsers}</p>
//                   <p className="text-xs text-green-500">+{stats.newUsersThisMonth} this month</p>
//                 </div>
//               </div>
//             </div>
            
//             <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition-shadow duration-300">
//               <div className="flex items-center">
//                 <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
//                   <FaGraduationCap size={24} />
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500 uppercase">Total Courses</p>
//                   <p className="text-2xl font-bold">{stats.totalCourses}</p>
//                   <p className="text-xs text-green-500">{stats.completionRate}% completion rate</p>
//                 </div>
//               </div>
//             </div>
            
//             <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500 hover:shadow-lg transition-shadow duration-300">
//               <div className="flex items-center">
//                 <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
//                   <FaChartLine size={24} />
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500 uppercase">Active Users</p>
//                   <p className="text-2xl font-bold">{stats.activeUsers}</p>
//                   <p className="text-xs text-purple-500">{Math.round((stats.activeUsers/stats.totalUsers)*100)}% of total users</p>
//                 </div>
//               </div>
//             </div>
            
//             <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500 hover:shadow-lg transition-shadow duration-300">
//               <div className="flex items-center">
//                 <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
//                   <FaCalendarAlt size={24} />
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500 uppercase">Pending Approvals</p>
//                   <p className="text-2xl font-bold">{stats.pendingApprovals}</p>
//                   <p className="text-xs text-yellow-500">Requires attention</p>
//                 </div>
//               </div>
//             </div>
//           </div>
          
//           {/* Additional Stats */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//             {/* Revenue Card */}
//             <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-lg font-semibold text-gray-700">Revenue Overview</h3>
//                 <div className="p-2 rounded-full bg-blue-50 text-blue-600">
//                   <FaMoneyBillWave size={20} />
//                 </div>
//               </div>
//               <div className="flex items-center mb-4">
//                 <div className="text-3xl font-bold text-gray-800">${stats.totalRevenue.toLocaleString()}</div>
//                 <div className="ml-4 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">+12% from last month</div>
//               </div>
//               <div className="h-32 bg-gray-100 rounded-lg mb-4 flex items-end justify-around px-2">
//                 {/* Simulated chart bars */}
//                 <div className="w-8 bg-blue-400 rounded-t-md" style={{height: '40%'}}></div>
//                 <div className="w-8 bg-blue-500 rounded-t-md" style={{height: '65%'}}></div>
//                 <div className="w-8 bg-blue-600 rounded-t-md" style={{height: '45%'}}></div>
//                 <div className="w-8 bg-blue-700 rounded-t-md" style={{height: '80%'}}></div>
//                 <div className="w-8 bg-blue-800 rounded-t-md" style={{height: '60%'}}></div>
//                 <div className="w-8 bg-blue-900 rounded-t-md" style={{height: '75%'}}></div>
//               </div>
//               <div className="flex justify-between text-xs text-gray-500">
//                 <span>Jan</span>
//                 <span>Feb</span>
//                 <span>Mar</span>
//                 <span>Apr</span>
//                 <span>May</span>
//                 <span>Jun</span>
//               </div>
//             </div>
            
//             {/* Course Stats Card */}
//             <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-lg font-semibold text-gray-700">Course Performance</h3>
//                 <div className="p-2 rounded-full bg-green-50 text-green-600">
//                   <FaBook size={20} />
//                 </div>
//               </div>
//               <div className="grid grid-cols-2 gap-4 mb-4">
//                 <div className="bg-gray-50 p-4 rounded-lg">
//                   <div className="text-sm text-gray-500 mb-1">Average Rating</div>
//                   <div className="flex items-center">
//                     <div className="text-2xl font-bold text-gray-800 mr-2">{stats.averageRating}</div>
//                     <div className="flex text-yellow-400">
//                       {'★'.repeat(Math.floor(stats.averageRating))}
//                       {stats.averageRating % 1 >= 0.5 ? '½' : ''}
//                     </div>
//                   </div>
//                 </div>
//                 <div className="bg-gray-50 p-4 rounded-lg">
//                   <div className="text-sm text-gray-500 mb-1">Completion Rate</div>
//                   <div className="flex items-end">
//                     <div className="text-2xl font-bold text-gray-800 mr-2">{stats.completionRate}%</div>
//                     <div className="text-xs text-green-500">+5% from last month</div>
//                   </div>
//                 </div>
//                 <div className="bg-gray-50 p-4 rounded-lg">
//                   <div className="text-sm text-gray-500 mb-1">Most Popular</div>
//                   <div className="text-base font-medium text-gray-800">Web Development</div>
//                 </div>
//                 <div className="bg-gray-50 p-4 rounded-lg">
//                   <div className="text-sm text-gray-500 mb-1">Least Popular</div>
//                   <div className="text-base font-medium text-gray-800">Data Science</div>
//                 </div>
//               </div>
//               <button className="w-full py-2 bg-green-50 text-green-600 rounded-md text-sm font-medium hover:bg-green-100 transition-colors duration-200">
//                 View Detailed Report
//               </button>
//             </div>
//           </div>
          
//           {/* Recent Activities */}
//           <div className="bg-white rounded-lg shadow-md p-6 mb-8">
//             <div className="flex justify-between items-center mb-6">
//               <h3 className="text-lg font-semibold text-gray-700">Recent Activities</h3>
//               <button className="text-sm text-blue-600 hover:underline">View All</button>
//             </div>
//             <div className="space-y-4">
//               {[
//                 { user: 'John Doe', action: 'enrolled in', target: 'Advanced React Course', time: '2 hours ago', icon: 'user' },
//                 { user: 'Sarah Smith', action: 'completed', target: 'JavaScript Fundamentals', time: '5 hours ago', icon: 'graduate' },
//                 { user: 'Admin', action: 'added new course', target: 'Python for Data Science', time: 'Yesterday', icon: 'book' },
//                 { user: 'Michael Brown', action: 'requested', target: 'course approval', time: '2 days ago', icon: 'calendar' },
//               ].map((activity, index) => (
//                 <div key={index} className="flex items-start">
//                   <div className={`p-2 rounded-full mr-3 ${
//                     activity.icon === 'user' ? 'bg-blue-100 text-blue-600' :
//                     activity.icon === 'graduate' ? 'bg-green-100 text-green-600' :
//                     activity.icon === 'book' ? 'bg-purple-100 text-purple-600' :
//                     'bg-yellow-100 text-yellow-600'
//                   }`}>
//                     {activity.icon === 'user' && <FaUsers size={16} />}
//                     {activity.icon === 'graduate' && <FaUserGraduate size={16} />}
//                     {activity.icon === 'book' && <FaBook size={16} />}
//                     {activity.icon === 'calendar' && <FaCalendarAlt size={16} />}
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-800">
//                       <span className="font-medium">{activity.user}</span> {activity.action} <span className="font-medium">{activity.target}</span>
//                     </p>
//                     <p className="text-xs text-gray-500">{activity.time}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </>
//       )}
      
//       {/* Content for other tabs with Suspense for lazy loading */}
//       <Suspense fallback={
//         <div className="flex justify-center items-center h-64">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
//         </div>
//       }>
//         {activeTab === 'users' && <UserManagement />}
//         {activeTab === 'courses' && <CourseManagement />}
//       </Suspense>
//     </>
//   );
// };

// export default AdminDashboard;