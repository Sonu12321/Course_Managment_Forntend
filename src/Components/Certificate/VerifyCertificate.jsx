import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const VerifyCertificate = () => {
    const [certificateId, setCertificateId] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!certificateId.trim()) {
            toast.error('Please enter a certificate ID');
            return;
        }
        
        setLoading(true);
        
        try {
            const response = await axios.get(
                `https://course-creation-backend.onrender.com/api/certificates/verify/${certificateId.trim()}`
            );
            
            if (response.data.success && response.data.isValid) {
                navigate(`/certificate/${certificateId.trim()}`);
            } else {
                toast.error('Invalid certificate ID or certificate has been revoked');
            }
        } catch (error) {
            console.error('Verification error:', error);
            toast.error('Failed to verify certificate');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
                <div className="text-center mb-8">
                    <div className="bg-blue-100 rounded-full p-3 mx-auto w-16 h-16 flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Verify Certificate</h2>
                    <p className="text-gray-600">Enter the certificate ID to verify its authenticity</p>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label htmlFor="certificateId" className="block text-sm font-medium text-gray-700 mb-2">Certificate ID</label>
                        <input
                            type="text"
                            id="certificateId"
                            value={certificateId}
                            onChange={(e) => setCertificateId(e.target.value)}
                            placeholder="e.g. CERT-12345678-9012"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                            required
                        />
                    </div>
                    
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors flex items-center justify-center"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div>
                                Verifying...
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Verify Certificate
                            </>
                        )}
                    </button>
                </form>
                
                <div className="mt-6 text-center">
                    <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium">
                        Return to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default VerifyCertificate;