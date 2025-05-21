import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function RegisterProfessor() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [registered, setRegistered] = useState(false);
  const [form, setForm] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    profileImage: null
  });

  const { firstname, lastname, password, email } = form;

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
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append('firstname', firstname);
      formData.append('lastname', lastname);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('role', 'professor'); // Default role
      formData.append('profileImage', form.profileImage);

      const response = await axios.post('https://course-creation-backend.onrender.com/api/users/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data) {
        // Instead of setting registered to true, navigate to verification page
        navigate('/verify-email', { state: { email } });
      }
    } catch (error) {
      setError(error.response?.data?.error || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Remove the registered conditional rendering since we're now redirecting
  // to the verification page instead
  if (registered) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-300 to-white py-14 px-8 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto space-y-6 bg-white p-8 rounded-xl shadow-lg border border-blue-100">
          <div className="text-center">
            <svg className="mx-auto h-16 w-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h1 className="mt-4 text-3xl text-gray-900 font-bold font-serif">
              Verification Email Sent!
            </h1>
            <p className="mt-2 text-gray-600">
              We've sent a verification email to <span className="font-medium">{email}</span>. 
              Please check your inbox and click the verification link to complete your registration.
            </p>
          </div>
          <div className="mt-6">
            <button
              onClick={() => navigate('/login')}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-white text-lg font-semibold bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 hover:shadow-lg transition duration-300"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-300 to-white py-14 px-8 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto space-y-6 bg-white p-8 rounded-xl shadow-lg border border-blue-100">
        <div className="text-center">
          <h1 className="text-3xl text-gray-900 font-bold font-serif">
            First Step To Teach The World
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
            <div className="group">
              <input
                type="email"
                placeholder="Email Address"
                name="email"
                value={email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First Name"
                name="firstname"
                value={firstname}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                required
              />
              <input
                type="text"
                placeholder="Last Name"
                name="lastname"
                value={lastname}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                required
              />
            </div>
            
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              required
            />
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Image
              </label>
              <div className="relative">
                <input
                  type="file"
                  name="profileImage"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  required
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-white text-lg font-semibold shadow-md transition duration-300 ${
                loading
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 hover:shadow-lg"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Registering...
                </span>
              ) : (
                "Register"
              )}
            </button>
          </div>
          
          <div className="text-center mt-4 text-sm text-gray-600">
            Already teaching with us?{" "}
            <a href="/login" className="font-medium text-blue-600 hover:text-blue-500 transition duration-200">
              Sign in
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterProfessor;