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
      <div className="flex items-center space-x-3" role="navigation" aria-label="User actions">
        {role === 'user' && (
          <button
            onClick={() => navigate('/wishlist')}
            className={`relative p-3 rounded-xl transition-all duration-300 group transform hover:scale-110 active:scale-95 ${
              isScrolled
                ? 'text-slate-700 hover:text-red-600 hover:bg-red-50 hover:shadow-lg hover:shadow-red-100/50'
                : 'text-gray-100 hover:text-red-300 hover:bg-white/10 hover:shadow-lg hover:shadow-white/10'
            }`}
            title="Wishlist"
            aria-label="View Wishlist"
          >
            <FaHeart size={20} className="group-hover:scale-110 transition-transform duration-300 relative z-10" />
            
            {/* Wishlist count badge */}
            <span 
              className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg animate-pulse" 
              aria-label="Wishlist count"
            >
              0
            </span>
            
            {/* Hover effect background */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 opacity-0 group-hover:opacity-10 rounded-xl transition-all duration-300"></div>
            
            {/* Border animation */}
            <div className={`absolute inset-0 border-2 border-transparent group-hover:border-red-200/30 rounded-xl transition-all duration-300 ${
              !isScrolled && 'group-hover:border-white/20'
            }`}></div>
          </button>
        )}
        
        <button
          onClick={navigateToProfile}
          className={`relative p-3 rounded-xl transition-all duration-300 group transform hover:scale-110 active:scale-95 ${
            isScrolled
              ? 'text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 hover:shadow-lg hover:shadow-emerald-100/50'
              : 'text-gray-100 hover:text-emerald-300 hover:bg-white/10 hover:shadow-lg hover:shadow-white/10'
          }`}
          title="Profile"
          aria-label="View Profile"
        >
          <FaUserCircle size={22} className="group-hover:scale-110 transition-transform duration-300 relative z-10" />
          
          {/* Hover effect background */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 opacity-0 group-hover:opacity-10 rounded-xl transition-all duration-300"></div>
          
          {/* Border animation */}
          <div className={`absolute inset-0 border-2 border-transparent group-hover:border-emerald-200/30 rounded-xl transition-all duration-300 ${
            !isScrolled && 'group-hover:border-white/20'
          }`}></div>
        </button>
        
        <div className="ml-2">
          <LogoutBtn />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-3" role="navigation" aria-label="Authentication">
      {/* Sign In Button */}
      <button
        onClick={() => navigate('/login')}
        aria-label="Sign In"
        className={`relative group px-6 py-3 font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 overflow-hidden ${
          isScrolled
            ? 'text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-200/50 hover:shadow-xl hover:shadow-indigo-300/60'
            : 'text-white bg-gradient-to-r from-indigo-500/80 to-purple-500/80 hover:from-indigo-600 hover:to-purple-600 shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-400/40'
        }`}
      >
        <span className="relative z-10 flex items-center space-x-2">
          <span>Sign In</span>
        </span>
        
        {/* Animated gradient border */}
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 p-[2px]">
            <div className={`w-full h-full rounded-xl ${
              isScrolled ? 'bg-white' : 'bg-slate-800'
            }`}></div>
          </div>
        </div>
        
        {/* Shimmer effect */}
        <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer transition-all duration-700"></div>
      </button>

      {/* Sign Up Button */}
      <button
        onClick={() => navigate('/register')}
        aria-label="Sign Up"
        className={`relative group px-6 py-3 font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 overflow-hidden ${
          isScrolled
            ? 'text-white bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700 shadow-lg shadow-rose-200/50 hover:shadow-xl hover:shadow-rose-300/60'
            : 'text-white bg-gradient-to-r from-rose-500/80 to-orange-500/80 hover:from-rose-600 hover:to-orange-600 shadow-lg shadow-rose-500/30 hover:shadow-xl hover:shadow-rose-400/40'
        }`}
      >
        <span className="relative z-10 flex items-center space-x-2">
          <span>Sign Up</span>
        </span>
        
        {/* Animated gradient border */}
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-400 via-rose-500 to-orange-500 p-[2px]">
            <div className={`w-full h-full rounded-xl ${
              isScrolled ? 'bg-white' : 'bg-slate-800'
            }`}></div>
          </div>
        </div>
        
        {/* Shimmer effect */}
        <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer transition-all duration-700"></div>
      </button>
    </div>
  );
};

