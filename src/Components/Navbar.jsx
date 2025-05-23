import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Menu, X } from 'lucide-react';
import { FaHeart, FaUserCircle } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import { getUserProfile, getStudentProfile, logout } from '../store/authSlice';
// Import the actual Search component
import Search from './Contianer/Search';

// Mock authSlice (replace with your actual authSlice)
const authSlice = {
  getUserProfile: () => ({ type: 'GET_USER_PROFILE' }),
  getStudentProfile: () => ({ type: 'GET_STUDENT_PROFILE' }),
};

// Mock Button Component
const Button = ({ children, onClick, bgColor = 'bg-blue-500 hover:bg-blue-600', textColor = 'text-white', className }) => (
  <button
    onClick={onClick}
    className={`${bgColor} ${textColor} ${className} rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50`}
  >
    {children}
  </button>
);

// Updated LogoutBtn Component to use Redux logout action
const LogoutBtn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <Button
      onClick={() => {
        // Dispatch the logout action from Redux
        dispatch(logout());
        // Navigate to login page
        navigate('/login');
        // Removed window.location.reload() to prevent Vercel error
      }}
      bgColor="bg-red-500 hover:bg-red-600"
      className="px-4 py-2"
    >
      Logout
    </Button>
  );
};

const Navbar = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getUserRole = () => {
    if (!user) return 'user';
    if (user.role) return user.role;
    if (user.courses || user.isProfessor) return 'professor';
    return 'user';
  };

  const role = getUserRole();

  useEffect(() => {
    if (isAuthenticated && token) {
      if (role === 'professor') {
        dispatch(getUserProfile());
      } else {
        dispatch(getStudentProfile());
      }
    }

    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isAuthenticated, token, role, dispatch]);

  const toggleNavbar = () => setMobileDrawerOpen(!mobileDrawerOpen);

  const navigateToProfile = () => {
    const profileRoutes = {
      professor: '/Professorprofile',
      user: '/Studentprofile',
    };
    const route = profileRoutes[role] || profileRoutes.user;
    navigate(route);
  };

  const getNavItems = () => {
    const routes = {
      professor: [
        { label: 'Dashboard', href: '/ProfessorDashboard' },
        { label: 'Create Course', href: '/CourseCreation' },
        { label: 'My Courses', href: '/professorcourses' },
      ],
      user: [
        { label: 'Courses', href: '/Cards' },
        { label: 'Teach With Us', href: '/RegisterProfessor' },
      ],
    };
    return routes[role] || routes.user;
  };

  const renderAuthButtons = () => {
    if (isAuthenticated) {
      return (
        <div className="flex items-center space-x-4">
          {role === 'user' && (
            <button
              onClick={() => navigate('/wishlist')}
              className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-100 transition-all relative group"
              title="Wishlist"
              aria-label="View Wishlist"
            >
              <FaHeart size={20} className="group-hover:scale-110 transition-transform" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </button>
          )}
          <button
            onClick={navigateToProfile}
            className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-100 transition-all group"
            title="Profile"
            aria-label="View Profile"
          >
            <FaUserCircle size={22} className="group-hover:scale-110 transition-transform" />
          </button>
          <LogoutBtn />
        </div>
      );
    } else {
      return (
        <div className="flex items-center space-x-3">
          <Button
            onClick={() => navigate('/login')}
            bgColor="bg-transparent hover:bg-blue-500"
            textColor="text-gray-800 hover:text-white dark:text-gray-200"
            className="border border-blue-300 hover:border-blue-500 px-4 py-2"
          >
            Sign In
          </Button>
          <Button
            onClick={() => navigate('/register')}
            bgColor="bg-blue-500 hover:bg-blue-600"
            textColor="text-white"
            className="px-4 py-2"
          >
            Sign Up
          </Button>
        </div>
      );
    }
  };

  return (
    <div className="sticky top-0 z-50 py-3 px-4 w-full">
      <div
        className={`flex justify-between items-center min-h-[4.5rem] w-full px-6 rounded-xl border border-transparent ${
          isScrolled
            ? 'bg-white dark:bg-gray-700 shadow-lg'
            : 'bg-gray-100/40 dark:bg-gray-800/40 backdrop-blur-md'
        } transition-all duration-300`}
      >
        <div className="flex items-center flex-shrink-0">
          <span
            className="text-2xl font-bold tracking-tight text-blue-600 hover:text-blue-700 cursor-pointer transition-all duration-200"
            onClick={() => navigate('/')}
            role="button"
            aria-label="Go to Homepage"
          >
            HoopGear
          </span>
        </div>
        <div className="flex-grow mx-4 max-w-md hidden sm:block">
          <Search className={`search-input ${isScrolled ? 'bg-white' : 'bg-slate-300'}`} />
        </div>
        <ul className="hidden lg:flex ml-10 space-x-4">
          {getNavItems().map((item, index) => (
            <li key={index}>
              <Button
                onClick={() => navigate(item.href)}
                bgColor="bg-blue-500 hover:bg-blue-600"
                textColor="text-white"
                className="px-4 py-2"
              >
                {item.label}
              </Button>
            </li>
          ))}
        </ul>
        <div className="hidden lg:flex items-center ml-6">{renderAuthButtons()}</div>
        <Button
          onClick={toggleNavbar}
          className="lg:hidden p-2 hover:bg-blue-100 rounded-full transition-all"
          bgColor="bg-transparent"
          aria-label={mobileDrawerOpen ? 'Close Menu' : 'Open Menu'}
        >
          {mobileDrawerOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-20 bg-black bg-opacity-50 backdrop-blur-sm lg:hidden">
          <div className="fixed right-0 top-0 h-full z-30 bg-white dark:bg-gray-900 w-4/5 max-w-sm p-6 shadow-2xl flex flex-col overflow-y-auto">
            <div className="flex justify-end mb-6">
              <button
                onClick={toggleNavbar}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-all"
                aria-label="Close Menu"
              >
                <X size={24} />
              </button>
            </div>
            <div className="w-full mb-8">
              <Search />
            </div>
            <ul className="space-y-4">
              {getNavItems().map((item, index) => (
                <li key={index} className="py-2">
                  <Button
                    onClick={() => {
                      navigate(item.href);
                      setMobileDrawerOpen(false);
                    }}
                    bgColor="bg-blue-500 hover:bg-blue-600"
                    textColor="text-white"
                    className="w-full px-4 py-3 text-center"
                  >
                    {item.label}
                  </Button>
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-8 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col space-y-4 w-full items-center">{renderAuthButtons()}</div>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default Navbar;