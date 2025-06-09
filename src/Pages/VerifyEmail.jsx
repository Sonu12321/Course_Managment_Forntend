import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function VerifyEmail() {
  const [verifying, setVerifying] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [manualToken, setManualToken] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get email from location state if available
  const email = location.state?.email || '';

  useEffect(() => {
    // Get token from URL query parameters
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');

    if (token) {
      verifyToken(token);
    }
  }, [location.search, navigate]);

  const verifyToken = async (token) => {
    setVerifying(true);
    setError('');
    
    try {
      if (!token) {
        setError('Verification token is missing');
        setVerifying(false);
        return;
      }

      // Send verification request to backend
      const response = await axios.post(
        'https://course-creation-backend.onrender.com/api/users/verify-email',
        { token }
      );

      if (response.data.success) {
        setSuccess(true);
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Verification failed. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  const handleManualVerification = (e) => {
    e.preventDefault();
    verifyToken(manualToken);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-300 to-white py-14 px-8 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto space-y-6 bg-white p-8 rounded-xl shadow-lg border border-blue-100">
        <div className="text-center">
          {verifying ? (
            <>
              <div className="flex justify-center">
                <svg className="animate-spin h-12 w-12 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <h1 className="mt-4 text-2xl text-gray-900 font-bold">Verifying Your Email</h1>
              <p className="mt-2 text-gray-600">Please wait while we verify your email address...</p>
            </>
          ) : success ? (
            <>
              <svg className="mx-auto h-16 w-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <h1 className="mt-4 text-2xl text-gray-900 font-bold">Email Verified Successfully!</h1>
              <p className="mt-2 text-gray-600">Your email has been verified. You will be redirected to the login page in a few seconds.</p>
              <div className="mt-6">
                <button
                  onClick={() => navigate('/login')}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-white text-lg font-semibold bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 hover:shadow-lg transition duration-300"
                >
                  Go to Login
                </button>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-2xl text-gray-900 font-bold">Email Verification</h1>
              {email && (
                <p className="mt-2 text-gray-600">
                  We've sent a verification code to <span className="font-medium">{email}</span>.
                  Please check your inbox and enter the code below.
                </p>
              )}
              {!email && (
                <p className="mt-2 text-gray-600">Enter the verification token sent to your email</p>
              )}
              
              {error && (
                <div className="mt-4 p-3 bg-red-50 text-red-500 rounded-lg border border-red-100">
                  <svg className="mx-auto h-8 w-8 text-red-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <p>{error}</p>
                </div>
              )}
              
              <form onSubmit={handleManualVerification} className="mt-6">
                <div className="mb-4">
                  <input
                    type="text"
                    value={manualToken}
                    onChange={(e) => setManualToken(e.target.value)}
                    placeholder="Enter verification token"
                    className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-white text-lg font-semibold bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 hover:shadow-lg transition duration-300"
                >
                  Verify Email
                </button>
              </form>
              
              <div className="mt-6">
                <button
                  onClick={() => navigate('/register')}
                  className="w-full flex justify-center py-2 px-4 border border-blue-300 rounded-lg text-blue-600 text-md font-medium bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300"
                >
                  Back to Registration
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;