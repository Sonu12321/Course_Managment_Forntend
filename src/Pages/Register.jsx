import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerStudent, resetAuthState } from "../store/authSlice";
// import { FaEnvelope, FaLock } from "react-icons/fa";
import { FaEnvelope, FaUser, FaLock, FaImage } from "react-icons/fa";


const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, error: authError, success } = useSelector((state) => state.auth);
  
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    profileImage: null
  });

  const { firstname, lastname, password, email } = form;

  useEffect(() => {
    // Reset auth state when component mounts
    dispatch(resetAuthState());
    
    // Navigate to verification page if registration was successful
    if (success) {
      navigate('/Login');
    }
    
    // Set local error state from Redux error
    if (authError) {
      setError(authError);
    }
  }, [success, authError, dispatch, navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setError("");

    if (name === "profileImage") {
      setForm((prevData) => ({
        ...prevData,
        [name]: files[0]
      }));
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
      role: 'user', // Default role
      profileImage: form.profileImage
    };

    dispatch(registerStudent(userData));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="bg-white/10  p-8 rounded-3xl shadow-2xl border border-white/20 relative overflow-hidden">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-4 shadow-lg">
                          <FaLock className="h-8 w-8 text-white" />
                        </div>
          <h1 className="text-3xl text-gray-900 font-bold font-serif">
            Register Yourself
          </h1>
          <p className="mt-2 text-gray-600">Create your account to get started</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg text-center border-l-4 border-red-500 shadow-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
  <div className="space-y-4">
    {/* Email */}
    <div className="relative group">
      <FaEnvelope className="absolute left-4 top-4 h-5 w-5 text-purple-400 group-focus-within:text-purple-300 transition-colors duration-200" />
      <input
        type="email"
        placeholder="Email Address"
        name="email"
        value={email}
        onChange={handleChange}
        className="w-full pl-12 pr-4 py-4 bg-white/5  border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 shadow-lg text-black placeholder-gray-400 hover:bg-white/10"
        required
      />
    </div>

    {/* First and Last Name */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="relative group">
        <FaUser className="absolute left-4 top-4 h-5 w-5 text-purple-400 group-focus-within:text-purple-300 transition-colors duration-200" />
        <input
          type="text"
          placeholder="First Name"
          name="firstname"
          value={firstname}
          onChange={handleChange}
          className="w-full pl-12 pr-4 py-4 bg-white/5  border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 shadow-lg text-black placeholder-gray-400 hover:bg-white/10"
          required
        />
      </div>
      <div className="relative group">
        <FaUser className="absolute left-4 top-4 h-5 w-5 text-purple-400 group-focus-within:text-purple-300  duration-200" />
        <input
          type="text"
          placeholder="Last Name"
          name="lastname"
          value={lastname}
          onChange={handleChange}
          className="w-full pl-12 pr-4 py-4 bg-white/5  border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 shadow-lg text-black placeholder-gray-400 hover:bg-white/10"
          required
        />
      </div>
    </div>

    {/* Password */}
    <div className="relative group">
      <FaLock className="absolute left-4 top-4 h-5 w-5 text-purple-400 group-focus-within:text-purple-300 transition-colors duration-200" />
      <input
        type="password"
        placeholder="Password"
        name="password"
        value={password}
        onChange={handleChange}
        className="w-full pl-12 pr-4 py-4 bg-white/5  border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 shadow-lg text-black placeholder-gray-400 hover:bg-white/10"
        required
      />
    </div>

    {/* Profile Image */}
    <div className="mt-4 relative group">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Profile Image
      </label>
      <FaImage className="absolute left-4 top-12 h-5 w-5 text-purple-400 group-focus-within:text-purple-300 transition-colors duration-200 z-10" />
      <div className="relative">
        <input
          type="file"
          name="profileImage"
          accept="image/*"
          onChange={handleChange}
          className="w-full px-12 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          required
        />
      </div>
    </div>
  </div>

  {/* Submit Button */}
  <div className="pt-2">
    <button
      type="submit"
      disabled={isLoading}
      className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-white text-sm font-medium shadow-md transition duration-300 ${
        isLoading
          ? "bg-blue-300 cursor-not-allowed"
          : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 hover:shadow-lg"
      }`}
    >
      {isLoading ? (
        <span className="flex items-center">
          <svg
            className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Registering...
        </span>
      ) : (
        "Register"
      )}
    </button>
  </div>

  {/* Already have an account */}
  <div className="text-center mt-4 text-sm text-gray-600">
    Already have an account?{" "}
    <a
      href="/login"
      className="font-medium text-blue-600 hover:text-blue-500 transition duration-200"
    >
      Sign in
    </a>
  </div>
</form>

      </div>
    </div>
  );
};

export default Register;