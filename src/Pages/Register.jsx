import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerStudent, resetAuthState } from "../store/authSlice";
import { FaEnvelope, FaUser, FaLock, FaImage, FaEye, FaEyeSlash } from "react-icons/fa";
import { Zap, Sparkles, UserPlus, ArrowRight, Upload, Shield } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, error: authError, success } = useSelector((state) => state.auth);
  
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [particles, setParticles] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [form, setForm] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    profileImage: null
  });

  const { firstname, lastname, password, email } = form;

  // Generate floating particles
  useEffect(() => {
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

  useEffect(() => {
    dispatch(resetAuthState());
    
    if (success) {
      navigate('/Login');
    }
    
    if (authError) {
      setError(authError);
    }
  }, [success, authError, dispatch, navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setError("");

    if (name === "profileImage") {
      const file = files[0];
      setForm((prevData) => ({
        ...prevData,
        [name]: file
      }));

      // Create image preview
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setImagePreview(null);
      }
    } else {
      setForm((prevData) => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const userData = {
      firstname,
      lastname,
      email,
      password,
      role: 'user',
      profileImage: form.profileImage
    };

    dispatch(registerStudent(userData));
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

      {/* COMPACT: Main registration container - Increased width for better proportions */}
      <div className="relative z-10 w-full max-w-2xl">
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
              <UserPlus className="h-8 w-8 text-white relative z-10 group-hover:scale-110 transition-transform duration-300" />
            </div>

            {/* Welcome Text - Reduced spacing */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-sky-500/20 to-indigo-500/20 border border-sky-400/30 backdrop-blur-sm">
                <Sparkles className="w-4 h-4 text-sky-400 animate-pulse" />
                <span className="text-sky-200 font-bold text-sm uppercase tracking-wider">Join The Future</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Create{' '}
                <span className="bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  Account
                </span>
              </h1>
              
              <p className="text-base text-slate-300 font-medium">
                Begin your quantum learning journey
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
          
          {/* COMPACT: Registration Form */}
          <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
            {/* COMPACT: Two-column layout for better space usage */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                {/* Email Field */}

                {/* First Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-sky-200">
                    First Name
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                      <FaUser className="h-5 w-5 text-sky-400 group-focus-within:text-sky-300 transition-colors duration-300" />
                    </div>
                    <input
                      type="text"
                      placeholder="First name"
                      name="firstname"
                      value={firstname}
                      onChange={handleChange}
                      className="
                        relative  w-full pl-12 pr-4 py-3
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
                      value={email}
                      onChange={handleChange}
                      className="
                        relative  w-full pl-12 pr-4 py-3
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
                {/* Password Field */}
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
                      placeholder="Create a password"
                      name="password"
                      value={password}
                      onChange={handleChange}
                      className="
                        relative  w-full pl-12 pr-12 py-3
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
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Last Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-sky-200">
                    Last Name
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                      <FaUser className="h-5 w-5 text-sky-400 group-focus-within:text-sky-300 transition-colors duration-300" />
                    </div>
                    <input
                      type="text"
                      placeholder="Last name"
                      name="lastname"
                      value={lastname}
                      onChange={handleChange}
                      className="
                        relative  w-full pl-12 pr-4 py-3
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

                {/* COMPACT: Profile Image Upload */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-sky-200">
                    Profile Image
                  </label>
                  <div className="relative group">
                    <div className="
                      w-full p-4 border-2 border-dashed border-sky-400/30 
                      rounded-xl bg-gradient-to-r from-slate-700/30 to-slate-600/30 
                      backdrop-blur-sm hover:border-sky-300/50 
                      transition-all duration-300 group-hover:bg-sky-400/5
                      h-32 flex flex-col items-center justify-center
                    ">
                      {imagePreview ? (
                        <div className="flex flex-col items-center space-y-2">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden border-2 border-sky-400/30">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <p className="text-sky-200 text-xs font-medium">Image selected</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center space-y-2">
                          <div className="p-3 rounded-xl bg-gradient-to-br from-sky-500/20 to-indigo-500/20 border border-sky-400/30">
                            <Upload className="h-6 w-6 text-sky-400" />
                          </div>
                          <div className="text-center">
                            <p className="text-sky-200 font-medium text-xs">Upload Photo</p>
                            <p className="text-slate-400 text-xs">PNG, JPG</p>
                          </div>
                        </div>
                      )}
                      
                      <input
                        type="file"
                        name="profileImage"
                        accept="image/*"
                        onChange={handleChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* COMPACT: Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
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
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5" />
                      Create Account
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </>
                  )}
                </span>
              </button>
            </div>
          </form>
          
          {/* COMPACT: Sign In Link */}
          <div className="relative z-10 text-center pt-4 border-t border-sky-400/20">
            <p className="text-slate-400">
              Already have an account?{" "}
              <button
                onClick={() => navigate('/login')}
                className="font-bold text-sky-300 hover:text-sky-200 transition-colors duration-300 hover:underline"
              >
                Sign In
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

export default Register;
