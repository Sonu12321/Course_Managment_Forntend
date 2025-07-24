import React from 'react';
import { Link } from 'react-router-dom';
import { FaGraduationCap, FaBook, FaUsers, FaChalkboardTeacher, FaRocket, FaStar } from 'react-icons/fa';
import { Zap, ArrowRight, Sparkles } from 'lucide-react';
import img from '../public/LandingPage.jpg'
import Rotation from '../Components/DashBoardComponents/Rotation';
import BlurText from '../Components/Style/ShinyText';
import FadeContent from '../Components/Style/Fade';

const Dashboard = () => {
  const features = [
    {
      icon: <FaGraduationCap className="text-4xl text-sky-400" />,
      title: "Quality Education",
      description: "Access to premium courses taught by industry experts with cutting-edge curriculum",
      gradient: "from-sky-500/10 to-cyan-500/10"
    },
    {
      icon: <FaBook className="text-4xl text-cyan-400" />,
      title: "Diverse Courses",
      description: "Wide range of subjects from technology to creative arts and business",
      gradient: "from-cyan-500/10 to-blue-500/10"
    },
    {
      icon: <FaUsers className="text-4xl text-blue-400" />,
      title: "Global Community",
      description: "Connect with learners worldwide and build lasting professional networks",
      gradient: "from-blue-500/10 to-indigo-500/10"
    },
    {
      icon: <FaChalkboardTeacher className="text-4xl text-indigo-400" />,
      title: "Expert Instructors",
      description: "Learn from industry leaders and renowned professionals in their fields",
      gradient: "from-indigo-500/10 to-purple-500/10"
    }
  ];

  const stats = [
    { number: "50K+", label: "Active Students", icon: <FaUsers className="text-sky-400" /> },
    { number: "1K+", label: "Expert Courses", icon: <FaBook className="text-cyan-400" /> },
    { number: "95%", label: "Success Rate", icon: <FaStar className="text-yellow-400" /> },
    { number: "24/7", label: "Support", icon: <Zap className="text-green-400" /> }
  ];

  const handleAnimationComplete = () => {
    console.log('Animation completed!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Floating background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-sky-400/5 animate-float"
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

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative z-10 lg:flex lg:items-center lg:gap-12 pt-16 pb-20">
            <div className="relative lg:w-1/2">
              <main className="mt-10 sm:mt-12 md:mt-16 lg:mt-20 xl:mt-28">
                <div className="sm:text-center lg:text-left">
                  {/* Hero Title */}
                  <div className="space-y-4">
                    <BlurText
                      text="Transform Your Future with"
                      delay={150}
                      animateBy="words"
                      direction="top"
                      onAnimationComplete={handleAnimationComplete}
                      className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white"
                    />
                    <BlurText
                      text="Next-Gen Learning"
                      delay={300}
                      animateBy="words"
                      direction="top"
                      onAnimationComplete={handleAnimationComplete}
                      className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent"
                    />
                  </div>

                  {/* Hero Description */}
                  <p className="mt-6 text-lg sm:text-xl text-sky-100/80 leading-relaxed max-w-2xl sm:mx-auto lg:mx-0">
                    Embark on a revolutionary journey of knowledge and growth. Access world-class education 
                    with cutting-edge technology, from anywhere in the universe.
                  </p>

                  {/* CTA Buttons */}
                  <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4 sm:justify-center lg:justify-start">
                    {/* Primary CTA */}
                    <Link
                      to="/Cards"
                      className="
                        group relative overflow-hidden px-8 py-4 
                        bg-gradient-to-r from-sky-500 to-cyan-500 
                        text-white font-bold text-lg rounded-2xl
                        border border-sky-300/30 hover:border-sky-200/50
                        hover:from-sky-400 hover:to-cyan-400 
                        hover:shadow-[0_0_30px_rgba(56,189,248,0.5)]
                        transform hover:scale-105 active:scale-95
                        transition-all duration-300 flex items-center justify-center gap-3
                      "
                    >
                      <Sparkles className="w-5 h-5" />
                      <span>Explore Courses</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                      
                      {/* Shine effect */}
                      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700"></div>
                    </Link>

                    {/* Secondary CTA */}
                    <Link 
                      to="/register" 
                      className="
                        group px-8 py-4 font-bold text-lg rounded-2xl
                        text-sky-200 bg-sky-400/10 border border-sky-400/30
                        hover:text-white hover:bg-sky-400/20 hover:border-sky-300/50
                        hover:shadow-[0_0_20px_rgba(56,189,248,0.3)]
                        transform hover:scale-105 active:scale-95
                        transition-all duration-300 flex items-center justify-center gap-3
                        backdrop-blur-sm
                      "
                    >
                      <FaRocket className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                      <span>Get Started</span>
                    </Link>
                  </div>

                  {/* Stats Row */}
                  <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                      <div key={index} className="text-center lg:text-left">
                        <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                          {stat.icon}
                          <div className="text-2xl font-bold text-white">{stat.number}</div>
                        </div>
                        <div className="text-sm text-sky-200/70">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </main>
            </div>

            {/* Image Section */}
            <div className="hidden lg:block lg:w-1/2 mt-12 lg:mt-0">
              <div className="relative">
                <FadeContent blur={true} duration={1000} easing="ease-out" initialOpacity={0}>
                  <div className="relative group">
                    <img 
                      src={img} 
                      alt="Futuristic Learning Platform" 
                      className="
                        w-full h-[500px] object-cover rounded-3xl 
                        border border-sky-400/20 shadow-2xl shadow-sky-500/20
                        transform group-hover:scale-105 transition-all duration-700 ease-out
                      "
                    />
                    
                    {/* Image overlay effects */}
                    <div className="absolute inset-0 bg-gradient-to-t from-sky-500/20 via-transparent to-cyan-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-sky-400/30 rounded-3xl transition-all duration-700"></div>
                  </div>
                </FadeContent>
                
                {/* Floating decorative elements */}
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-br from-sky-400/20 to-cyan-400/10 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute -top-16 -right-16 w-40 h-40 bg-gradient-to-br from-cyan-400/15 to-blue-400/10 rounded-full blur-2xl animate-pulse"></div>
                <div className="absolute top-1/2 -left-6 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-indigo-400/10 rounded-full blur-lg animate-bounce"></div>
              </div>
            </div>    
          </div>
        </div>
      </div>

      {/* Rotation Component */}
      <div className="relative z-10">
        <Rotation/>
      </div>

      {/* Features Section */}
      <div className="relative py-20 bg-gradient-to-b from-slate-900/50 to-slate-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-400/10 border border-sky-400/20 mb-6">
              <Zap className="w-4 h-4 text-sky-400" />
              <span className="text-sky-300 font-semibold uppercase tracking-wide text-sm">Features</span>
            </div>
            
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
              A Revolutionary Way to{' '}
              <span className="bg-gradient-to-r from-sky-400 to-cyan-400 bg-clip-text text-transparent">
                Learn
              </span>
            </h2>
            
            <p className="text-xl text-sky-100/70 max-w-3xl mx-auto leading-relaxed">
              Experience the future of education with cutting-edge technology, expert guidance, 
              and a global community of passionate learners.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="group relative"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className={`
                  relative h-full p-8 rounded-3xl border transition-all duration-500
                  bg-gradient-to-br ${feature.gradient} backdrop-blur-sm
                  border-sky-400/20 hover:border-sky-300/40
                  hover:shadow-[0_0_30px_rgba(56,189,248,0.2)]
                  transform hover:scale-105 hover:-translate-y-2
                  overflow-hidden
                `}>
                  {/* Background glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-sky-400/5 to-cyan-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Icon container */}
                  <div className="relative z-10 mb-6">
                    <div className="
                      inline-flex p-4 rounded-2xl 
                      bg-gradient-to-br from-sky-400/10 to-cyan-400/10 
                      border border-sky-400/20 group-hover:border-sky-300/40
                      group-hover:shadow-[0_0_20px_rgba(56,189,248,0.3)]
                      transition-all duration-500
                    ">
                      {feature.icon}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold text-white mb-4 group-hover:text-sky-100 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-sky-100/70 leading-relaxed group-hover:text-sky-100/90 transition-colors duration-300">
                      {feature.description}
                    </p>
                  </div>

                  {/* Hover indicator */}
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-2 group-hover:translate-x-0">
                    <ArrowRight className="w-5 h-5 text-sky-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-sky-400 to-transparent opacity-50"></div>
      
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 0.6; }
        }
        .animate-float {
          animation: float ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
