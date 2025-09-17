import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../store/authSlice';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Zap, Sparkles, Shield, ArrowRight } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [particles, setParticles] = useState([]);

  // Generate floating particles
  React.useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      opacity: Math.random() * 0.6 + 0.2,
      speed: Math.random() * 2 + 1,
    }));
    setParticles(newParticles);
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const resultAction = await dispatch(loginUser(form));
      
      if (loginUser.fulfilled.match(resultAction)) {
        const userRole = resultAction.payload.user.role;
        
        if (userRole === 'admin') {
          navigate('/admin/dashboard');
        } else if (userRole === 'professor') {
          navigate('/ProfessorDashboard');
        } else {
          navigate('/');
        }
      } else if (loginUser.rejected.match(resultAction)) {
        setError(resultAction.payload?.message || "Login failed. Please try again.");
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center py-4 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Floating background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
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
              animationDelay: `${particle.id * 0.2}s`,
              animationDuration: `${particle.speed + 4}s`,
            }}
          />
        ))}
      </div>

      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(56,189,248,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none"></div>

      {/* COMPACT: Main login container - Increased width for better proportions */}
      <div className="relative z-10 w-full max-w-lg">
        {/* Glow effect container */}
        <div className="absolute inset-0 bg-gradient-to-r from-sky-400/20 via-indigo-400/20 to-purple-400/20 rounded-3xl blur-xl opacity-60 animate-pulse pointer-events-none"></div>
        
        <div className="
          relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 
          backdrop-blur-xl border border-sky-400/20 
          rounded-3xl shadow-2xl shadow-sky-500/20 
          p-6 sm:p-8 space-y-6 overflow-hidden
          hover:shadow-[0_0_60px_rgba(56,189,248,0.3)]
          transition-all duration-700
        ">
          {/* Background shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000 pointer-events-none"></div>
          
          {/* COMPACT: Header Section */}
          <div className="relative z-10 text-center space-y-4">
            {/* Logo/Icon - Reduced size */}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 via-indigo-500 to-purple-500 shadow-lg shadow-sky-500/30 mb-2 group hover:scale-110 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-sky-400/20 to-purple-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              <Shield className="h-8 w-8 text-white relative z-10 group-hover:scale-110 transition-transform duration-300" />
            </div>

            {/* Welcome Text - Reduced spacing */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-sky-500/20 to-indigo-500/20 border border-sky-400/30 backdrop-blur-sm">
                <Sparkles className="w-4 h-4 text-sky-400 animate-pulse" />
                <span className="text-sky-200 font-bold text-sm uppercase tracking-wider">Secure Access</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Welcome{' '}
                <span className="bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  Back
                </span>
              </h1>
              
              <p className="text-base text-slate-300 font-medium">
                Access your quantum learning portal
              </p>
            </div>
          </div>
          
          {/* COMPACT: Error Message */}
          {error && (
            <div className="
              relative p-4 rounded-2xl overflow-hidden
              bg-gradient-to-r from-red-500/10 to-pink-500/10 
              border border-red-400/20 backdrop-blur-sm
              animate-slideInUp
            ">
              <div className="absolute inset-0 bg-gradient-to-r from-red-400/5 to-pink-400/5 pointer-events-none"></div>
              <div className="relative z-10 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-red-500/20 to-pink-500/20 border border-red-400/30">
                  <Zap className="h-4 w-4 text-red-400" />
                </div>
                <span className="text-red-200 font-medium">{error}</span>
              </div>
            </div>
          )}
          
          {/* COMPACT: Login Form */}
          <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
            {/* Email Field - Reduced spacing */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-sky-200">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                  <FaEnvelope className="h-5 w-5 text-sky-400 group-focus-within:text-sky-300 transition-colors duration-300" />
                </div>
                <input
                  type="email"
                  placeholder="Enter your email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="
                    relative  w-full pl-12  py-3
                    bg-gradient-to-r from-slate-700/50 to-slate-600/50 
                    backdrop-blur-sm border border-sky-400/20 
                    rounded-xl text-white placeholder-slate-400
                    focus:ring-2 focus:ring-sky-400/50 focus:border-sky-300/50 
                    hover:border-sky-300/40
                    transition-all duration-300 
                    shadow-lg hover:shadow-[0_0_20px_rgba(56,189,248,0.2)]
                  "
                  required
                />
              </div>
            </div>
            
            {/* Password Field - Reduced spacing */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-sky-200">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                  <FaLock className="h-5 w-5 text-sky-400 group-focus-within:text-sky-300 transition-colors duration-300" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="
                    relative  w-full pl-12 pr-12 py-3
                    bg-gradient-to-r from-slate-700/50 to-slate-600/50 
                    backdrop-blur-sm border border-sky-400/20 
                    rounded-xl text-black placeholder-slate-400
                    focus:ring-2 focus:ring-sky-400/50 focus:border-sky-300/50 
                    hover:border-sky-300/40
                    transition-all duration-300 
                    shadow-lg hover:shadow-[0_0_20px_rgba(56,189,248,0.2)]
                  "
                  required
                />
                <button 
                  type="button"
                  className="
                    absolute inset-y-0 right-0 pr-4 flex items-center z-30
                    text-slate-400 hover:text-sky-300 
                    transition-colors duration-300
                  "
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-5 w-5" />
                  ) : (
                    <FaEye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
            
            {/* COMPACT: Remember Me & Forgot Password */}
            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center group cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`
                    w-4 h-4 rounded border-2 transition-all duration-300
                    ${rememberMe 
                      ? 'bg-gradient-to-r from-sky-500 to-indigo-500 border-sky-400/50' 
                      : 'border-sky-400/40 bg-slate-700/50'
                    }
                    group-hover:border-sky-300/60
                  `}>
                    {rememberMe && (
                      <svg className="w-2.5 h-2.5 text-white absolute top-0.5 left-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="ml-2 text-sky-200 font-medium group-hover:text-sky-100 transition-colors duration-300 text-sm">
                  Remember me
                </span>
              </label>
              
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="text-sky-300 hover:text-sky-200 font-medium transition-colors duration-300 hover:underline text-sm"
              >
                Forgot password?
              </button>
            </div>
            
            {/* COMPACT: Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="
                  group relative w-full py-3 px-6 
                  bg-gradient-to-r from-sky-500 to-indigo-500 
                  hover:from-sky-400 hover:to-indigo-400
                  text-white font-bold text-lg rounded-xl
                  shadow-lg shadow-sky-500/30
                  hover:shadow-[0_0_30px_rgba(56,189,248,0.6)]
                  transform hover:scale-105 active:scale-95
                  transition-all duration-300 
                  disabled:opacity-50 disabled:cursor-not-allowed
                  disabled:hover:scale-100 disabled:hover:shadow-lg
                  overflow-hidden
                "
              >
                {/* Button shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none"></div>
                
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Accessing Portal...
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5" />
                      Access Portal
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </>
                  )}
                </span>
              </button>
            </div>
          </form>
          
          {/* COMPACT: Sign Up Link */}
          <div className="relative z-10 text-center pt-4 border-t border-sky-400/20">
            <p className="text-slate-400">
              Don't have an account?{" "}
              <button
                onClick={() => navigate('/register')}
                className="font-bold text-sky-300 hover:text-sky-200 transition-colors duration-300 hover:underline"
              >
                Create Account
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
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
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideInUp {
          animation: slideInUp 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Login;
