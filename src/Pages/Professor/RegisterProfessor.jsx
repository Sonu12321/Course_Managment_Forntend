import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { FaEnvelope, FaUser, FaLock, FaImage, FaEye, FaEyeSlash, FaGraduationCap } from "react-icons/fa";
import { Zap, Sparkles, BookOpen, ArrowRight, Upload, GraduationCap, Users, CheckCircle } from 'lucide-react';

function RegisterProfessor() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [registered, setRegistered] = useState(false);
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
  React.useEffect(() => {
    const newParticles = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      opacity: Math.random() * 0.6 + 0.3,
      speed: Math.random() * 2 + 1,
      color: ['sky', 'indigo', 'purple', 'emerald'][Math.floor(Math.random() * 4)]
    }));
    setParticles(newParticles);
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setError("");

    if (name === "profileImage") {
      const file = files[0];
      setForm((prevData) => ({
        ...prevData,
        [name]: file
      }));

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
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append('firstname', firstname);
      formData.append('lastname', lastname);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('role', 'professor');
      formData.append('profileImage', form.profileImage);

      const response = await axios.post('https://course-creation-backend.onrender.com/api/users/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data) {
        toast.success('🎓 Professor registration successful! Please check your email for verification.', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          style: {
            background: 'linear-gradient(135deg, #10b981 0%, #0ea5e9 100%)',
            color: 'white',
            borderRadius: '16px',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            boxShadow: '0 0 30px rgba(16, 185, 129, 0.3)'
          }
        });
        
        setTimeout(() => {
          navigate('/verify-email', { state: { email } });
        }, 1500);
      }
    } catch (error) {
      setError(error.response?.data?.error || "Registration failed. Please try again.");
      
      toast.error('❌ Registration failed. Please check your details and try again.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          background: 'linear-gradient(135deg, #ef4444 0%, #ec4899 100%)',
          color: 'white',
          borderRadius: '16px',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          boxShadow: '0 0 30px rgba(239, 68, 68, 0.3)'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  // Enhanced success state for professors
  if (registered) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className={`absolute rounded-full bg-${particle.color}-400/20 animate-float`}
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

        <div className="relative z-10 w-full max-w-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 via-sky-400/20 to-indigo-400/20 rounded-3xl blur-xl opacity-60 animate-pulse pointer-events-none"></div>
          
          <div className="
            relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 
            backdrop-blur-xl border border-emerald-400/20 
            rounded-3xl shadow-2xl shadow-emerald-500/20 
            p-8 sm:p-10 space-y-6 text-center
          ">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-500 via-sky-500 to-indigo-500 shadow-lg shadow-emerald-500/30 mb-4">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-black text-white">
                Verification Email{' '}
                <span className="bg-gradient-to-r from-emerald-400 via-sky-400 to-indigo-400 bg-clip-text text-transparent">
                  Sent!
                </span>
              </h1>
              
              <p className="text-lg text-slate-300 leading-relaxed max-w-xl mx-auto">
                We've sent a verification email to{' '}
                <span className="font-bold text-sky-300">{email}</span>. 
                Please check your inbox and click the verification link to complete your professor registration.
              </p>
            </div>
            
            <button
              onClick={() => navigate('/login')}
              className="
                group relative w-full max-w-md mx-auto py-4 px-6 
                bg-gradient-to-r from-emerald-500 to-sky-500 
                hover:from-emerald-400 hover:to-sky-400
                text-white font-bold text-lg rounded-2xl
                shadow-lg shadow-emerald-500/30
                hover:shadow-[0_0_40px_rgba(16,185,129,0.6)]
                transform hover:scale-105 active:scale-95
                transition-all duration-300 overflow-hidden
              "
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none"></div>
              <span className="relative z-10 flex items-center justify-center gap-3">
                <GraduationCap className="w-5 h-5" />
                Go to Login
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center py-4 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Enhanced floating background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className={`absolute rounded-full bg-${particle.color}-400/20 animate-float`}
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
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none"></div>

      {/* COMPACT HEIGHT - Main container */}
      <div className="relative z-10 w-full max-w-5xl">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 via-sky-400/20 to-indigo-400/20 rounded-3xl blur-xl opacity-60 animate-pulse pointer-events-none"></div>
        
        <div className="
          relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 
          backdrop-blur-xl border border-emerald-400/20 
          rounded-3xl shadow-2xl shadow-emerald-500/20 
          p-6 sm:p-8 space-y-6 overflow-hidden
          hover:shadow-[0_0_60px_rgba(16,185,129,0.3)]
          transition-all duration-700
        ">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000 pointer-events-none"></div>
          
          {/* COMPACT Header Section */}
          <div className="relative z-10 text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 via-sky-500 to-indigo-500 shadow-lg shadow-emerald-500/30 group hover:scale-110 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-indigo-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              <GraduationCap className="h-8 w-8 text-white relative z-10 group-hover:scale-110 transition-transform duration-300" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/20 to-sky-500/20 border border-emerald-400/30 backdrop-blur-sm">
                <BookOpen className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span className="text-emerald-200 font-bold text-sm uppercase tracking-wider">Educator Portal</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
                First Step To{' '}
                <span className="bg-gradient-to-r from-emerald-400 via-sky-400 to-indigo-400 bg-clip-text text-transparent">
                  Teach The World
                </span>
              </h1>
              
              <p className="text-base text-slate-300 font-medium max-w-2xl mx-auto">
                Join our elite community of educators and inspire minds globally
              </p>
            </div>

            {/* COMPACT Benefits - Single row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 max-w-4xl mx-auto">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-sky-500/10 border border-emerald-400/20 backdrop-blur-sm hover:scale-105 transition-all duration-300">
                <Users className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                <p className="text-emerald-200 text-xs font-semibold">Global Reach</p>
              </div>
              <div className="p-3 rounded-2xl bg-gradient-to-br from-sky-500/10 to-indigo-500/10 border border-sky-400/20 backdrop-blur-sm hover:scale-105 transition-all duration-300">
                <Sparkles className="w-5 h-5 text-sky-400 mx-auto mb-1" />
                <p className="text-sky-200 text-xs font-semibold">Premium Tools</p>
              </div>
              <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-400/20 backdrop-blur-sm hover:scale-105 transition-all duration-300">
                <BookOpen className="w-5 h-5 text-indigo-400 mx-auto mb-1" />
                <p className="text-indigo-200 text-xs font-semibold">Course Builder</p>
              </div>
              <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-400/20 backdrop-blur-sm hover:scale-105 transition-all duration-300">
                <Zap className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                <p className="text-purple-200 text-xs font-semibold">AI Insights</p>
              </div>
            </div>
          </div>
          
          {/* COMPACT Error Message */}
          {error && (
            <div className="
              relative p-4 rounded-2xl overflow-hidden max-w-2xl mx-auto
              bg-gradient-to-r from-red-500/10 to-pink-500/10 
              border border-red-400/20 backdrop-blur-sm
              animate-slideInUp
            ">
              <div className="absolute inset-0 bg-gradient-to-r from-red-400/5 to-pink-400/5 pointer-events-none"></div>
              <div className="relative z-10 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-red-500/20 to-pink-500/20 border border-red-400/30">
                  <Zap className="h-4 w-4 text-red-400" />
                </div>
                <span className="text-red-200 font-medium">{error}</span>
              </div>
            </div>
          )}
          
          {/* COMPACT FORM - Optimized for no scrolling */}
          <form onSubmit={handleSubmit} className="relative z-10 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - 2 fields */}
              <div className="space-y-4">
                {/* Email Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-emerald-200">
                    Academic Email
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                      <FaEnvelope className="h-5 w-5 text-emerald-400 group-focus-within:text-emerald-300 transition-colors duration-300" />
                    </div>
                    <input
                      type="email"
                      placeholder="Enter your academic email"
                      name="email"
                      value={email}
                      onChange={handleChange}
                      className="
                        relative z-20 w-full pl-12 pr-4 py-3
                        bg-gradient-to-r from-slate-700/50 to-slate-600/50 
                        backdrop-blur-sm border border-emerald-400/20 
                        rounded-xl text-white placeholder-slate-400
                        focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-300/50 
                        hover:border-emerald-300/40
                        transition-all duration-300 
                        shadow-lg hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]
                      "
                      required
                    />
                  </div>
                </div>

                {/* First Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-emerald-200">
                    First Name
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                      <FaUser className="h-5 w-5 text-emerald-400 group-focus-within:text-emerald-300 transition-colors duration-300" />
                    </div>
                    <input
                      type="text"
                      placeholder="First name"
                      name="firstname"
                      value={firstname}
                      onChange={handleChange}
                      className="
                        relative z-20 w-full pl-12 pr-4 py-3
                        bg-gradient-to-r from-slate-700/50 to-slate-600/50 
                        backdrop-blur-sm border border-emerald-400/20 
                        rounded-xl text-white placeholder-slate-400
                        focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-300/50 
                        hover:border-emerald-300/40
                        transition-all duration-300 
                        shadow-lg hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]
                      "
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Middle Column - 2 fields */}
              <div className="space-y-4">
                {/* Last Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-emerald-200">
                    Last Name
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                      <FaUser className="h-5 w-5 text-emerald-400 group-focus-within:text-emerald-300 transition-colors duration-300" />
                    </div>
                    <input
                      type="text"
                      placeholder="Last name"
                      name="lastname"
                      value={lastname}
                      onChange={handleChange}
                      className="
                        relative z-20 w-full pl-12 pr-4 py-3
                        bg-gradient-to-r from-slate-700/50 to-slate-600/50 
                        backdrop-blur-sm border border-emerald-400/20 
                        rounded-xl text-white placeholder-slate-400
                        focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-300/50 
                        hover:border-emerald-300/40
                        transition-all duration-300 
                        shadow-lg hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]
                      "
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-emerald-200">
                    Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                      <FaLock className="h-5 w-5 text-emerald-400 group-focus-within:text-emerald-300 transition-colors duration-300" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Create password"
                      name="password"
                      value={password}
                      onChange={handleChange}
                      className="
                        relative z-20 w-full pl-12 pr-12 py-3
                        bg-gradient-to-r from-slate-700/50 to-slate-600/50 
                        backdrop-blur-sm border border-emerald-400/20 
                        rounded-xl text-white placeholder-slate-400
                        focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-300/50 
                        hover:border-emerald-300/40
                        transition-all duration-300 
                        shadow-lg hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]
                      "
                      required
                    />
                    <button 
                      type="button"
                      className="
                        absolute inset-y-0 right-0 pr-4 flex items-center z-30
                        text-slate-400 hover:text-emerald-300 
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

              {/* Right Column - Image Upload */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-emerald-200">
                  Profile Image
                </label>
                <div className="relative group h-32">
                  <div className="
                    w-full h-full p-4 border-2 border-dashed border-emerald-400/30 
                    rounded-xl bg-gradient-to-r from-slate-700/30 to-slate-600/30 
                    backdrop-blur-sm hover:border-emerald-300/50 
                    transition-all duration-300 group-hover:bg-emerald-400/5
                    flex flex-col items-center justify-center
                  ">
                    {imagePreview ? (
                      <div className="flex flex-col items-center space-y-2">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden border-2 border-emerald-400/30">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <p className="text-emerald-200 text-xs font-medium">Image selected</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center space-y-2">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/20 to-sky-500/20 border border-emerald-400/30">
                          <Upload className="h-6 w-6 text-emerald-400" />
                        </div>
                        <div className="text-center">
                          <p className="text-emerald-200 font-medium text-xs">Upload Photo</p>
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
            
            {/* COMPACT Submit Button */}
            <div className="mt-6">
              <button
                type="submit"
                disabled={loading}
                className="
                  group relative w-full py-4 px-6 
                  bg-gradient-to-r from-emerald-500 to-sky-500 
                  hover:from-emerald-400 hover:to-sky-400
                  text-white font-bold text-lg rounded-2xl
                  shadow-lg shadow-emerald-500/30
                  hover:shadow-[0_0_30px_rgba(16,185,129,0.6)]
                  transform hover:scale-105 active:scale-95
                  transition-all duration-300 
                  disabled:opacity-50 disabled:cursor-not-allowed
                  disabled:hover:scale-100 disabled:hover:shadow-lg
                  overflow-hidden
                "
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none"></div>
                
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Joining Faculty...</span>
                    </>
                  ) : (
                    <>
                      <GraduationCap className="w-5 h-5" />
                      <span>Join As Educator</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </>
                  )}
                </span>
              </button>
            </div>
          </form>
          
          {/* COMPACT Sign In Link */}
          <div className="relative z-10 text-center pt-4 border-t border-emerald-400/20 max-w-2xl mx-auto">
            <p className="text-slate-400">
              Already teaching with us?{" "}
              <button
                onClick={() => navigate('/login')}
                className="font-bold text-emerald-300 hover:text-emerald-200 transition-colors duration-300 hover:underline"
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
}

export default RegisterProfessor;
