import React, { useState, useEffect } from 'react'
import { InputBox, Button } from '../../Components/Contianer'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { jwtDecode } from "jwt-decode"
import { Loader2, Upload, X } from 'lucide-react'
import { ToastContainer, toast } from 'react-toastify';

const CourseCreation = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const token = localStorage.getItem('token')
    const [userRole, setUserRole] = useState(null)
    const [form, setForm] = useState({
        title: '',
        description: '',
        price: '',
        category: '',
        duration: '',
        thumbnail: null,
        previewVideo: null,
        videos: [],
        status: 'draft'
    })
    
    // Track video details separately
    const [videoDetails, setVideoDetails] = useState([])
    const [previewFiles, setPreviewFiles] = useState({
        thumbnail: null,
        previewVideo: null
    })

    const notify = () => toast("Wow so easy!");

    useEffect(() => {
        if (!token) {
            navigate('/login')
            return
        }

        try {
            const decoded = jwtDecode(token)
            setUserRole(decoded.role)
            
            if (decoded.role !== 'professor') {
                navigate('/')
                return
            }
        } catch (error) {
            console.error('Token validation error:', error)
            navigate('/login')
        }
    }, [token, navigate])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        // Validate video details if videos are selected
        if (form.videos.length > 0 && videoDetails.length !== form.videos.length) {
            setError("Please provide title and description for all videos")
            setLoading(false)
            return
        }

        const formData = new FormData()
        formData.append('title', form.title)
        formData.append('description', form.description)
        formData.append('price', form.price)
        formData.append('category', form.category)
        formData.append('duration', form.duration)
        formData.append('status', form.status)
        
        if (form.thumbnail) {
            formData.append('thumbnail', form.thumbnail)
        }
        
        if (form.previewVideo) {
            formData.append('previewVideo', form.previewVideo)
        }
        
        // Append each video file separately
        form.videos.forEach((video, index) => {
            formData.append('videos', video)
            
            // You can also append video details if needed
            // These will be available in req.body on the server
            formData.append(`videoTitle_${index}`, videoDetails[index]?.title || video.name)
            formData.append(`videoDescription_${index}`, videoDetails[index]?.description || `Video: ${video.name}`)
        })

        try {
            const response = await axios.post(
                'http://localhost:4569/api/courses/create', 
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`
                    }
                }
            )
            if (response.data.success) {
                // Navigate to professor courses page
                navigate('/professorcourses')
            }
        } catch (error) {
            setError(error.response?.data?.message || "Error creating course")
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleFileChange = (e) => {
        const { name, files } = e.target
        
        if (name === 'videos') {
            // Convert FileList to Array for multiple videos
            const videoArray = Array.from(files)
            
            // For videos, append to existing videos instead of replacing
            const updatedVideos = [...form.videos, ...videoArray]
            
            // Check if exceeding limit
            if (updatedVideos.length > 10) {
                setError(`You can upload a maximum of 10 videos. You already have ${form.videos.length} videos.`)
                return
            }
            
            setForm({
                ...form,
                videos: updatedVideos
            })
            
            // Initialize video details for newly added videos
            const newVideoDetails = videoArray.map(file => ({
                title: file.name.split('.')[0], // Default title from filename
                description: `Video: ${file.name}` // Default description
            }))
            
            setVideoDetails([...videoDetails, ...newVideoDetails])
            setError("")
            
        } else {
            // For thumbnail and preview video
            setForm({
                ...form,
                [name]: files[0]
            })
            
            // Store preview for display
            setPreviewFiles({
                ...previewFiles,
                [name]: URL.createObjectURL(files[0])
            })
        }
    }
    
    const handleVideoDetailChange = (index, field, value) => {
        const updatedDetails = [...videoDetails]
        updatedDetails[index] = {
            ...updatedDetails[index],
            [field]: value
        }
        setVideoDetails(updatedDetails)
    }
    
    const removeVideo = (index) => {
        const updatedVideos = [...form.videos]
        updatedVideos.splice(index, 1)
        
        const updatedDetails = [...videoDetails]
        updatedDetails.splice(index, 1)
        
        setForm({
            ...form,
            videos: updatedVideos
        })
        setVideoDetails(updatedDetails)
    }
    
    const removeFile = (type) => {
        setForm({
            ...form,
            [type]: null
        })
        
        setPreviewFiles({
            ...previewFiles,
            [type]: null
        })
    }

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Create New Course</h1>
                    <Button
                        onClick={() => navigate('/professorcourses')}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 transition-colors"
                    >
                        Cancel
                    </Button>
                </div>
                
                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center mb-6 shadow-sm border border-red-200">
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-xl shadow-md">
                    <div className="space-y-6">
                        {/* Course Basic Information Section */}
                        <div className="pb-6 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Course Information</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Course Title</label>
                                    <InputBox 
                                        value={form.title}
                                        onChange={handleChange}
                                        placeholder="Enter course title"
                                        name="title"
                                        required
                                        className="w-full"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea 
                                        value={form.description}
                                        onChange={handleChange}
                                        name="description"
                                        rows="4"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        placeholder="Describe your course content and what students will learn"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                                        <InputBox 
                                            type="number"
                                            value={form.price}
                                            onChange={handleChange}
                                            placeholder="Enter price"
                                            name="price"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Duration (hours)</label>
                                        <InputBox 
                                            type="number"
                                            value={form.duration}
                                            onChange={handleChange}
                                            placeholder="Course duration"
                                            name="duration"
                                            required
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                        <select
                                            value={form.category}
                                            onChange={handleChange}
                                            name="category"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            required
                                        >
                                            <option value="">Select Category</option>
                                            <option value="Development">Development</option>
                                            <option value="Business">Business</option>
                                            <option value="Finance">Finance</option>
                                            <option value="IT">IT</option>
                                            <option value="Design">Design</option>
                                            <option value="Marketing">Marketing</option>
                                            <option value="Music">Music</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <select
                                        value={form.status}
                                        onChange={handleChange}
                                        name="status"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    >
                                        <option value="draft">Draft</option>
                                        <option value="published">Published</option>
                                    </select>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Draft courses are only visible to you. Published courses are visible to all users.
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Media Section */}
                        <div className="pb-6 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Course Media</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail</label>
                                    {previewFiles.thumbnail ? (
                                        <div className="relative w-full h-48 mb-2 border rounded-lg overflow-hidden">
                                            <img 
                                                src={previewFiles.thumbnail} 
                                                alt="Thumbnail preview" 
                                                className="w-full h-full object-cover"
                                            />
                                            <button 
                                                type="button"
                                                onClick={() => removeFile('thumbnail')}
                                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center h-48 flex flex-col justify-center hover:bg-gray-50 transition-colors">
                                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                            <p className="mt-1 text-sm text-gray-500">Click to upload thumbnail</p>
                                            <p className="text-xs text-gray-400">Recommended size: 1280x720px</p>
                                            <input 
                                                type="file"
                                                onChange={handleFileChange}
                                                name="thumbnail"
                                                accept="image/*"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                required={!form.thumbnail}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Preview Video</label>
                                    {previewFiles.previewVideo ? (
                                        <div className="relative w-full mb-2 border rounded-lg overflow-hidden">
                                            <video 
                                                src={previewFiles.previewVideo} 
                                                controls
                                                className="w-full h-48 object-cover"
                                            />
                                            <button 
                                                type="button"
                                                onClick={() => removeFile('previewVideo')}
                                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center h-48 flex flex-col justify-center hover:bg-gray-50 transition-colors">
                                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                            <p className="mt-1 text-sm text-gray-500">Click to upload preview video</p>
                                            <p className="text-xs text-gray-400">This video will be available for free</p>
                                            <input 
                                                type="file"
                                                onChange={handleFileChange}
                                                name="previewVideo"
                                                accept="video/*"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                required={!form.previewVideo}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Course Videos Section */}
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Course Videos</h2>
                            <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
                                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                <p className="mt-1 text-sm text-gray-600 font-medium">Click to add course videos</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    You can add videos one by one (Current count: {form.videos.length})
                                </p>
                                <div className="mt-2 flex justify-center">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                        form.videos.length >= 10 ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"
                                    }`}>
                                        {form.videos.length} / 10 videos added
                                    </span>
                                </div>
                                <input 
                                    type="file"
                                    onChange={handleFileChange}
                                    name="videos"
                                    accept="video/*"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    required={form.videos.length === 0}
                                    disabled={form.videos.length >= 10}
                                />
                            </div>
                            
                            {/* Video List with improved UI */}
                            {form.videos.length > 0 && (
                                <div className="mt-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-medium text-gray-800">Uploaded Videos</h3>
                                        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                                            form.videos.length >= 10 ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"
                                        }`}>
                                            {form.videos.length} videos
                                        </span>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        {form.videos.map((video, index) => (
                                            <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-blue-200 transition-colors">
                                                <div className="flex justify-between items-center mb-3">
                                                    <div className="flex items-center">
                                                        <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">
                                                            Video {index + 1}
                                                        </span>
                                                        <span className="font-medium truncate max-w-xs">{video.name}</span>
                                                    </div>
                                                    <button 
                                                        type="button"
                                                        onClick={() => removeVideo(index)}
                                                        className="text-red-500 hover:text-red-700 transition-colors"
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                </div>
                                                
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-500 mb-1">Video Title</label>
                                                        <input
                                                            type="text"
                                                            value={videoDetails[index]?.title || ''}
                                                            onChange={(e) => handleVideoDetailChange(index, 'title', e.target.value)}
                                                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                            placeholder="Video title"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                                                        <input
                                                            type="text"
                                                            value={videoDetails[index]?.description || ''}
                                                            onChange={(e) => handleVideoDetailChange(index, 'description', e.target.value)}
                                                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                            placeholder="Video description"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="pt-4">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 transition-colors"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <Loader2 className="animate-spin mr-2" size={18} />
                                    Creating Course...
                                </span>
                            ) : "Create Course"}
                        </Button>
                        <ToastContainer/>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CourseCreation