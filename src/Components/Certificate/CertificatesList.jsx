import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const CertificatesList = () => {
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchCertificates = async () => {
            if (!token) {
                setError('Authentication required');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(
                    'https://course-creation-backend.onrender.com/api/certificates/all',
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );

                if (response.data.success) {
                    setCertificates(response.data.certificates);
                } else {
                    setError('Failed to fetch certificates');
                }
            } catch (error) {
                setError('Failed to fetch certificates');
                console.error('Fetch error:', error);
            }
            setLoading(false);
        };

        fetchCertificates();
    }, [token]);

    if (loading) {
        return (
            <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-700">{error}</p>
            </div>
        );
    }

    if (certificates.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
                <div className="bg-yellow-100 rounded-full p-3 mx-auto w-16 h-16 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h2 className="text-xl font-semibold mb-2">No Certificates Found</h2>
                <p className="text-gray-600 mb-4">You haven't earned any certificates yet. Complete a course to earn your first certificate!</p>
                <Link to="/courses" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-colors">
                    Browse Courses
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">My Certificates</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {certificates.map((certificate) => (
                    <div key={certificate._id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                        <div className="bg-blue-50 p-4 border-b border-gray-200">
                            <h3 className="font-semibold text-lg text-gray-800 truncate">{certificate.course.title}</h3>
                            <p className="text-sm text-gray-500">{certificate.course.category}</p>
                        </div>
                        
                        <div className="p-4">
                            <div className="flex items-center mb-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="text-sm text-gray-600">Issued: {new Date(certificate.issueDate).toLocaleDateString()}</span>
                            </div>
                            
                            <div className="flex items-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span className="text-sm text-gray-600">Instructor: {certificate.course.instructor.firstname} {certificate.course.instructor.lastname}</span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                    ID: {certificate.certificateId}
                                </span>
                                
                                <Link 
                                    to={`/certificate/${certificate.certificateId}`}
                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                >
                                    View Certificate
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CertificatesList;