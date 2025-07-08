import React, { useState, useEffect, useRef } from 'react';
import { Star, Quote } from 'lucide-react';
import TiltedCard from '../Style/Title';

// Custom Carousel components
const Carousel = ({ children, opts = {}, className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      {children}
    </div>
  );
};

const CarouselContent = ({ children, className = '' }) => {
  return (
    <div className={`flex overflow-hidden ${className}`}>
      {children}
    </div>
  );
};

const CarouselItem = ({ children, className = '' }) => {
  return (
    <div className={`flex-shrink-0 ${className}`}>
      {children}
    </div>
  );
};

const CarouselPrevious = ({ className = '', ...props }) => {
  return (
    <button 
      className={`absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center border ${className}`}
      {...props}
    >
      ←
    </button>
  );
};

const CarouselNext = ({ className = '', ...props }) => {
  return (
    <button 
      className={`absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center border ${className}`}
      {...props}
    >
      →
    </button>
  );
};

// Custom Avatar components
const Avatar = ({ children, className = '' }) => {
  return (
    <div className={`relative inline-block rounded-full overflow-hidden ${className}`}>
      {children}
    </div>
  );
};

const AvatarImage = ({ src, alt, className = '' }) => {
  return (
    <img src={src} alt={alt} className={`w-full h-full object-cover ${className}`} />
  );
};

const AvatarFallback = ({ children, className = '' }) => {
  return (
    <div className={`flex items-center justify-center w-full h-full bg-gray-200 text-gray-700 font-medium ${className}`}>
      {children}
    </div>
  );
};

// Course data
const courseImages = [
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop',
];

const courseTitles = [
  "Full-Stack Web Development",
  "UI/UX Design Fundamentals", 
  "Python for Data Science",
  "Machine Learning with Python",
  "React & Redux Bootcamp",
  "Cybersecurity Essentials",
  "Cloud Computing with AWS",
  "Digital Marketing Strategy",
  "Blockchain Basics"
];

const instructors = [
  "Sarah Johnson", "Mike Chen", "Dr. Emily Davis", "Alex Rodriguez", 
  "Jessica Kim", "David Thompson", "Maria Garcia", "James Wilson", "Lisa Anderson"
];

const studentReviews = [
  {
    name: "Alex Thompson",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    course: "Full-Stack Web Development",
    rating: 5,
    review: "This course completely transformed my career! The hands-on projects and expert guidance helped me land my dream job as a software developer.",
    achievement: "Now working at Google"
  },
  {
    name: "Priya Patel",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    course: "UI/UX Design Fundamentals",
    rating: 5,
    review: "The design principles I learned here are invaluable. The instructor's feedback was detailed and helped me build an amazing portfolio.",
    achievement: "Freelancing successfully"
  },
  {
    name: "Marcus Johnson",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    course: "Python for Data Science",
    rating: 5,
    review: "From zero to data scientist! The course structure is perfect for beginners, and the real-world projects gave me confidence.",
    achievement: "Data Analyst at Microsoft"
  },
  {
    name: "Emma Rodriguez",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    course: "Digital Marketing Strategy",
    rating: 5,
    review: "Incredible ROI on this investment! I've increased my client's revenue by 300% using the strategies taught in this course.",
    achievement: "Marketing Director"
  },
  {
    name: "James Park",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    course: "Machine Learning with Python",
    rating: 5,
    review: "The complex concepts were explained so clearly. I'm now building ML models for my company and leading AI initiatives.",
    achievement: "ML Engineer at Tesla"
  },
  {
    name: "Sophie Chen",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    course: "Cybersecurity Essentials",
    rating: 5,
    review: "Security is more important than ever. This course gave me the skills to protect businesses and pursue my passion for cybersecurity.",
    achievement: "Security Analyst"
  }
];

