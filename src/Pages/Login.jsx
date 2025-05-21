import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser, resetAuthState } from '../store/authSlice';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    email: '',
    password: ''
  });

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
      // Using the loginUser thunk from our authSlice
      const resultAction = await dispatch(loginUser(form));
      
      if (loginUser.fulfilled.match(resultAction)) {
        // Check user role from the response
        const userRole = resultAction.payload.user.role;
        
        // Navigate based on user role
        if (userRole === 'admin') {
          navigate('/admin/dashboard');
        } else if (userRole === 'professor') {
          navigate('/ProfessorDashboard');
        } else {
          // Default navigation for regular users
          navigate('/');
        }
      } else if (loginUser.rejected.match(resultAction)) {
        // If login failed, set the error message
        setError(resultAction.payload?.message || "Login failed. Please try again.");
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-300 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto space-y-8 bg-white p-8 rounded-xl shadow-lg border border-blue-100">
        <div className="text-center">
          <h1 className="text-3xl text-gray-900 font-bold font-serif">Welcome Back</h1>
          <p className="mt-2 text-gray-600">Please sign in to your account</p>
        </div>
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-lg text-center">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <input
                type="email"
                placeholder="Email Address"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                required
              />
            </div>
            <div className="relative">
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                required
              />
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-gray-600">
                Remember me
              </label>
            </div>
            <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
              Forgot password?
            </a>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 flex justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 rounded-lg transition duration-300 ease-in-out shadow-md hover:shadow-lg"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
          <div className="text-center mt-4 text-sm text-gray-600">
            Don't have an account?{" "}
            <a href="/register" className="font-medium text-blue-600 hover:text-blue-500">
              Sign up now
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
