import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { InputBox, Button } from '../../Components/Contianer';
import api from '../../Utils/api';
import { Loader2, User, Mail, BookOpen, Award, Lock, Upload, Camera } from 'lucide-react';

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
        } catch (error) {
            navigate('/login');
        }
    }, [token, navigate]);

    const fetchProfile = async () => {
        try {
            const response = await axios.get('https://course-creation-backend.onrender.com/api/users/professors/profile', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (response.data.success && response.data.professor) {
                setProfile(prev => ({
                    ...prev,
                    firstName: response.data.professor.firstname,
                    lastName: response.data.professor.lastname,
                    email: response.data.professor.email,
                    bio: response.data.professor.bio || '',
                    expertise: response.data.professor.expertise || '',
                }));
                
                if (response.data.professor.profileImage) {
                    setImagePreview(response.data.professor.profileImage);
                }
            } else {
                setError("Failed to fetch profile data");
            }
        } catch (error) {
            console.error("Profile fetch error:", error);
            setError("Failed to fetch profile: " + (error.response?.data?.message || error.message));
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
            const response = await axios.put('https://course-creation-backend.onrender.com/api/users/professors/update', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.success) {
                setSuccess(response.data.message);
                setProfile(prev => ({ 
                    ...prev, 
                    currentPassword: '', 
                    newPassword: '' 
                }));
                fetchProfile(); // Refresh profile data after update
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            setError(error.response?.data?.message || "Error updating profile");
        } finally {
            setLoading(false);
        }
    };

    const handleImageClick = () => {
        setShowImageInput(!showImageInput);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfile({ ...profile, profileImage: file });
            setImagePreview(URL.createObjectURL(file));
            setShowImageInput(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Professor Profile</h1>
                    <Button
                        onClick={() => navigate('/professorcourses')}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 transition-colors"
                    >
                        Back to Courses
                    </Button>
                </div>
                
                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center mb-6 shadow-sm border border-red-200 animate-fadeIn">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="bg-green-50 text-green-600 p-4 rounded-lg text-center mb-6 shadow-sm border border-green-200 animate-fadeIn">
                        {success}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Column - Profile Image */}
                    <div className="md:col-span-1">
                        <div className="bg-white p-6 rounded-xl shadow-md">
                            <div className="flex flex-col items-center">
                                <div 
                                    className="w-40 h-40 rounded-full bg-gray-200 overflow-hidden cursor-pointer relative border-4 border-white shadow-lg mb-4"
                                    onClick={handleImageClick}
                                >
                                    {imagePreview ? (
                                        <img 
                                            src={imagePreview} 
                                            alt="Profile" 
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-blue-50">
                                            <User size={60} className="text-blue-300" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all flex items-center justify-center">
                                        <div className="bg-white p-2 rounded-full opacity-0 hover:opacity-100 transition-opacity">
                                            <Camera size={20} className="text-blue-600" />
                                        </div>
                                    </div>
                                </div>
                                
                                <h2 className="text-xl font-bold text-gray-800">
                                    {profile.firstName} {profile.lastName}
                                </h2>
                                <p className="text-gray-500 mb-4">{profile.email}</p>
                                
                                {showImageInput && (
                                    <div className="mt-2 w-full">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Update Profile Photo</label>
                                        <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors">
                                            <Upload className="mx-auto h-8 w-8 text-gray-400 mb-1" />
                                            <p className="text-xs text-gray-500">Click to browse files</p>
                                            <input
                                                type="file"
                                                onChange={handleImageChange}
                                                accept="image/*"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Profile Form */}
                    <div className="md:col-span-2">
                        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md">
                            <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">Personal Information</h2>
                            
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <User size={16} className="text-gray-400" />
                                            </div>
                                            <InputBox
                                                value={profile.firstName}
                                                onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                                                className="pl-10"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <User size={16} className="text-gray-400" />
                                            </div>
                                            <InputBox
                                                value={profile.lastName}
                                                onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                                                className="pl-10"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail size={16} className="text-gray-400" />
                                        </div>
                                        <InputBox
                                            type="email"
                                            value={profile.email}
                                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                            className="pl-10"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                                    <div className="relative">
                                        <div className="absolute top-3 left-3 pointer-events-none">
                                            <BookOpen size={16} className="text-gray-400" />
                                        </div>
                                        <textarea
                                            value={profile.bio}
                                            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                            className="w-full px-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            rows={4}
                                            placeholder="Tell students about yourself, your background, and teaching style..."
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Areas of Expertise</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Award size={16} className="text-gray-400" />
                                        </div>
                                        <InputBox
                                            value={profile.expertise}
                                            onChange={(e) => setProfile({ ...profile, expertise: e.target.value })}
                                            className="pl-10"
                                            placeholder="e.g., Machine Learning, Web Development, Data Science"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-200">
                                    <h3 className="text-lg font-medium text-gray-800 mb-4">Password Update</h3>
                                    
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Lock size={16} className="text-gray-400" />
                                                </div>
                                                <InputBox
                                                    type="password"
                                                    value={profile.currentPassword || ''}
                                                    onChange={(e) => setProfile({ ...profile, currentPassword: e.target.value })}
                                                    className="pl-10"
                                                    placeholder="Required for password change"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Lock size={16} className="text-gray-400" />
                                                </div>
                                                <InputBox
                                                    type="password"
                                                    value={profile.newPassword || ''}
                                                    onChange={(e) => setProfile({ ...profile, newPassword: e.target.value })}
                                                    className="pl-10"
                                                    placeholder="Leave blank to keep current password"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8">
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 transition-colors"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center">
                                            <Loader2 className="animate-spin mr-2" size={18} />
                                            Updating Profile...
                                        </span>
                                    ) : "Update Profile"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfessorProfile;