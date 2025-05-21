import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Search = () => {
    const [courses, setCourses] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('No token found');
                    return;
                }

                const response = await axios.get('https://course-creation-backend.onrender.com/api/courses/admin/courses', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.data.success) {
                    setCourses(response.data.courses);
                    setFilteredCourses(response.data.courses);
                }
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };

        fetchCourses();
    }, []);

    const handleSearch = (e) => {
        const searchValue = e.target.value;
        setSearchTerm(searchValue);
        
        if (searchValue.trim() === '') {
            setShowResults(false);
            return;
        }

        const filtered = courses.filter(course =>
            course.title.toLowerCase().includes(searchValue.toLowerCase())
        );
        setFilteredCourses(filtered);
        setShowResults(true);
    };

    const handleBlur = () => {
        // Add a small delay before hiding results to allow for clicking on them
        setTimeout(() => setShowResults(false), 200);
    };

    const handleFocus = () => {
        if (searchTerm.trim() !== '') {
            setShowResults(true);
        }
    };

    return (
        <div className="search-container relative">
            <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={handleSearch}
                onBlur={handleBlur}
                onFocus={handleFocus}
                className="search-input w-full py-2 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {showResults && filteredCourses.length > 0 && (
                <div className="search-results absolute w-full mt-1 bg-white shadow-lg rounded-lg max-h-60 overflow-y-auto z-50">
                    {filteredCourses.map(course => (
                        <div key={course._id} className="course-item p-3 hover:bg-gray-100 cursor-pointer">
                            <h3 className="font-medium">{course.title}</h3>
                            <p className="text-sm text-gray-600">Instructor: {course.instructor.firstname} {course.instructor.lastname}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Search;