export default function Rotation() {
  const [isHovered, setIsHovered] = useState(false);
  const [isTouching, setIsTouching] = useState(false);
  const carouselRef = useRef(null);

  const handleScroll = () => {
    if (!carouselRef.current || isHovered || isTouching) return;

    const container = carouselRef.current;
    const scrollWidth = container.scrollWidth;
    const containerWidth = container.clientWidth;

    if (container.scrollLeft >= scrollWidth / 2 - containerWidth) {
      container.scrollTo({ left: 0, behavior: 'auto' });
    } else {
      container.scrollBy({ left: 2, behavior: 'auto' });
    }
  };

  useEffect(() => {
    const interval = setInterval(handleScroll, 20);
    return () => clearInterval(interval);
  }, [isHovered, isTouching]);

  const renderCourseCard = (image, index) => (
    <div
      key={index}
      className="flex-shrink-0 w-80 mx-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsTouching(true)}
      onTouchEnd={() => setIsTouching(false)}
    >
      <TiltedCard
        imageSrc={image}
        altText={courseTitles[index % courseTitles.length]}
        captionText={courseTitles[index % courseTitles.length]}
        containerHeight="240px"
        containerWidth="100%"
        imageHeight="240px"
        imageWidth="100%"
        rotateAmplitude={12}
        scaleOnHover={1.1}
        showMobileWarning={false}
        showTooltip={true}
        displayOverlayContent={true}
        
      />
      <div className="p-6 space-y-3 bg-white rounded-b-lg shadow-lg border-t-0">
        <h3 className="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
          {courseTitles[index % courseTitles.length]}
        </h3>
        <p className="text-sm text-gray-600">
          By {instructors[index % instructors.length]}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-blue-600">₹2,999</span>
          <span className="text-sm text-gray-500 line-through">₹9,999</span>
        </div>
      </div>
    </div>
  );

  const renderReviewCard = (review, index) => (
    <div className="w-96 mr-4 h-80 bg-gradient-to-br from-white to-blue-50 border-l-4 border-l-blue-500 hover:shadow-xl transition-all duration-300">
      <div className="p-6 h-full flex flex-col justify-between">
        <div>
          <Quote className="text-blue-500 mb-4" size={24} />
          <p className="text-gray-700 mb-4 leading-relaxed text-sm">
            "{review.review}"
          </p>
          <div className="flex items-center space-x-1 mb-3">
            {[...Array(review.rating)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Avatar className="w-12 h-12">
            <AvatarImage src={review.avatar} alt={review.name} />
            <AvatarFallback>{review.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-semibold text-gray-800">{review.name}</h4>
            <p className="text-sm text-blue-600 font-medium">{review.achievement}</p>
            <p className="text-xs text-gray-500">{review.course}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Featured Courses Section */}
      <div className="w-full  py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Featured Courses
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our most popular courses taught by industry experts
          </p>
        </div>

        <div className="relative overflow-hidden">
          <div
            ref={carouselRef}
            className="flex items-center space-x-2 overflow-x-auto hide-scrollbar py-8 px-8"
            style={{
              scrollBehavior: 'smooth',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {[...Array(3)].flatMap((_, i) =>
              courseImages.map((img, idx) => renderCourseCard(img, idx + i * courseImages.length))
            )}
          </div>
        </div>
      </div>

      {/* Student Success Stories Section */}
      <div className="w-full py-16 bg-gradient-to-r from-blue-900 to-purple-900">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Student Success Stories
          </h2>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">
            Real transformations from real students who achieved their dreams
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-4">
          <Carousel className="w-full">
            <CarouselContent className="-ml-2 md:-ml-4">
              {studentReviews.map((review, index) => (
                <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  {renderReviewCard(review, index)}
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="text-white border-white hover:bg-white hover:text-blue-900" />
            <CarouselNext className="text-white border-white hover:bg-white hover:text-blue-900" />
          </Carousel>
        </div>
      </div>

      {/* Stats Section */}
      <div className="w-full py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <h3 className="text-4xl font-bold text-blue-600">10,000+</h3>
              <p className="text-gray-600">Students Enrolled</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-4xl font-bold text-blue-600">95%</h3>
              <p className="text-gray-600">Success Rate</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-4xl font-bold text-blue-600">500+</h3>
              <p className="text-gray-600">Expert Instructors</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-4xl font-bold text-blue-600">50+</h3>
              <p className="text-gray-600">Course Categories</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
}