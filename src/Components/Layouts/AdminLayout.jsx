import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  FaUsers, 
  FaBook, 
  FaCog, 
  FaSignOutAlt, 
  FaChartBar, 
  FaUserGraduate,
  FaTachometerAlt,
  FaMoneyBillWave,
  FaChartLine,
  FaFileAlt,
  FaQuestionCircle,
  FaBars,
  FaTimes,
  FaSearch,
  FaBell,
  FaEnvelope,
  FaGraduationCap
} from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/authSlice';

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationsCount, setNotificationsCount] = useState(3);
  const [messagesCount, setMessagesCount] = useState(2);
  
  const { user } = useSelector(state => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // Updated sidebar items with more detailed structure
  // In the sidebarItems array, update the Main section:
  
  const sidebarItems = [
    { 
      section: 'Main',
      items: [
        { path: '/admin/main', name: 'Admin Overview', icon: <FaTachometerAlt />, tabId: 'main' },
        // { path: '/admin/dashboard', name: 'Dashboard', icon: <FaChartBar />, tabId: 'overview' },
        { path: '/admin/users', name: 'User Management', icon: <FaUsers />, tabId: 'users' },
       ]
    },
    
   
  ];

  // Handle navigation to dashboard with specific tab
  const handleNavigation = (path, tabId) => {
    if (path === '/admin/main' && tabId) {
      navigate(path, { state: { activeTab: tabId } });
    } else {
      navigate(path);
    }
  };

  // Toggle sidebar for mobile view
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile Sidebar Toggle Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-md bg-blue-600 text-white shadow-lg"
        >
          {sidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 transition-transform duration-300 fixed lg:static 
        h-full w-64 bg-blue-800 text-white shadow-xl z-40`}>
        
        {/* Logo and Brand */}
        <div className="p-6 flex items-center border-b border-blue-700">
          <div className="bg-blue-600 p-2 rounded-lg mr-3">
            <FaGraduationCap size={24} />
          </div>
          <h1 className="text-xl font-bold">EduLMS Admin</h1>
        </div>
        
        {/* Admin Profile */}
        <div className="p-4 border-b border-blue-700">
          <div className="flex items-center mb-4">
            <img 
              src={user?.profileImage || "https://via.placeholder.com/50"} 
              alt="Admin User" 
              className="rounded-full w-10 h-10 border-2 border-blue-500"
            />
            <div className="ml-3">
              <p className="font-semibold text-sm">{user?.firstname || 'Admin User'}</p>
              <p className="text-xs text-blue-300">{user?.role || 'Admin'}</p>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="mt-2 px-2 overflow-y-auto" style={{ height: 'calc(100% - 200px)' }}>
          {sidebarItems.map((section, idx) => (
            <div key={idx}>
              <p className="text-xs text-blue-400 px-4 py-2 uppercase font-semibold mt-2">{section.section}</p>
              
              {section.items.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path, item.tabId)}
                  className={`flex items-center w-full px-4 py-3 rounded-lg mb-1 text-sm ${
                    location.pathname === item.path 
                      ? 'bg-blue-900 text-white font-medium' 
                      : 'text-blue-200 hover:bg-blue-700'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </button>
              ))}
            </div>
          ))}
          
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 rounded-lg mb-1 text-sm text-red-300 hover:bg-red-900 mt-6"
          >
            <FaSignOutAlt className="mr-3" />
            Logout
          </button>
        </nav>
        
        {/* Sidebar Footer */}
        <div className="absolute bottom-0 w-full p-4 text-center text-xs text-blue-400 border-t border-blue-700">
          <p>EduLMS Admin v2.5.0</p>
          <p className="mt-1">© 2025 EduTech Inc.</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm z-30">
          <div className="flex items-center justify-between p-4">
            <div className="flex-1">
              <div className="relative max-w-md">
                <input 
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>
            
            <div className="flex items-center">
              <button className="p-2 rounded-full text-gray-600 hover:bg-gray-100 relative mr-2">
                <FaBell size={18} />
                {notificationsCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {notificationsCount}
                  </span>
                )}
              </button>
              
              <button className="p-2 rounded-full text-gray-600 hover:bg-gray-100 relative mr-4">
                <FaEnvelope size={18} />
                {messagesCount > 0 && (
                  <span className="absolute top-0 right-0 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {messagesCount}
                  </span>
                )}
              </button>
              
              <div className="border-l border-gray-300 h-8 mx-4"></div>
              
              <div className="flex items-center">
                <img 
                  src={user?.profileImage || "https://via.placeholder.com/40"} 
                  alt="Admin User" 
                  className="rounded-full w-8 h-8 border-2 border-blue-500"
                />
                <div className="ml-2 hidden md:block">
                  <p className="text-sm font-medium">{user?.firstname || 'Admin User'}</p>
                  <p className="text-xs text-gray-500">{user?.role || 'Admin'}</p>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
        
        {/* Footer */}
        <footer className="bg-white p-4 border-t border-gray-200 text-center text-sm text-gray-600">
          <p>© 2025 EduTech Inc. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;