import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BookOpen, User, Clock, Tag, AlertCircle, Loader2, Lock, Sparkles, Star, Filter } from 'lucide-react';

const CourseCard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [visibleCards, setVisibleCards] = useState(new Set());
  const navigate = useNavigate();

  // Dummy course data to show when user is not logged in (unchanged logic)
  const dummyCourses = [
    {
      _id: 'dummy1',
      title: 'Neural Network Architecture',
      description: 'Master the fundamentals of HTML, CSS, and JavaScript to build quantum-powered websites from the future.',
      thumbnail: 'https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      price: 49.99,
      instructor: { firstname: 'Dr. Sarah', lastname: 'Quantum' },
      category: 'Web Development',
      level: 'Beginner'
    },
    {
      _id: 'dummy2',
      title: 'Advanced React Nexus',
      description: 'Master advanced React concepts including quantum hooks, neural context API, and performance optimization beyond limits.',
      thumbnail: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      price: 79.99,
      instructor: { firstname: 'Prof. Alex', lastname: 'CyberMind' },
      category: 'JavaScript',
      level: 'Advanced'
    },
    {
      _id: 'dummy3',
      title: 'Python AI Mastery',
      description: 'Learn quantum Python for neural data analysis, AI visualization, and machine consciousness applications.',
      thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      price: 0,
      instructor: { firstname: 'Dr. Emily', lastname: 'DataForge' },
      category: 'Data Science',
      level: 'Intermediate'
    },
    {
      _id: 'dummy4',
      title: 'Quantum UI/UX Design',
      description: 'Learn the principles of interdimensional interface design to create beautiful, mind-bending user experiences.',
      thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      price: 59.99,
      instructor: { firstname: 'Jessica', lastname: 'CloudTech' },
      category: 'Design',
      level: 'Beginner'
    },
  ];

  // FIXED: Compute filteredCourses early to avoid reference error
  const filteredCourses = filter === 'all' 
    ? courses 
    : courses.filter(course => {
        if (filter === 'free') return course.price === 0;
        if (filter === 'paid') return course.price > 0;
        return true;
      });

  // Intersection Observer for card animations - now using courses.length instead of filteredCourses
  useEffect(() => {
    if (courses.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleCards(prev => new Set([...prev, entry.target.dataset.cardId]));
          }
        });
      },
      { threshold: 0.1 }
    );

    // Use a timeout to ensure DOM elements are rendered
    const timeoutId = setTimeout(() => {
      const cards = document.querySelectorAll('[data-card-id]');
      cards.forEach(card => observer.observe(card));
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [courses.length]); // Changed dependency

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      fetchCourses(token);
    } else {
      setCourses(dummyCourses);
      setLoading(false);
    }
  }, []);

  const fetchCourses = async (token) => {
    try {
      setLoading(true);
      const response = await axios.get('https://course-creation-backend.onrender.com/api/courses/admin/courses', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setCourses(response.data.courses);
      } else {
        setError('Failed to fetch courses');
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError('Error fetching courses. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (courseId) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/course/${courseId}` } });
    } else {
      navigate(`/course/${courseId}`);
    }
  };

  // Enhanced loading component
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-sky-400/20 animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 6 + 2}px`,
                height: `${Math.random() * 6 + 2}px`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: `${Math.random() * 3 + 4}s`,
              }}
            />
          ))}
        </div>
        
        <div className="relative z-10 text-center">
          <div className="relative mb-8">
            <Loader2 className="h-16 w-16 text-sky-400 animate-spin mx-auto" />
            <div className="absolute inset-0 h-16 w-16 mx-auto rounded-full border-2 border-sky-400/20 animate-pulse"></div>
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Loading Quantum Courses...
          </h2>
          <p className="text-sky-200/70">Preparing your learning journey</p>
        </div>
      </div>
    );
  }

  // Enhanced error component
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full p-8 rounded-3xl bg-gradient-to-br from-red-500/10 to-pink-500/10 backdrop-blur-xl border border-red-400/20 shadow-2xl">
          <div className="text-center">
            <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-red-500/20 to-pink-500/20 border border-red-400/30 mb-6">
              <AlertCircle className="h-8 w-8 text-red-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Unable to Load Courses</h3>
            <p className="text-red-200/80 mb-8 leading-relaxed">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="
                px-8 py-4 bg-gradient-to-r from-red-500 to-pink-500 
                text-white font-bold rounded-2xl
                hover:from-red-400 hover:to-pink-400 
                hover:shadow-[0_0_30px_rgba(239,68,68,0.5)]
                transform hover:scale-105 active:scale-95
                transition-all duration-300
              "
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Floating background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length, }, (_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-sky-400/10 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 8 + 3}px`,
              height: `${Math.random() * 8 + 3}px`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${Math.random() * 4 + 5}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Enhanced Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-sky-500/20 via-indigo-500/20 to-purple-500/20 border border-sky-400/30 mb-8 backdrop-blur-lg">
            <Sparkles className="w-5 h-5 text-sky-400 animate-pulse" />
            <span className="text-sky-200 font-bold uppercase tracking-wider">Course Nexus</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6 animate-slideInUp">
            Quantum{' '}
            <span className="bg-gradient-to-r from-sky-400 via-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Learning
            </span>
          </h2>
          
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Discover revolutionary courses designed to transform your mind and unlock infinite possibilities
          </p>
        </div>
        
        {/* Enhanced Authentication Notice */}
        {!isAuthenticated && (
          <div className="max-w-4xl mx-auto mb-12">
            <div className="
              relative p-6 rounded-3xl overflow-hidden
              bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-yellow-500/10 
              backdrop-blur-xl border border-yellow-400/30
              hover:shadow-[0_0_40px_rgba(251,191,36,0.3)]
              transition-all duration-500 group
            ">
              {/* Background glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/5 to-orange-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10 flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-400/30">
                  <Lock className="h-6 w-6 text-yellow-400" />
                </div>
                
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">You're Exploring Our Course Preview</h3>
                  <p className="text-yellow-200/80 leading-relaxed">
                    <button 
                      onClick={() => navigate('/login')}
                      className="text-sky-300 hover:text-sky-200 font-semibold hover:underline transition-colors duration-300"
                    >
                      Log in
                    </button>
                    {' '}or{' '}
                    <button 
                      onClick={() => navigate('/register')}
                      className="text-sky-300 hover:text-sky-200 font-semibold hover:underline transition-colors duration-300"
                    >
                      register
                    </button>
                    {' '}to access the full quantum learning experience and unlock all course features.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Enhanced Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <div className="inline-flex p-2 rounded-2xl bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-xl border border-sky-400/20">
            {[
              { key: 'all', label: 'All Courses', icon: BookOpen },
              { key: 'free', label: 'Free Courses', icon: Star },
              { key: 'paid', label: 'Premium Courses', icon: Sparkles }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`
                  relative px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 
                  flex items-center gap-2 overflow-hidden group
                  ${filter === key 
                    ? 'bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-[0_0_20px_rgba(56,189,248,0.4)]' 
                    : 'text-sky-200 hover:text-white hover:bg-sky-400/10'
                  }
                `}
              >
                {filter === key && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                )}
                <Icon className="w-4 h-4 relative z-10" />
                <span className="relative z-10">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Enhanced Empty State */}
        {filteredCourses.length === 0 ? (
          <div className="max-w-2xl mx-auto text-center">
            <div className="
              p-12 rounded-3xl 
              bg-gradient-to-br from-sky-500/10 via-indigo-500/10 to-purple-500/10 
              backdrop-blur-xl border border-sky-400/20
              hover:shadow-[0_0_40px_rgba(56,189,248,0.3)]
              transition-all duration-500
            ">
              <div className="inline-flex p-6 rounded-2xl bg-gradient-to-br from-sky-500/20 to-indigo-500/20 border border-sky-400/30 mb-6">
                <BookOpen className="h-12 w-12 text-sky-400" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-4">No Courses Found</h3>
              <p className="text-sky-200/70 leading-relaxed">
                {filter !== 'all' 
                  ? `No ${filter} courses found. Try selecting a different filter to explore more options.` 
                  : "The quantum course library is currently being updated. Check back soon for new learning experiences."}
              </p>
            </div>
          </div>
        ) : (
          /* Enhanced Course Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredCourses.map((course, index) => {
              const cardId = `course-${course._id}`;
              const isVisible = visibleCards.has(cardId);
              
              return (
                <div
                  key={course._id}
                  data-card-id={cardId}
                  className={`
                    group relative transform transition-all duration-700 ease-out
                    ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}
                    hover:scale-105 hover:-translate-y-2 will-change-transform
                  `}
                  style={{ transitionDelay: `${(index % 8) * 100}ms` }}
                >
                  {/* Card glow effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-sky-400/20 via-indigo-400/20 to-purple-400/20 rounded-3xl opacity-0 group-hover:opacity-100 blur-lg transition-all duration-700"></div>
                  
                  <div className="
                    relative h-full flex flex-col rounded-3xl overflow-hidden
                    bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl
                    border border-slate-700/50 group-hover:border-sky-400/50
                    shadow-xl group-hover:shadow-[0_0_30px_rgba(56,189,248,0.3)]
                    transition-all duration-500
                  ">
                    {/* Enhanced Image Container */}
                    <div className="relative overflow-hidden">
                      {course.thumbnail ? (
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gradient-to-br from-sky-500 via-indigo-500 to-purple-500 flex items-center justify-center">
                          <BookOpen className="h-12 w-12 text-white" />
                        </div>
                      )}
                      
                      {/* Enhanced overlay effects */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute inset-0 bg-gradient-to-br from-sky-500/20 via-indigo-500/20 to-purple-500/20 opacity-0 group-hover:opacity-60 transition-opacity duration-700"></div>
                      
                      {/* Enhanced price badge */}
                      {course.price !== undefined && (
                        <div className="absolute top-4 right-4">
                          <div className={`
                            px-4 py-2 rounded-full font-bold text-sm shadow-lg backdrop-blur-sm
                            transition-all duration-300 group-hover:scale-110
                            ${course.price === 0 
                              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border border-green-400/50' 
                              : 'bg-gradient-to-r from-sky-500 to-indigo-500 text-white border border-sky-400/50'
                            }
                          `}>
                            {course.price === 0 ? 'FREE' : `$${course.price.toFixed(2)}`}
                          </div>
                        </div>
                      )}
                      
                      {/* Enhanced auth overlay */}
                      {!isAuthenticated && (
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm">
                          <div className="bg-gradient-to-r from-slate-800/95 to-slate-700/95 backdrop-blur-lg px-6 py-3 rounded-2xl shadow-xl border border-sky-400/30">
                            <p className="text-sky-200 font-bold flex items-center gap-2">
                              <Lock className="h-4 w-4" /> 
                              Login to Access
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Enhanced Content */}
                    <div className="p-6 flex-grow flex flex-col relative">
                      {/* Background shimmer */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      
                      <div className="relative z-10">
                        <h3 className="text-xl font-bold text-white group-hover:text-sky-200 transition-colors duration-300 mb-3 line-clamp-2 leading-tight">
                          {course.title}
                        </h3>
                        
                        <div className="flex items-center mb-4 text-slate-300 group-hover:text-slate-200 transition-colors duration-300">
                          <div className="p-1.5 rounded-lg bg-gradient-to-br from-sky-500/20 to-indigo-500/20 border border-sky-400/30 mr-3">
                            <User className="h-3 w-3 text-sky-400" />
                          </div>
                          <span className="text-sm font-medium">
                            {course.instructor?.firstname} {course.instructor?.lastname}
                          </span>
                        </div>
                        
                        <p className="text-slate-300 text-sm mb-6 flex-grow line-clamp-3 leading-relaxed group-hover:text-slate-200 transition-colors duration-300">
                          {course.description}
                        </p>
                        
                        {/* Enhanced tags */}
                        <div className="flex flex-wrap gap-2 mb-6">
                          {course.category && (
                            <span className="px-3 py-1.5 bg-gradient-to-r from-sky-500/20 to-indigo-500/20 text-sky-300 rounded-xl text-xs font-bold border border-sky-400/30 backdrop-blur-sm">
                              {course.category}
                            </span>
                          )}
                          {course.level && (
                            <span className="px-3 py-1.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 rounded-xl text-xs font-bold border border-purple-400/30 backdrop-blur-sm">
                              {course.level}
                            </span>
                          )}
                        </div>
                        
                        {/* Enhanced CTA button */}
                        <button
                          onClick={() => handleViewDetails(course._id)}
                          className={`
                            w-full py-4 rounded-2xl font-bold text-lg mt-auto transform transition-all duration-300 
                            hover:scale-105 active:scale-95 relative overflow-hidden group/btn
                            ${isAuthenticated 
                              ? 'bg-gradient-to-r from-sky-500 to-indigo-500 text-white hover:from-sky-400 hover:to-indigo-400 hover:shadow-[0_0_25px_rgba(56,189,248,0.6)]'
                              : 'bg-gradient-to-r from-slate-600 to-slate-700 text-slate-300 hover:from-slate-500 hover:to-slate-600'
                            }
                          `}
                        >
                          {/* Button shimmer effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                          
                          <span className="relative z-10 flex items-center justify-center gap-2">
                            {isAuthenticated ? (
                              <>
                                <Sparkles className="w-5 h-5" />
                                Explore Course
                              </>
                            ) : (
                              <>
                                <Lock className="w-5 h-5" />
                                Login to Access
                              </>
                            )}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* FIXED: Removed jsx attribute from style tag */}
      <style>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
            opacity: 0.4; 
          }
          50% { 
            transform: translateY(-20px) rotate(180deg); 
            opacity: 0.8; 
          }
        }
        .animate-float {
          animation: float ease-in-out infinite;
        }

        @keyframes slideInUp {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideInUp {
          animation: slideInUp 0.8s ease-out forwards;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default CourseCard;
