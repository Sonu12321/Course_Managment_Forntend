import React, { useState, useEffect } from 'react'
import { InputBox, Button } from '../../Components/Contianer'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { jwtDecode } from "jwt-decode"

const GetCourseUpdateCourse = () => {
    const navigate = useNavigate()
    const { courseId } = useParams()
    const token = localStorage.getItem('token')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [form, setForm] = useState({
        title: '',
        description: '',
        price: '',
        category: '',
        duration: '',
        thumbnail: null,
        previewVideo: null,
        videos: []
    })

    useEffect(() => {
        if (!token) {
            navigate('/login')
            return
        }

        try {
            const decoded = jwtDecode(token)
            if (decoded.role !== 'professor') {
                navigate('/')
                return
            }
            fetchCourseData()
        } catch (error) {
            console.error('Token validation error:', error)
            navigate('/login')
        }
    }, [token, navigate, courseId])

    const fetchCourseData = async () => {
        try {
            const response = await axios.get(`http://localhost:4569/api/courses/professor-courses`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            const course = response.data.courses.find(course => course._id === courseId)
            if (course) {
                setForm({
                    title: course.title,
                    description: course.description,
                    price: course.price,
                    category: course.category,
                    duration: course.duration,
                    thumbnail: null,
                    previewVideo: null,
                    videos: []
                })
            }
        } catch (error) {
            setError("Error fetching course data")
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        const formData = new FormData()
        formData.append('title', form.title)
        formData.append('description', form.description)
        formData.append('price', form.price)
        formData.append('category', form.category)
        formData.append('duration', form.duration)
        if (form.thumbnail) formData.append('thumbnail', form.thumbnail)
        if (form.previewVideo) formData.append('previewVideo', form.previewVideo)
        
        if (form.videos.length > 0) {
            form.videos.forEach((video) => {
                formData.append('videos', video)
            })
        }

        try {
            const response = await axios.put(
                `http://localhost:4569/api/courses/${courseId}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`
                    }
                }
            )
            if (response.data.success) {
                navigate('/dashboard/professor')
            }
        } catch (error) {
            setError(error.response?.data?.message || "Error updating course")
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
        if (e.target.name === 'videos') {
            setForm({
                ...form,
                videos: Array.from(e.target.files)
            })
        } else {
            setForm({
                ...form,
                [e.target.name]: e.target.files[0]
            })
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-center mb-8">Update Course</h1>
                {error && (
                    <div className="bg-red-50 text-red-500 p-3 rounded-lg text-center mb-4">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Course Title</label>
                            <InputBox 
                                value={form.title}
                                onChange={handleChange}
                                placeholder="Enter course title"
                                name="title"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea 
                                value={form.description}
                                onChange={handleChange}
                                name="description"
                                rows="4"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Price</label>
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
                            <label className="block text-sm font-medium text-gray-700">Category</label>
                            <select
                                value={form.category}
                                onChange={handleChange}
                                name="category"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
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

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Duration (in hours)</label>
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
                            <label className="block text-sm font-medium text-gray-700">Update Thumbnail (optional)</label>
                            <input 
                                type="file"
                                onChange={handleFileChange}
                                name="thumbnail"
                                accept="image/*"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Update Preview Video (optional)</label>
                            <input 
                                type="file"
                                onChange={handleFileChange}
                                name="previewVideo"
                                accept="video/*"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Update Course Videos (optional)</label>
                            <input 
                                type="file"
                                onChange={handleFileChange}
                                name="videos"
                                accept="video/*"
                                multiple
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full"
                    >
                        {loading ? "Updating Course..." : "Update Course"}
                    </Button>
                </form>
            </div>
        </div>
    )
}

export default GetCourseUpdateCourse