import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { InputBox, Button } from '../../Components/Contianer';
import { Loader2, User, Mail, BookOpen, Award, Lock, Upload, Camera } from 'lucide-react';
import { ToastContainer } from 'react-toastify';

const ProfessorProfile = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showImageInput, setShowImageInput] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    bio: '',
    expertise: '',
    profileImage: null,
    currentPassword: '',
    newPassword: ''
  });

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (decoded.role !== 'professor') {
        navigate('/');
        return;
      }
      fetchProfile();
    } catch {
      navigate('/login');
    }
  }, [token, navigate]);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('https://course-creation-backend.onrender.com/api/users/professors/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success && response.data.professor) {
        const prof = response.data.professor;
        setProfile({
          firstName: prof.firstname,
          lastName: prof.lastname,
          email: prof.email,
          bio: prof.bio || '',
          expertise: prof.expertise || '',
          profileImage: null,
          currentPassword: '',
          newPassword: '',
        });
        if (prof.profileImage) setImagePreview(prof.profileImage);
      } else {
        setError("Failed to fetch profile data");
      }
    } catch (error) {
      setError(`Failed to fetch profile: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append('firstName', profile.firstName);
    formData.append('lastName', profile.lastName);
    formData.append('email', profile.email);
    formData.append('bio', profile.bio);
    formData.append('expertise', profile.expertise);
    if (profile.currentPassword) formData.append('currentPassword', profile.currentPassword);
    if (profile.newPassword) formData.append('newPassword', profile.newPassword);
    if (profile.profileImage) formData.append('profileImage', profile.profileImage);

    try {
      const response = await axios.put(
        'https://course-creation-backend.onrender.com/api/users/professors/update',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setSuccess(response.data.message || "Profile updated successfully!");
        setProfile(prev => ({ ...prev, currentPassword: '', newPassword: '' }));
        fetchProfile();
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = () => setShowImageInput(!showImageInput);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile(prev => ({ ...prev, profileImage: file }));
      setImagePreview(URL.createObjectURL(file));
      setShowImageInput(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center py-4 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="w-full max-w-6xl">
        <div className="flex justify-between items-center mb-10 text-white">
          <h1 className="text-3xl font-extrabold select-none">Professor Profile</h1>
          <Button
            onClick={() => navigate('/professorcourses')}
            className="bg-gray-200 hover:bg-gray-300 text-gray-900 transition-colors rounded-lg px-4 py-2 shadow-sm"
          >
            Back to Courses
          </Button>
        </div>

        {error && (
          <div className="bg-red-500/20 text-red-300 p-4 rounded-lg text-center mb-6 border border-red-400 animate-fadeIn">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-500/20 text-green-300 p-4 rounded-lg text-center mb-6 border border-green-400 animate-fadeIn">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Profile Image */}
          <div>
            <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg flex flex-col items-center text-white">
              <div
                onClick={handleImageClick}
                className="w-40 h-40 rounded-full bg-gray-700 overflow-hidden cursor-pointer 
                           relative border-4 border-white/20 shadow-lg flex items-center justify-center 
                           hover:ring-2 hover:ring-blue-500 transition"
                aria-label="Change profile photo"
                role="button"
                tabIndex={0}
                onKeyPress={(e) => e.key === 'Enter' && handleImageClick()}
              >
                {imagePreview ? (
                  <img className="w-full h-full object-cover" src={imagePreview} alt="Profile preview" />
                ) : (
                  <User size={60} className="text-blue-300" />
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 flex items-center justify-center transition-opacity">
                  <Camera size={20} className="text-black opacity-0 group-hover:opacity-100" />
                </div>
              </div>

              <h2 className="mt-4 text-xl font-semibold text-center">
                {profile.firstName} {profile.lastName}
              </h2>
              <p className="text-gray-300 text-center">{profile.email}</p>

              {showImageInput && (
                <div className="mt-6 w-full">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Update Profile Photo</label>
                  <div className="relative border-2 border-dashed border-gray-500 rounded-lg p-6 text-center hover:bg-gray-800 transition-colors cursor-pointer">
                    <Upload className="mx-auto h-8 w-8 text-gray-400 mb-1" />
                    <p className="text-xs text-gray-400">Click to browse files</p>
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={handleImageChange}
                      aria-label="Upload profile photo"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Profile Form */}
          <div className="md:col-span-2">
              <h2 className="text-2xl font-semibold border-b border-gray-500 pb-4">Personal Information</h2>
            <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-lg p-10 rounded-2xl shadow-lg space-y-8 text-black">

              {/* Input Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">First Name</label>
                  <InputBox
                    value={profile.firstName}
                    onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                     className="pl-3 w-full text-black "
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Last Name</label>
                  <InputBox
                    value={profile.lastName}
                    onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                    className="pl-3 w-full text-black"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <InputBox
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="pl-3 w-full text-black"
                  required
                />
              </div>

              
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg shadow-lg transition-colors disabled:opacity-70"
              >
                {loading ? (
                  <span className="flex items-center justify-center space-x-2">
                    <Loader2 className="animate-spin" size={20} />
                    <span>Updating Profile...</span>
                  </span>
                ) : 'Update Profile'}
              </Button>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default ProfessorProfile;
