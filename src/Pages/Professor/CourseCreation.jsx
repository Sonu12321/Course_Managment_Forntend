import React, { useState, useEffect } from 'react'
import { InputBox, Button } from '../../Components/Contianer'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { jwtDecode } from "jwt-decode"
import { Loader2, Upload, X } from 'lucide-react'
import { ToastContainer } from 'react-toastify'

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

  const [videoDetails, setVideoDetails] = useState([])
  const [previewFiles, setPreviewFiles] = useState({
    thumbnail: null,
    previewVideo: null
  })

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

    if (form.thumbnail) formData.append('thumbnail', form.thumbnail)
    if (form.previewVideo) formData.append('previewVideo', form.previewVideo)

    form.videos.forEach((video, index) => {
      formData.append('videos', video)
      formData.append(`videoTitle_${index}`, videoDetails[index]?.title || video.name)
      formData.append(`videoDescription_${index}`, videoDetails[index]?.description || `Video: ${video.name}`)
    })

    try {
      const response = await axios.post(
        'https://course-creation-backend.onrender.com/api/courses/create',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        }
      )

      if (response.data.success) {
        navigate('/professorcourses')
      }
    } catch (error) {
      setError(error.response?.data?.message || "Error creating course")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    const { name, files } = e.target

    if (name === 'videos') {
      const videoArray = Array.from(files)
      const updatedVideos = [...form.videos, ...videoArray]

      if (updatedVideos.length > 10) {
        setError(`You can upload a maximum of 10 videos. You already have ${form.videos.length} videos.`)
        return
      }

      setForm({ ...form, videos: updatedVideos })

      const newVideoDetails = videoArray.map(file => ({
        title: file.name.split('.')[0],
        description: `Video: ${file.name}`
      }))

      setVideoDetails([...videoDetails, ...newVideoDetails])
      setError("")
    } else {
      setForm({ ...form, [name]: files })
      setPreviewFiles({ ...previewFiles, [name]: URL.createObjectURL(files) })
    }
  }

  const handleVideoDetailChange = (index, field, value) => {
    const updatedDetails = [...videoDetails]
    updatedDetails[index] = { ...updatedDetails[index], [field]: value }
    setVideoDetails(updatedDetails)
  }

  const removeVideo = (index) => {
    const updatedVideos = [...form.videos]
    updatedVideos.splice(index, 1)

    const updatedDetails = [...videoDetails]
    updatedDetails.splice(index, 1)

    setForm({ ...form, videos: updatedVideos })
    setVideoDetails(updatedDetails)
  }

  const removeFile = (type) => {
    setForm({ ...form, [type]: null })
    setPreviewFiles({ ...previewFiles, [type]: null })
  }

  // Input highlight style used throughout inputs and textareas
  const inputHighlightClass =
    "w-full bg-transparent text-white border border-slate-500 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"

  const selectHighlightClass =
    "w-full rounded-md border border-slate-500 bg-transparent text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center py-6 px-4 sm:px-6 lg:px-8 overflow-hidden relative">
      <div className="w-full max-w-5xl">
        <div className="flex justify-between items-center mb-10 text-white">
          <h1 className="text-3xl font-extrabold select-none">Create New Course</h1>
          <Button
            onClick={() => navigate('/professorcourses')}
            className="bg-gray-200 hover:bg-gray-300 text-gray-900 transition-colors rounded-lg px-4 py-2 shadow-sm"
          >
            Cancel
          </Button>
        </div>

        {error && (
          <div className="bg-red-500/20 text-red-300 p-4 rounded-lg text-center mb-6 border border-red-400 animate-fadeIn">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-12 bg-white/10 backdrop-blur-lg p-10 rounded-2xl shadow-lg text-white"
        >
          {/* Course Information */}
          <section className="space-y-8">
            <h2 className="text-2xl font-semibold border-b border-slate-500 pb-4">Course Information</h2>
            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-2">
                  Course Title
                </label>
                <InputBox
                  id="title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Enter course title"
                  required
                  className={inputHighlightClass}
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe your course..."
                  required
                  className={inputHighlightClass + " resize-none"}
                />
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium mb-2">
                    Price ($)
                  </label>
                  <InputBox
                    id="price"
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="Price ($)"
                    className={inputHighlightClass}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="duration" className="block text-sm font-medium mb-2">
                    Duration (hours)
                  </label>
                  <InputBox
                    id="duration"
                    type="number"
                    name="duration"
                    value={form.duration}
                    onChange={handleChange}
                    placeholder="Duration (hours)"
                    className={inputHighlightClass}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="category" className="block text-sm font-medium mb-2">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className={selectHighlightClass}
                    required
                  >
                    <option value="">Select Category</option>
                    <option>Development</option>
                    <option>Business</option>
                    <option>Finance</option>
                    <option>IT</option>
                    <option>Design</option>
                    <option>Marketing</option>
                    <option>Music</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* Course Media */}
          <section className="space-y-8">
            <h2 className="text-2xl font-semibold border-b border-slate-500 pb-4">Course Media</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Thumbnail */}
              <div>
                <label className="block text-sm font-medium mb-2">Thumbnail</label>
                {previewFiles.thumbnail ? (
                  <div className="relative w-full h-48 mb-4 border border-slate-500 rounded-lg overflow-hidden shadow-lg bg-slate-800">
                    <img src={previewFiles.thumbnail} className="w-full h-full object-cover" alt="thumbnail preview" />
                    <button
                      type="button"
                      onClick={() => removeFile('thumbnail')}
                      className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                      aria-label="Remove thumbnail"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <label
                    htmlFor="thumbnail-upload"
                    className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-500 rounded-lg cursor-pointer hover:bg-slate-800 transition"
                  >
                    <Upload className="h-12 w-12 text-gray-400" />
                    <span className="mt-2 text-sm">Click to upload thumbnail</span>
                    <input
                      type="file"
                      id="thumbnail-upload"
                      name="thumbnail"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                )}
              </div>

              {/* Preview Video */}
              <div>
                <label className="block text-sm font-medium mb-2">Preview Video</label>
                {previewFiles.previewVideo ? (
                  <div className="relative w-full h-48 mb-4 border border-slate-500 rounded-lg overflow-hidden shadow-lg bg-slate-800">
                    <video src={previewFiles.previewVideo} controls className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeFile('previewVideo')}
                      className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                      aria-label="Remove preview video"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <label
                    htmlFor="preview-video-upload"
                    className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-500 rounded-lg cursor-pointer hover:bg-slate-800 transition"
                  >
                    <Upload className="h-12 w-12 text-gray-400" />
                    <span className="mt-2 text-sm">Click to upload preview video</span>
                    <input
                      type="file"
                      id="preview-video-upload"
                      name="previewVideo"
                      accept="video/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                )}
              </div>
            </div>
          </section>

          {/* Course Videos */}
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold border-b border-slate-500 pb-4">Course Videos</h2>
            <label
              htmlFor="videos-upload"
              className="relative cursor-pointer block border-2 border-dashed border-slate-500 rounded-lg p-12 text-center hover:bg-slate-800 transition"
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-3 text-sm font-medium text-gray-300">Click to add course videos</p>
              <p className="text-xs text-gray-500 mt-1">
                You can add videos one by one (Current count: {form.videos.length})
              </p>
              <span
                className={`absolute top-4 right-4 rounded-full text-xs font-semibold px-3 py-1 ${
                  form.videos.length >= 10 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                }`}
              >
                {form.videos.length} / 10
              </span>
              <input
                type="file"
                id="videos-upload"
                name="videos"
                accept="video/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileChange}
                disabled={form.videos.length >= 10}
                required={form.videos.length === 0}
              />
            </label>

            {form.videos.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-4 text-white">
                  <h3 className="font-medium">Uploaded Videos</h3>
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      form.videos.length >= 10 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {form.videos.length} videos
                  </span>
                </div>

                <div className="space-y-4 max-h-80 overflow-y-auto">
                  {form.videos.map((video, index) => (
                    <div
                      key={index}
                      className="bg-slate-700 p-4 rounded-lg hover:border-blue-500 transition-colors flex justify-between items-center border border-transparent"
                    >
                      <div className="flex items-center space-x-4 min-w-0 text-white">
                        <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full flex-shrink-0">
                          Video {index + 1}
                        </span>
                        <p className="font-medium truncate max-w-xs">{video.name}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeVideo(index)}
                        className="text-red-600 hover:text-red-800 focus:outline-none"
                        aria-label={`Remove video ${index + 1}`}
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  {form.videos.map((_, index) => (
                    <div key={`video-title-${index}`}>
                      <label
                        htmlFor={`video-title-${index}`}
                        className="block text-xs font-medium text-gray-300 mb-1"
                      >
                        Video Title
                      </label>
                      <input
                        id={`video-title-${index}`}
                        type="text"
                        value={videoDetails[index]?.title || ''}
                        onChange={e => handleVideoDetailChange(index, 'title', e.target.value)}
                        placeholder="Video title"
                        className={inputHighlightClass.replace('text-white', 'text-gray-200')}
                      />
                    </div>
                  ))}
                  {form.videos.map((_, index) => (
                    <div key={`video-description-${index}`}>
                      <label
                        htmlFor={`video-description-${index}`}
                        className="block text-xs font-medium text-gray-300 mb-1"
                      >
                        Video Description
                      </label>
                      <input
                        id={`video-description-${index}`}
                        type="text"
                        value={videoDetails[index]?.description || ''}
                        onChange={e => handleVideoDetailChange(index, 'description', e.target.value)}
                        placeholder="Video description"
                        className={inputHighlightClass.replace('text-white', 'text-gray-200')}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Submit */}
          <div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg shadow-lg transition disabled:opacity-70"
            >
              {loading ? (
                <span className="flex items-center justify-center space-x-2">
                  <Loader2 className="animate-spin" size={20} />
                  <span>Creating Course...</span>
                </span>
              ) : (
                "Create Course"
              )}
            </Button>
          </div>
        </form>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  )
}

export default CourseCreation
