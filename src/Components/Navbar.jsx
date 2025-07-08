import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Menu, X } from 'lucide-react';
import { FaHeart, FaUserCircle } from 'react-icons/fa';
import { ToastContainer } from 'react-toastify';
import { getUserProfile, getStudentProfile, logout } from '../store/authSlice';

// Mock Button Component with improved accessibility
const Button = ({ children, onClick, bgColor = 'bg-blue-500 hover:bg-blue-600', textColor = 'text-white', className, ariaLabel }) => (
  <button
    onClick={onClick}
    className={`${bgColor} ${textColor} ${className} rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50`}
    aria-label={ariaLabel}
  >
    {children}
  </button>
);

const LogoutBtn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <Button
      onClick={() => {
        dispatch(logout());
        navigate('/login');
      }}
      bgColor="group flex items-center justify-start w-11 h-11 bg-red-600 rounded-full cursor-pointer relative overflow-hidden transition-all duration-200 shadow-lg hover:w-32 hover:rounded-lg active:translate-x-1 active:translate-y-1"
    
      className="px-4 py-2"
      ariaLabel="Logout"
    >
       <div
        className="flex items-center justify-center w-full transition-all duration-300 group-hover:justify-start group-hover:px-3"
      >
        <svg className="w-4 h-4" viewBox="0 0 512 512" fill="white">
          <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" />
        </svg>
      </div>
      <div
        className="absolute right-5 transform translate-x-full opacity-0 text-white text-lg font-semibold transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
      >
        Logout
      </div>
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
        { label: 'About Us', href: '/AboutUs' },
        { label: 'Teach With Us', href: '/RegisterProfessor' },
      ],
    };
    return routes[role] || routes.user;
  };

  const renderAuthButtons = () => {
    if (isAuthenticated) {
      return (
        <div className="flex items-center space-x-4" role="navigation" aria-label="User actions">
          {role === 'user' && (
            <button
              onClick={() => navigate('/wishlist')}
              className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-50 transition-all relative group"
              title="Wishlist"
              aria-label="View Wishlist"
            >
              <FaHeart size={20} className="group-hover:scale-110 transition-transform" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center" aria-label="Wishlist count">
                0
              </span>
            </button>
          )}
          <button
            onClick={navigateToProfile}
            className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-50 transition-all group"
            title="Profile"
            aria-label="View Profile"
          >
            <FaUserCircle size={22} className="group-hover:scale-110 transition-transform" />
          </button>
          <LogoutBtn />
        </div>
      );
    }
    return (
      <div className="flex items-center space-x-3 " role="navigation" aria-label="Authentication">
        <button
        onClick={() => navigate('/login')}
        aria-label="Sign In"
        className="relative inline-block p-px font-semibold leading-6 text-white bg-blue-300 shadow-2xl cursor-pointer rounded-xl shadow-blue-200 transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95"
      >
        <span
          className="absolute inset-0 rounded-xl bg-gradient-to-r from-teal-400 via-blue-500 to-purple-500 p-[2px] opacity-0 transition-opacity duration-500 hover:opacity-100"
        ></span>

        <span className="relative z-10 block px-6 py-3 rounded-xl bg-blue-500">
          Sign In
        </span>
      </button>

      {/* Sign Up button */}
      <button
        onClick={() => navigate('/register')}
        aria-label="Sign Up"
        className="relative inline-block p-px font-semibold leading-6 text-white bg-blue-300 shadow-2xl cursor-pointer rounded-xl shadow-blue-200 transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95"
      >
        <span
          className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-[2px] opacity-0 transition-opacity duration-500 hover:opacity-100"
        ></span>

        <span className="relative z-10 block px-6 py-3 rounded-xl bg-blue-500">
          Sign Up
        </span>
      </button>
      </div>
    );
  };

  return (
    <header className="  bg-slate-400 w-full border-black" role="banner">
      <nav
        className={`flex justify-between items-center min-h-[4.5rem] w-full px-6 my-1  ${
          isScrolled
            ? 'bg-white shadow-lg'
            : 'bg-white'
        } transition-all duration-300`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex items-center flex-shrink-0">
          <a
            href="/"
            className="text-2xl font-bold tracking-tight text-blue-600 hover:text-blue-700 transition-all duration-200"
            onClick={(e) => {
              e.preventDefault();
              navigate('/');
            }}
            aria-label="HoopGear - Go to Homepage"
          >

            HopeGear
          </a>
        </div>

        <ul className="hidden lg:flex 10 space-x-4" role="menubar">
          {getNavItems().map((item, index) => (
            <li key={index} role="none">
              <Button
                onClick={() => navigate(item.href)}
                bgColor="text-gray-700 hover:text-blue-600 hover:bg-blue-200 block px-4 py-3 text-base font-medium transition-all duration-200 rounded-lg font-semibold"
                textColor="text-black hover:text-blue-600 text-xl "
                className="px-4 py-2"
                ariaLabel={item.label}
                role="menuitem"
              >
                {item.label}
              </Button>
            </li>
          ))}
        </ul>

        <div className="hidden lg:flex items-center ml-6">{renderAuthButtons()}</div>

        <Button
          onClick={toggleNavbar}
          className="lg:hidden p-2 hover:bg-blue-50 rounded-full transition-all"
          bgColor="bg-transparent"
          ariaLabel={mobileDrawerOpen ? 'Close Menu' : 'Open Menu'}
        >
          {mobileDrawerOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </nav>

      {mobileDrawerOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 backdrop-blur-sm lg:hidden"
          aria-modal="true"
          role="dialog"
        >
          <div 
            className="fixed right-0 top-0 h-full z-30 bg-white w-4/5 max-w-sm p-6 shadow-2xl flex flex-col overflow-y-auto"
            role="menu"
          >
            <div className="flex justify-end mb-6">
              <button
                onClick={toggleNavbar}
                className="p-2 rounded-full hover:bg-gray-100 transition-all"
                aria-label="Close Menu"
              >
                <X size={24} />
              </button>
            </div>

            <ul className="space-y-4" role="menu">
              {getNavItems().map((item, index) => (
                <li key={index} role="none" className="py-2">
                  <Button
                    onClick={() => {
                      navigate(item.href);
                      setMobileDrawerOpen(false);
                    }}
                    bgColor="bg-blue-500 hover:bg-blue-600"
                    textColor="text-white"
                    className="w-full px-4 py-3 text-center"
                    ariaLabel={item.label}
                    role="menuitem"
                  >
                    {item.label}
                  </Button>
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-8 border-t border-gray-200">
              <div className="flex flex-col space-y-4 w-full items-center">{renderAuthButtons()}</div>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </header>
  );
};

export default Navbar;