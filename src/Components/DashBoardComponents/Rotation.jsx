import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Star, Quote, Zap, Award, Users, BookOpen, Target, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import TiltedCard from '../Style/Title';

// Enhanced Carousel Components with Modern Animations
const FuturisticCarousel = ({ children, className = '' }) => (
  <div className={`relative ${className}`}>{children}</div>
);

const CarouselContent = ({ children, className = '' }) => (
  <div className={`flex overflow-hidden ${className}`}>{children}</div>
);

const CarouselItem = ({ children, className = '' }) => (
  <div className={`flex-shrink-0 ${className}`}>{children}</div>
);

const CarouselButton = ({ direction, onClick, className = '' }) => {
  const isNext = direction === 'next';
  const Icon = isNext ? ChevronRight : ChevronLeft;
  
  return (
    <button 
      onClick={onClick}
      className={`
        absolute ${isNext ? 'right-6' : 'left-6'} top-1/2 -translate-y-1/2 
        w-14 h-14 rounded-xl flex items-center justify-center
        bg-gradient-to-r from-slate-800/90 to-slate-700/90 backdrop-blur-lg
        border-2 border-gradient-to-r from-sky-400/40 via-indigo-400/40 to-purple-400/40
        text-sky-300 hover:text-white
        hover:bg-gradient-to-r hover:from-indigo-600/80 hover:to-purple-600/80
        hover:border-indigo-300/80 hover:shadow-[0_0_35px_rgba(99,102,241,0.8)]
        transform hover:scale-110 active:scale-95
        transition-all duration-500 z-20 group overflow-hidden
        ${className}
      `}
      aria-label={`${isNext ? 'Next' : 'Previous'} review`}
    >
      {/* Shimmer effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
      
      <Icon className="w-6 h-6 group-hover:scale-125 transition-transform duration-300 relative z-10" />
    </button>
  );
};

// Enhanced Avatar Components
const FuturisticAvatar = ({ children, className = '' }) => (
  <div className={`
    relative inline-block rounded-full overflow-hidden 
    border-3 border-gradient-to-tr from-sky-400/60 via-indigo-400/60 to-purple-400/60
    shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.7)]
    transition-all duration-500 group
    ${className}
  `}>
    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    {children}
  </div>
);

const AvatarImage = ({ src, alt, className = '' }) => (
  <img 
    src={src} 
    alt={alt} 
    className={`w-full h-full object-cover transition-transform duration-500 hover:scale-110 ${className}`} 
  />
);

const AvatarFallback = ({ children, className = '' }) => (
  <div className={`
    flex items-center justify-center w-full h-full 
    bg-gradient-to-br from-sky-500/80 via-indigo-500/80 to-purple-500/80 
    text-white font-extrabold text-lg tracking-wider
    ${className}
  `}>
    {children}
  </div>
);

// Enhanced Data Configuration
const COURSE_CONFIG = {
  images: [
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop',
  ],
  titles: [
    "Neural Network Mastery",
    "Quantum UI/UX Design", 
    "AI Data Science Pro",
    "Deep Learning Revolution",
    "React Metaverse Dev",
    "Cybersecurity Nexus",
    "Cloud Computing 3.0",
    "Digital Marketing AI",
    "Blockchain Universe"
  ],
  instructors: [
    "Dr. Sarah Quantum", "Prof. Mike Neural", "Dr. Emily DataForge", "Alex CyberMind", 
    "Jessica CloudTech", "David CryptoSec", "Maria AI-Vision", "James CodeMaster", "Lisa TechGuru"
  ]
};

const STUDENT_TESTIMONIALS = [
  {
    name: "Alex Thompson",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    course: "Neural Network Mastery",
    rating: 5,
    review: "This revolutionary course transformed my understanding of AI. The quantum-level explanations and hands-on neural projects catapulted me into the future of technology.",
    achievement: "AI Architect at Tesla",
    gradient: "from-sky-600/10 via-indigo-600/10 to-purple-600/10",
    borderGradient: "from-sky-400/50 via-indigo-400/50 to-purple-400/50"
  },
  {
    name: "Priya Patel",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    course: "Quantum UI/UX Design",
    rating: 5,
    review: "The design principles here are from the future! Every interaction I design now feels like magic. My portfolio became a gateway to unlimited opportunities.",
    achievement: "Lead Designer at Apple",
    gradient: "from-cyan-600/10 via-blue-600/10 to-indigo-600/10",
    borderGradient: "from-cyan-400/50 via-blue-400/50 to-indigo-400/50"
  },
  {
    name: "Marcus Johnson",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    course: "AI Data Science Pro",
    rating: 5,
    review: "From data novice to AI master! The course unlocked the secrets of machine consciousness and predictive algorithms that seemed impossible before.",
    achievement: "Chief Data Scientist at Google",
    gradient: "from-blue-600/10 via-indigo-600/10 to-purple-600/10",
    borderGradient: "from-blue-400/50 via-indigo-400/50 to-purple-400/50"
  },
  {
    name: "Emma Rodriguez",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    course: "Digital Marketing AI",
    rating: 5,
    review: "This isn't just marketing - it's mind-reading technology! I've achieved 500% ROI using these quantum marketing strategies. The future is now!",
    achievement: "CMO at SpaceX",
    gradient: "from-indigo-600/10 via-purple-600/10 to-pink-600/10",
    borderGradient: "from-indigo-400/50 via-purple-400/50 to-pink-400/50"
  },
  {
    name: "James Park",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    course: "Deep Learning Revolution",
    rating: 5,
    review: "I'm now building AI systems that think beyond human capacity. The deep learning techniques here opened portals to artificial consciousness.",
    achievement: "AI Research Lead at OpenAI",
    gradient: "from-purple-600/10 via-pink-600/10 to-rose-600/10",
    borderGradient: "from-purple-400/50 via-pink-400/50 to-rose-400/50"
  },
  {
    name: "Sophie Chen",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    course: "Cybersecurity Nexus",
    rating: 5,
    review: "I've become a digital guardian of the cyber realm. These advanced security protocols protect entire digital universes from quantum threats.",
    achievement: "Cyber Defense Director at Pentagon",
    gradient: "from-pink-600/10 via-rose-600/10 to-orange-600/10",
    borderGradient: "from-pink-400/50 via-rose-400/50 to-orange-400/50"
  }
];

const STATS_CONFIG = [
  { 
    number: "100K+", 
    label: "Future-Ready Minds", 
    icon: Users, 
    gradient: "from-sky-400 via-indigo-400 to-purple-400",
    bgGradient: "from-sky-500/10 via-indigo-500/10 to-purple-500/10",
    description: "Transformed Lives"
  },
  { 
    number: "99.9%", 
    label: "Quantum Success Rate", 
    icon: Target, 
    gradient: "from-cyan-400 via-blue-400 to-indigo-400",
    bgGradient: "from-cyan-500/10 via-blue-500/10 to-indigo-500/10",
    description: "Dreams Achieved"
  },
  { 
    number: "2K+", 
    label: "Neural Instructors", 
    icon: BookOpen, 
    gradient: "from-blue-400 via-indigo-400 to-purple-400",
    bgGradient: "from-blue-500/10 via-indigo-500/10 to-purple-500/10",
    description: "Tech Visionaries"
  },
  { 
    number: "∞", 
    label: "Infinite Possibilities", 
    icon: Sparkles, 
    gradient: "from-indigo-400 via-purple-400 to-pink-400",
    bgGradient: "from-indigo-500/10 via-purple-500/10 to-pink-500/10",
    description: "Limitless Potential"
  }
];

export default function ModernFuturisticRotation() {
  const [isHovered, setIsHovered] = useState(false);
  const [isTouching, setIsTouching] = useState(false);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [particles, setParticles] = useState([]);
  const [visibleCards, setVisibleCards] = useState(new Set());
  const carouselRef = useRef(null);
  const observerRef = useRef(null);

  // Enhanced particle system
  useEffect(() => {
    const newParticles = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 5 + 2,
      opacity: Math.random() * 0.7 + 0.3,
      speed: Math.random() * 3 + 1,
      color: ['sky', 'indigo', 'purple', 'cyan'][Math.floor(Math.random() * 4)]
    }));
    setParticles(newParticles);
  }, []);

  // Intersection Observer for card animations
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleCards(prev => new Set([...prev, entry.target.dataset.cardIndex]));
          }
        });
      },
      { threshold: 0.1 }
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Optimized scroll handler
  const handleScroll = useCallback(() => {
    if (!carouselRef.current || isHovered || isTouching) return;

    const container = carouselRef.current;
    const scrollWidth = container.scrollWidth;
    const containerWidth = container.clientWidth;

    if (container.scrollLeft >= scrollWidth / 2 - containerWidth) {
      container.scrollTo({ left: 0, behavior: 'auto' });
    } else {
      container.scrollBy({ left: 1.2, behavior: 'auto' });
    }
  }, [isHovered, isTouching]);

  useEffect(() => {
    const interval = setInterval(handleScroll, 30);
    return () => clearInterval(interval);
  }, [handleScroll]);

  // Auto-rotate reviews
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isHovered) {
        setCurrentReviewIndex(prev => 
          prev >= STUDENT_TESTIMONIALS.length - 1 ? 0 : prev + 1
        );
      }
    }, 4500);
    return () => clearInterval(interval);
  }, [isHovered]);

  const nextReview = useCallback(() => {
    setCurrentReviewIndex(prev => 
      prev >= STUDENT_TESTIMONIALS.length - 1 ? 0 : prev + 1
    );
  }, []);

  const prevReview = useCallback(() => {
    setCurrentReviewIndex(prev => 
      prev <= 0 ? STUDENT_TESTIMONIALS.length - 1 : prev - 1
    );
  }, []);

  // Enhanced course card renderer
  const renderCourseCard = useCallback((image, index) => {
    const cardIndex = `course-${index}`;
    const isVisible = visibleCards.has(cardIndex);
    
    return (
      <div
        key={cardIndex}
        data-card-index={cardIndex}
        ref={(el) => {
          if (el && observerRef.current) {
            observerRef.current.observe(el);
          }
        }}
        className={`
          flex-shrink-0 w-80 mx-4 group relative
          transform transition-all duration-700 ease-out
          ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}
          hover:scale-105 hover:-translate-y-3
          will-change-transform
        `}
        style={{ transitionDelay: `${(index % 5) * 100}ms` }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={() => setIsTouching(true)}
        onTouchEnd={() => setIsTouching(false)}
      >
        {/* Card glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-sky-400/20 via-indigo-400/20 to-purple-400/20 rounded-3xl opacity-0 group-hover:opacity-100 blur-lg transition-all duration-700"></div>
        
        <div className="relative bg-slate-800/90 rounded-3xl overflow-hidden backdrop-blur-lg border border-slate-700/50 group-hover:border-indigo-400/50 transition-all duration-500">
          {/* Image container */}
          <div className="relative overflow-hidden rounded-t-3xl">
            <TiltedCard
              imageSrc={image}
              altText={COURSE_CONFIG.titles[index % COURSE_CONFIG.titles.length]}
              captionText={COURSE_CONFIG.titles[index % COURSE_CONFIG.titles.length]}
              containerHeight="260px"
              containerWidth="100%"
              imageHeight="260px"
              imageWidth="100%"
              rotateAmplitude={8}
              scaleOnHover={1.1}
              showMobileWarning={false}
              showTooltip={true}
              displayOverlayContent={true}
            />
            
            {/* Enhanced overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-sky-500/20 via-indigo-500/20 to-purple-500/20 opacity-0 group-hover:opacity-60 transition-all duration-700"></div>
          </div>
          
          {/* Content container */}
          <div className="p-6 space-y-4 relative">
            {/* Background shimmer */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-white group-hover:text-sky-200 transition-colors duration-300 mb-2">
                {COURSE_CONFIG.titles[index % COURSE_CONFIG.titles.length]}
              </h3>
              
              <p className="text-sm text-slate-300 group-hover:text-slate-200 transition-colors duration-300 mb-4">
                By {COURSE_CONFIG.instructors[index % COURSE_CONFIG.instructors.length]}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl font-bold bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    ₹2,999
                  </span>
                  <span className="text-sm text-slate-400 line-through">₹9,999</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400 group-hover:scale-110 transition-transform duration-300" style={{ transitionDelay: `${i * 50}ms` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }, [visibleCards]);

  // Enhanced review card renderer
  const renderReviewCard = useCallback((review, index) => (
    <div 
      key={`review-${index}`}
      className={`
        w-full max-w-3xl mx-auto p-10 rounded-3xl relative overflow-hidden
        bg-gradient-to-br ${review.gradient} backdrop-blur-xl
        border-2 border-gradient-to-br ${review.borderGradient}
        hover:shadow-[0_0_60px_rgba(99,102,241,0.6)]
        transform hover:scale-102 transition-all duration-800
        group animate-slideInUp
      `}
    >
      {/* Multiple background layers for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800/40 to-slate-900/60"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-sky-500/5 via-indigo-500/10 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-800"></div>
      
      {/* Animated border */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-sky-400/20 via-indigo-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
      
      <div className="relative z-10">
        {/* Quote icon with animation */}
        <div className="mb-8">
          <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-sky-500/20 via-indigo-500/20 to-purple-500/20 border border-indigo-400/30 group-hover:border-indigo-300/50 transition-all duration-500 group-hover:scale-110">
            <Quote className="text-sky-300 group-hover:text-sky-200 transition-colors duration-300" size={28} />
          </div>
        </div>
        
        {/* Review text with typing effect */}
        <p className="text-slate-100 mb-8 leading-relaxed text-xl font-medium group-hover:text-white transition-colors duration-300">
          "{review.review}"
        </p>
        
        {/* Animated rating */}
        <div className="flex items-center space-x-2 mb-8">
          {[...Array(review.rating)].map((_, i) => (
            <Star 
              key={i} 
              className="w-6 h-6 fill-yellow-400 text-yellow-400 group-hover:scale-125 transition-all duration-300" 
              style={{ transitionDelay: `${i * 100}ms` }}
            />
          ))}
        </div>
        
        {/* Enhanced user info */}
        <div className="flex items-center space-x-6">
          <FuturisticAvatar className="w-20 h-20">
            <AvatarImage src={review.avatar} alt={review.name} />
            <AvatarFallback>{review.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </FuturisticAvatar>
          
          <div className="space-y-1">
            <h4 className="font-bold text-white text-xl group-hover:text-sky-200 transition-colors duration-300">
              {review.name}
            </h4>
            <p className="text-sky-300 font-semibold text-lg group-hover:text-sky-200 transition-colors duration-300">
              {review.achievement}
            </p>
            <p className="text-slate-400 text-sm group-hover:text-slate-300 transition-colors duration-300">
              {review.course}
            </p>
          </div>
        </div>
      </div>
    </div>
  ), []);

  const memoizedStats = useMemo(() => STATS_CONFIG, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Enhanced floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className={`absolute rounded-full bg-${particle.color}-400/30 animate-float`}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.opacity,
              animationDelay: `${particle.id * 0.2}s`,
              animationDuration: `${particle.speed + 3}s`,
            }}
          />
        ))}
      </div>

      {/* Featured Courses Section */}
      <div className="relative z-10 py-24">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-sky-500/20 via-indigo-500/20 to-purple-500/20 border border-indigo-400/40 mb-10 backdrop-blur-lg shadow-lg">
            <Zap className="w-6 h-6 text-sky-400 animate-pulse" />
            <span className="text-sky-200 font-bold uppercase tracking-wider text-lg">Elite Courses</span>
          </div>
          
          <h2 className="text-6xl md:text-7xl font-black text-white mb-8 animate-slideInUp">
            Future-Ready{' '}
            <span className="bg-gradient-to-r from-sky-400 via-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
              Learning
            </span>
          </h2>
          
          <p className="text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed animate-slideInUp" style={{ animationDelay: '200ms' }}>
            Master tomorrow's technologies today with courses designed by quantum-level experts 
            and powered by next-generation learning algorithms.
          </p>
        </div>

        <div className="relative overflow-hidden px-4">
          <div
            ref={carouselRef}
            className="flex items-center space-x-6 overflow-x-auto hide-scrollbar py-12"
            style={{ scrollBehavior: 'smooth', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {[...Array(3)].flatMap((_, i) =>
              COURSE_CONFIG.images.map((img, idx) => 
                renderCourseCard(img, idx + i * COURSE_CONFIG.images.length)
              )
            )}
          </div>
        </div>
      </div>

      {/* Student Success Stories Section */}
      <div className="relative z-10 py-24 bg-gradient-to-r from-slate-900/80 to-slate-800/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 border border-purple-400/40 mb-10 backdrop-blur-lg shadow-lg">
              <Award className="w-6 h-6 text-purple-400 animate-pulse" />
              <span className="text-purple-200 font-bold uppercase tracking-wider text-lg">Success Stories</span>
            </div>
            
            <h2 className="text-6xl md:text-7xl font-black text-white mb-8 animate-slideInUp">
              Quantum{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent animate-gradient">
                Transformations
              </span>
            </h2>
            
            <p className="text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed animate-slideInUp" style={{ animationDelay: '200ms' }}>
              Witness the extraordinary journeys of minds that transcended limitations 
              and achieved the impossible through our revolutionary learning system.
            </p>
          </div>

          <FuturisticCarousel className="w-full">
            <div 
              className="relative min-h-[500px] flex items-center justify-center"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {renderReviewCard(STUDENT_TESTIMONIALS[currentReviewIndex], currentReviewIndex)}
            </div>
            
            <CarouselButton direction="prev" onClick={prevReview} />
            <CarouselButton direction="next" onClick={nextReview} />
          </FuturisticCarousel>

          {/* Enhanced review indicators */}
          <div className="flex justify-center mt-12 space-x-4">
            {STUDENT_TESTIMONIALS.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentReviewIndex(index)}
                className={`
                  w-4 h-4 rounded-full transition-all duration-500 relative overflow-hidden
                  ${index === currentReviewIndex 
                    ? 'bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 shadow-[0_0_20px_rgba(99,102,241,0.8)] scale-125' 
                    : 'bg-slate-600 hover:bg-slate-500 hover:scale-110'
                  }
                `}
                aria-label={`Select review ${index + 1}`}
              >
                {index === currentReviewIndex && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Stats Section */}
      <div className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {memoizedStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div 
                  key={index}
                  className={`
                    group relative p-10 rounded-3xl transition-all duration-700
                    bg-gradient-to-br ${stat.bgGradient} backdrop-blur-xl
                    border-2 border-slate-700/50 hover:border-indigo-400/60
                    hover:shadow-[0_0_50px_rgba(99,102,241,0.4)]
                    transform hover:scale-105 hover:-translate-y-4
                    text-center overflow-hidden
                    animate-slideInUp
                  `}
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {/* Background effects */}
                  <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 via-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  
                  <div className="relative z-10">
                    {/* Enhanced icon */}
                    <div className="mb-6">
                      <div className="inline-flex p-6 rounded-2xl bg-gradient-to-br from-sky-500/20 via-indigo-500/20 to-purple-500/20 border border-indigo-400/40 group-hover:border-indigo-300/60 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                        <IconComponent className="w-10 h-10 text-sky-300 group-hover:text-sky-200 transition-colors duration-300" />
                      </div>
                    </div>
                    
                    {/* Enhanced number */}
                    <h3 className={`text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300`}>
                      {stat.number}
                    </h3>
                    
                    {/* Enhanced label */}
                    <p className="text-slate-200 font-bold text-xl group-hover:text-white transition-colors duration-300 mb-2">
                      {stat.label}
                    </p>
                    
                    {/* Enhanced description */}
                    <p className="text-slate-400 text-base group-hover:text-slate-300 transition-colors duration-300">
                      {stat.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Enhanced styles */}
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
            opacity: 0.4; 
          }
          50% { 
            transform: translateY(-30px) rotate(180deg); 
            opacity: 0.8; 
          }
        }
        .animate-float {
          animation: float ease-in-out infinite;
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }

        @keyframes slideInUp {
          0% {
            opacity: 0;
            transform: translateY(50px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideInUp {
          animation: slideInUp 0.8s ease-out forwards;
        }

        @keyframes gradient {
          0%, 100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }

        @keyframes pulseGlow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(99, 102, 241, 0.4);
          }
          50% {
            box-shadow: 0 0 40px rgba(99, 102, 241, 0.8);
          }
        }
        .pulse-glow {
          animation: pulseGlow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
