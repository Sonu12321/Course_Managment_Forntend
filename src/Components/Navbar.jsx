import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Menu, X, Zap } from 'lucide-react';
import { FaHeart, FaUserCircle } from 'react-icons/fa';
import { ToastContainer } from 'react-toastify';
import { getUserProfile, getStudentProfile, logout } from '../store/authSlice';

// Futuristic Button Component
const FuturisticButton = ({ 
  children, 
  onClick, 
  variant = 'primary',
  className = '', 
  ariaLabel,
  disabled = false 
}) => {
  const variants = {
    primary: `
      relative overflow-hidden bg-gradient-to-r from-sky-400/20 to-cyan-400/20 
      text-sky-100 border border-sky-400/30 hover:border-sky-300/60
      before:absolute before:inset-0 before:bg-gradient-to-r before:from-sky-400/10 before:to-cyan-400/10 
      before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700
      hover:shadow-[0_0_20px_rgba(56,189,248,0.3)] hover:text-white
    `,
    ghost: `
      bg-transparent text-sky-200 hover:text-sky-100 hover:bg-sky-400/10
      border border-transparent hover:border-sky-400/20 hover:shadow-[0_0_15px_rgba(56,189,248,0.2)]
    `,
    glow: `
      bg-gradient-to-r from-sky-500 to-cyan-500 text-white border border-sky-300/50
      hover:from-sky-400 hover:to-cyan-400 hover:shadow-[0_0_25px_rgba(56,189,248,0.6)]
      hover:scale-105 active:scale-95
    `
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${variants[variant]} ${className} 
        rounded-xl px-4 py-2 font-medium transition-all duration-300 
        focus:outline-none focus:ring-2 focus:ring-sky-400/50 focus:ring-offset-2 focus:ring-offset-slate-900
        disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm
      `}
      aria-label={ariaLabel}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
};

// Futuristic Logout Button
const FuturisticLogoutBtn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const handleLogout = useCallback(() => {
    dispatch(logout());
    navigate('/login');
  }, [dispatch, navigate]);

  return (
    <button
      onClick={handleLogout}
      className="
        group relative overflow-hidden w-12 h-12 rounded-full 
        bg-gradient-to-br from-red-500/80 to-pink-500/80 
        border border-red-400/30 hover:border-red-300/60
        transition-all duration-500 hover:w-36 hover:rounded-2xl
        hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]
        active:scale-95
      "
      aria-label="Logout"
    >
      {/* Icon container */}
      <div className="absolute inset-0 flex items-center justify-center group-hover:justify-start group-hover:pl-4 transition-all duration-500">
        <svg className="w-5 h-5 text-white" viewBox="0 0 512 512" fill="currentColor">
          <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" />
        </svg>
      </div>
      
      {/* Text label */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 text-white font-semibold text-sm whitespace-nowrap">
        Logout
      </div>
      
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-400/20 to-pink-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    </button>
  );
};

// Navigation configuration
const NAV_ROUTES = {
  professor: [
    { label: 'Dashboard', href: '/ProfessorDashboard', icon: '⚡' },
    { label: 'Create Course', href: '/CourseCreation', icon: '✨' },
    { label: 'My Courses', href: '/professorcourses', icon: '📚' },
  ],
  user: [
    { label: 'Courses', href: '/Cards', icon: '🎯' },
    { label: 'About Us', href: '/AboutUs', icon: '🌟' },
    { label: 'Teach With Us', href: '/RegisterProfessor', icon: '🚀' },
  ],
};

const PROFILE_ROUTES = {
  professor: '/Professorprofile',
  user: '/Studentprofile',
};

const Navbar = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [particles, setParticles] = useState([]);
  
  const { isAuthenticated, user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Memoized user role detection
  const userRole = useMemo(() => {
    if (!user) return 'user';
    if (user.role) return user.role;
    if (user.courses || user.isProfessor) return 'professor';
    return 'user';
  }, [user]);

  // Memoized navigation items
  const navItems = useMemo(() => NAV_ROUTES[userRole] || NAV_ROUTES.user, [userRole]);

  // Floating particles effect
  useEffect(() => {
    const newParticles = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.5 + 0.2,
      speed: Math.random() * 2 + 1,
    }));
    setParticles(newParticles);
  }, []);

  // Optimized scroll handler
  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 50);
  }, []);

  // Effects
  useEffect(() => {
    if (isAuthenticated && token) {
      if (userRole === 'professor') {
        dispatch(getUserProfile());
      } else {
        dispatch(getStudentProfile());
      }
    }
  }, [isAuthenticated, token, userRole, dispatch]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Event handlers
  const toggleNavbar = useCallback(() => {
    setMobileDrawerOpen(prev => !prev);
  }, []);

  const navigateToProfile = useCallback(() => {
    const route = PROFILE_ROUTES[userRole] || PROFILE_ROUTES.user;
    navigate(route);
  }, [userRole, navigate]);

  const handleNavigation = useCallback((href) => {
    navigate(href);
    setMobileDrawerOpen(false);
  }, [navigate]);

  // Component renderers
  const renderAuthButtons = useCallback(() => {
    if (isAuthenticated) {
      return (
        <div className="flex items-center space-x-4 " role="navigation" aria-label="User actions">
          {userRole === 'user' && (
            <button
              onClick={() => navigate('/wishlist')}
              className="
                relative group p-3 rounded-xl transition-all duration-300 
                text-sky-200 hover:text-sky-100 
                hover:bg-sky-400/10 hover:shadow-[0_0_15px_rgba(56,189,248,0.3)]
                border border-transparent hover:border-sky-400/30
                transform hover:scale-110 active:scale-95
              "
              title="Wishlist"
              aria-label="View Wishlist"
            >
              <FaHeart size={20} className="transition-transform duration-300 group-hover:scale-110" />
              
              {/* Wishlist count badge */}
              <span className="
                absolute -top-1 -right-1 
                bg-gradient-to-r from-sky-500 to-cyan-500 
                text-white text-xs rounded-full w-5 h-5 
                flex items-center justify-center font-bold 
                shadow-[0_0_10px_rgba(56,189,248,0.5)]
                animate-pulse
              ">
                0
              </span>
            </button>
          )}
          
          <button
            onClick={navigateToProfile}
            className="
              relative group p-3 rounded-xl transition-all duration-300 
              text-sky-200 hover:text-sky-100 
              hover:bg-emerald-400/10 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]
              border border-transparent hover:border-emerald-400/30
              transform hover:scale-110 active:scale-95
            "
            title="Profile"
            aria-label="View Profile"
          >
            <FaUserCircle size={22} className="transition-transform duration-300 group-hover:scale-110" />
          </button>
          
          <div className="ml-2">
            <FuturisticLogoutBtn />
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center space-x-4" role="navigation" aria-label="Authentication">
        <FuturisticButton
          onClick={() => navigate('/login')}
          variant="ghost"
          className="px-6 py-2.5"
          ariaLabel="Sign In"
        >
          Sign In
        </FuturisticButton>
        
        <FuturisticButton
          onClick={() => navigate('/register')}
          variant="glow"
          className="px-6 py-2.5"
          ariaLabel="Sign Up"
        >
          Sign Up
        </FuturisticButton>
      </div>
    );
  }, [isAuthenticated, userRole, navigate, navigateToProfile]);

  const renderMobileAuthActions = useCallback(() => {
    if (!isAuthenticated) {
      return (
        <div className="space-y-4">
          <button
            onClick={() => handleNavigation('/login')}
            className="
              w-full px-6 py-4 rounded-2xl font-bold text-lg transition-all duration-400 
              bg-gradient-to-r from-sky-500/80 to-cyan-500/80 text-white
              border border-sky-300/30 hover:border-sky-200/50
              hover:from-sky-400 hover:to-cyan-400 
              hover:shadow-[0_0_20px_rgba(56,189,248,0.4)]
              hover:scale-105 active:scale-95
            "
          >
            Sign In
          </button>
          <button
            onClick={() => handleNavigation('/register')}
            className="
              w-full px-6 py-4 rounded-2xl font-bold text-lg transition-all duration-400 
              bg-gradient-to-r from-sky-600 to-blue-600 text-white
              border border-sky-400/30 hover:border-sky-300/50
              hover:from-sky-500 hover:to-blue-500 
              hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]
              hover:scale-105 active:scale-95
            "
          >
            Sign Up
          </button>
        </div>
      );
    }

    return (
      <div className="flex flex-col space-y-4">
        {userRole === 'user' && (
          <button
            onClick={() => handleNavigation('/wishlist')}
            className="
              flex items-center space-x-4 p-4 rounded-2xl transition-all duration-400 
              text-sky-100 hover:text-white hover:bg-sky-400/20 
              hover:shadow-[0_0_15px_rgba(56,189,248,0.2)]
              border border-transparent hover:border-sky-400/30
              hover:scale-105
            "
          >
            <FaHeart size={20} />
            <span className="font-semibold text-lg">Wishlist</span>
            <span className="ml-auto bg-gradient-to-r from-sky-500 to-cyan-500 text-white text-sm rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg">0</span>
          </button>
        )}
        <button
          onClick={() => {
            navigateToProfile();
            setMobileDrawerOpen(false);
          }}
          className="
            flex items-center space-x-4 p-4 rounded-2xl transition-all duration-400 
            text-sky-100 hover:text-white hover:bg-emerald-400/20 
            hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]
            border border-transparent hover:border-emerald-400/30
            hover:scale-105
          "
        >
          <FaUserCircle size={20} />
          <span className="font-semibold text-lg">Profile</span>
        </button>
        <div className="pt-2">
          <FuturisticLogoutBtn />
        </div>
      </div>
    );
  }, [isAuthenticated, userRole, handleNavigation, navigateToProfile]);

  return (
    <>
      <nav className={`
        relative flex justify-between items-center min-h-[5rem] w-full px-6 md:px-8 
        backdrop-blur-xl border-b transition-all duration-700 ease-out z-50
        ${isScrolled 
          ? 'bg-slate-900/95 border-sky-400/20 shadow-[0_0_30px_rgba(56,189,248,0.1)]' 
          : 'bg-gradient-to-r from-slate-900/90 via-slate-800/90 to-slate-900/90 border-sky-500/30'
        }
      `}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Floating particles background */}
        {/* <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute rounded-full bg-sky-400/20 animate-float"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                opacity: particle.opacity,
                animationDelay: `${particle.id * 0.5}s`,
                animationDuration: `${particle.speed + 3}s`,
              }}
            />
          ))}
        </div> */}

        {/* Logo Section */}
        <div className="flex items-center flex-shrink-0 relative z-10">
          <a
            href="/"
            className="
              text-3xl md:text-4xl font-black tracking-tight relative group cursor-pointer
              bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent
              hover:from-sky-300 hover:via-cyan-300 hover:to-blue-300
              transition-all duration-500
            "
            onClick={(e) => {
              e.preventDefault();
              navigate('/');
            }}
            aria-label="HoopGear - Go to Homepage"
          >
            <span className="relative z-10 flex items-center">
              <Zap className="w-8 h-8 mr-2 text-sky-400 group-hover:text-sky-300 transition-colors duration-300" />
              HoopGear
            </span>
            
            {/* Glow effect */}
            <div className="
              absolute inset-0 bg-gradient-to-r from-sky-400/20 to-cyan-400/20 
              opacity-0 group-hover:opacity-100 rounded-xl blur-lg scale-110 
              transition-all duration-500
            "></div>
            
            {/* Underline effect */}
            <div className="
              absolute -bottom-2 left-0 w-0 h-1 
              bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-400 
              group-hover:w-full transition-all duration-700 rounded-full
              shadow-[0_0_10px_rgba(56,189,248,0.6)]
            "></div>
          </a>
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden lg:flex items-center space-x-3 relative z-10" role="menubar">
          {navItems.map((item, index) => (
            <li key={index} role="none">
              <FuturisticButton
                onClick={() => navigate(item.href)}
                variant="ghost"
                className="
                  px-2 mt-2  text-base font-semibold group relative overflow-hidden
                  hover:scale-105 hover:-translate-y-1 active:scale-95
                  transition-all duration-300
                "
                ariaLabel={item.label}
                role="menuitem"
              >
                <span className="mr-2 text-lg">{item.icon}</span>
                {item.label}
              </FuturisticButton>
            </li>
          ))}
        </ul>

        {/* Auth Buttons Section */}
        <div className="hidden lg:flex items-center space-x-5 relative z-10">
          {renderAuthButtons()}
        </div>

        {/* Mobile Menu Button */}
        <FuturisticButton
          onClick={toggleNavbar}
          variant="ghost"
          className={`
            lg:hidden p-4 relative z-10 transform transition-all duration-400
            hover:scale-110 hover:rotate-3 active:scale-90 active:rotate-0
          `}
          ariaLabel={mobileDrawerOpen ? 'Close Menu' : 'Open Menu'}
        >
          <div className="relative">
            {mobileDrawerOpen ? (
              <X size={28} className="transform transition-all duration-500 rotate-180 scale-110" />
            ) : (
              <Menu size={28} className="transform transition-all duration-500" />
            )}
          </div>
        </FuturisticButton>

        {/* Top border glow */}
       
      </nav>

      {/* Futuristic Mobile Menu */}
      {mobileDrawerOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden"
          aria-modal="true"
          role="dialog"
        >
          {/* Enhanced backdrop */}
          <div 
            className="
              fixed inset-0 bg-gradient-to-br from-slate-900/80 via-sky-900/20 to-slate-900/80 
              backdrop-blur-xl transition-all duration-500
            "
            onClick={toggleNavbar}
          />
          
          {/* Mobile menu panel */}
          <div className="
            fixed right-0 top-0 h-full z-50 w-4/5 max-w-sm 
            bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 
            backdrop-blur-xl shadow-2xl shadow-sky-500/20
            border-l border-sky-400/20 flex flex-col overflow-y-auto 
            transform transition-all duration-500 ease-out
          " role="menu">
            {/* Header */}
            <div className="
              flex items-center justify-between p-6 
              border-b border-sky-400/20 bg-gradient-to-r from-sky-500/5 to-cyan-500/5
            ">
              <div className="text-2xl font-bold bg-gradient-to-r from-sky-400 to-cyan-400 bg-clip-text text-transparent">
                Menu
              </div>
              <button
                onClick={toggleNavbar}
                className="
                  p-3 rounded-2xl transition-all duration-300 
                  text-sky-200 hover:text-sky-100 hover:bg-sky-400/10 
                  hover:scale-110 active:scale-95 
                  border border-transparent hover:border-sky-400/30
                  hover:shadow-[0_0_15px_rgba(56,189,248,0.2)]
                "
                aria-label="Close Menu"
              >
                <X size={24} />
              </button>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 px-6 py-6">
              <ul className="space-y-4" role="menu">
                {navItems.map((item, index) => (
                  <li key={index} role="none">
                    <button
                      onClick={() => handleNavigation(item.href)}
                      className="
                        w-full px-5 py-4 text-left rounded-2xl transition-all duration-400 
                        text-sky-100 hover:text-white hover:bg-sky-400/10 
                        hover:shadow-[0_0_15px_rgba(56,189,248,0.2)]
                        border border-transparent hover:border-sky-400/20
                        hover:scale-105 group
                      "
                      role="menuitem"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-xl">{item.icon}</span>
                          <span className="font-semibold text-xl">{item.label}</span>
                        </div>
                        <div className="
                          w-3 h-3 bg-gradient-to-r from-sky-400 to-cyan-400 rounded-full 
                          opacity-0 group-hover:opacity-100 transition-all duration-400 
                          transform scale-0 group-hover:scale-100
                          shadow-[0_0_10px_rgba(56,189,248,0.5)]
                        "></div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Mobile Auth Buttons */}
            <div className="
              px-6 py-6 border-t border-sky-400/20 
              bg-gradient-to-r from-slate-800/50 to-slate-700/50
            ">
              {renderMobileAuthActions()}
            </div>
          </div>
        </div>
      )}
      
      <ToastContainer />

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        .animate-float {
          animation: float ease-in-out infinite;
        }
      `}</style>
    </>
  );
};

export default Navbar;