return (
  <>
    <nav
      className={`flex justify-between items-center min-h-[5rem] w-full px-8 backdrop-blur-md border-b border-white/10 ${
        isScrolled
          ? 'bg-white/95 shadow-xl shadow-black/5'
          : 'bg-gradient-to-r from-slate-900/95 to-slate-800/95'
      } transition-all duration-500 ease-in-out relative z-50`}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Logo Section */}
      <div className="flex items-center flex-shrink-0">
        <a
          href="/"
          className={`text-2xl font-bold tracking-tight relative group ${
            isScrolled 
              ? 'text-slate-800 hover:text-indigo-600' 
              : 'text-white hover:text-indigo-300'
          } transition-all duration-300`}
          onClick={(e) => {
            e.preventDefault();
            navigate('/');
          }}
          aria-label="HoopGear - Go to Homepage"
        >
          <span className="relative z-10">HoopGear</span>
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-10 rounded-lg transform scale-110 transition-all duration-300"></div>
          <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:w-full transition-all duration-300"></div>
        </a>
      </div>

      {/* Desktop Navigation */}
      <ul className="hidden lg:flex items-center space-x-4" role="menubar">
        {getNavItems().map((item, index) => (
          <li key={index} role="none">
            <Button
              onClick={() => navigate(item.href)}
              className={`relative px-6 py-3 text-base font-medium rounded-xl transition-all duration-300 group overflow-hidden ${
                isScrolled
                  ? 'text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 hover:shadow-lg hover:shadow-indigo-100/50'
                  : 'text-gray-100 hover:text-white hover:bg-white/10 hover:shadow-lg hover:shadow-white/10'
              } transform hover:scale-105 active:scale-95`}
              ariaLabel={item.label}
              role="menuitem"
            >
              <span className="relative z-10">{item.label}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-10 transition-all duration-300"></div>
              <div className={`absolute inset-0 border-2 border-transparent group-hover:border-indigo-200/30 rounded-xl transition-all duration-300 ${
                !isScrolled && 'group-hover:border-white/20'
              }`}></div>
            </Button>
          </li>
        ))}
      </ul>

      {/* Auth Buttons Section */}
      <div className="hidden lg:flex items-center space-x-4">
        <div className={`flex items-center space-x-3 ${
          isScrolled ? 'text-slate-600' : 'text-gray-200'
        }`}>
          {renderAuthButtons()}
        </div>
      </div>

      {/* Mobile Menu Button */}
      <Button
        onClick={toggleNavbar}
        className={`lg:hidden p-3 rounded-xl transition-all duration-300 transform hover:scale-110 active:scale-95 ${
          isScrolled
            ? 'text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 hover:shadow-lg hover:shadow-indigo-100/50'
            : 'text-gray-100 hover:bg-white/10 hover:text-white hover:shadow-lg hover:shadow-white/10'
        }`}
        bgColor="bg-transparent"
        ariaLabel={mobileDrawerOpen ? 'Close Menu' : 'Open Menu'}
      >
        <div className="relative">
          {mobileDrawerOpen ? (
            <X size={24} className="transform transition-transform duration-300 rotate-180" />
          ) : (
            <Menu size={24} className="transform transition-transform duration-300" />
          )}
        </div>
      </Button>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className={`absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-600 opacity-50 ${
          isScrolled ? 'opacity-30' : 'opacity-70'
        } transition-opacity duration-500`}></div>
      </div>
    </nav>

    {/* Enhanced Mobile Menu */}
    {mobileDrawerOpen && (
      <div 
        className="fixed inset-0 z-40 lg:hidden"
        aria-modal="true"
        role="dialog"
      >
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
          onClick={toggleNavbar}
        />
        
        {/* Mobile Menu Panel */}
        <div 
          className="fixed right-0 top-0 h-full z-50 bg-white/95 backdrop-blur-md w-4/5 max-w-sm shadow-2xl flex flex-col overflow-y-auto transform transition-transform duration-300 ease-in-out"
          role="menu"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
            <div className="text-xl font-bold text-slate-800">Menu</div>
            <button
              onClick={toggleNavbar}
              className="p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 text-slate-600 hover:text-slate-800"
              aria-label="Close Menu"
            >
              <X size={24} />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 px-6 py-4">
            <ul className="space-y-2" role="menu">
              {getNavItems().map((item, index) => (
                <li key={index} role="none">
                  <Button
                    onClick={() => {
                      navigate(item.href);
                      setMobileDrawerOpen(false);
                    }}
                    className="w-full px-4 py-3 text-left rounded-xl transition-all duration-200 text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 group"
                    ariaLabel={item.label}
                    role="menuitem"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{item.label}</span>
                      <div className="w-1 h-1 bg-indigo-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                    </div>
                  </Button>
                </li>
              ))}
            </ul>
          </div>

          {/* Mobile Auth Buttons */}
          <div className="px-6 py-6 border-t border-gray-200/50 bg-gray-50/50">
            <div className="space-y-3">
              {isAuthenticated ? (
                <div className="flex flex-col space-y-3">
                  {role === 'user' && (
                    <button
                      onClick={() => {
                        navigate('/wishlist');
                        setMobileDrawerOpen(false);
                      }}
                      className="flex items-center space-x-3 p-3 rounded-xl text-slate-700 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                    >
                      <FaHeart size={18} />
                      <span className="font-medium">Wishlist</span>
                      <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">0</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      navigateToProfile();
                      setMobileDrawerOpen(false);
                    }}
                    className="flex items-center space-x-3 p-3 rounded-xl text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-200"
                  >
                    <FaUserCircle size={18} />
                    <span className="font-medium">Profile</span>
                  </button>
                  <div className="pt-2">
                    <LogoutBtn />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      navigate('/login');
                      setMobileDrawerOpen(false);
                    }}
                    className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      navigate('/register');
                      setMobileDrawerOpen(false);
                    }}
                    className="w-full px-4 py-3 bg-gradient-to-r from-rose-600 to-orange-600 text-white font-semibold rounded-xl hover:from-rose-700 hover:to-orange-700 transition-all duration-200 shadow-lg"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )}
    
    <ToastContainer />
  </>
);
}

export default Navbar;