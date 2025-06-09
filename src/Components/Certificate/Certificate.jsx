import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const Certificate = () => {
    const { certificateId } = useParams();
    const [certificate, setCertificate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const certificateRef = useRef(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchCertificate = async () => {
            if (!certificateId) {
                setError('Certificate ID is required');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(
                    `http://localhost:4569/api/certificates/verify/${certificateId}`,
                );

                if (response.data.success && response.data.isValid) {
                    setCertificate(response.data.certificate);
                } else {
                    setError('Certificate not found or has been revoked');
                }
            } catch (error) {
                setError('Failed to fetch certificate');
                console.error('Fetch error:', error);
            }
            setLoading(false);
        };

        fetchCertificate();
    }, [certificateId]);

    const downloadAsPDF = async () => {
        if (!certificateRef.current) return;

        try {
            toast.info('Preparing your certificate for download...');
            
            const canvas = await html2canvas(certificateRef.current, {
                scale: 2,
                logging: false,
                useCORS: true
            });
            
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'a4'
            });
            
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`certificate-${certificateId}.pdf`);
            
            toast.success('Certificate downloaded successfully!');
        } catch (error) {
            console.error('Error generating PDF:', error);
            toast.error('Failed to download certificate');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
                    <div className="bg-red-100 rounded-full p-3 mx-auto w-16 h-16 flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Certificate Error</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <Link to="/" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors">
                        Return Home
                    </Link>
                </div>
            </div>
        );
    }

    if (!certificate) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
                    <div className="bg-yellow-100 rounded-full p-3 mx-auto w-16 h-16 flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Certificate Not Found</h2>
                    <p className="text-gray-600 mb-6">The certificate you're looking for doesn't exist or has been revoked.</p>
                    <Link to="/" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors">
                        Return Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Certificate Preview */}
                <div ref={certificateRef} className="bg-white border-8 border-double border-gold p-8 rounded-lg shadow-lg mb-8">
                    <div className="text-center">
                        <div className="mb-6">
                            <h1 className="text-4xl font-bold text-gray-800 mb-2">Certificate of Completion</h1>
                            <div className="h-1 w-32 bg-blue-600 mx-auto"></div>
                        </div>
                        
                        <p className="text-xl text-gray-600 mb-8">This is to certify that</p>
                        
                        <h2 className="text-3xl font-bold text-blue-800 mb-8">{certificate.studentName}</h2>
                        
                        <p className="text-xl text-gray-600 mb-2">has successfully completed the course</p>
                        
                        <h3 className="text-2xl font-bold text-gray-800 mb-8">{certificate.courseName}</h3>
                        
                        <div className="flex justify-center items-center mb-8">
                            <div className="h-px bg-gray-300 flex-1"></div>
                            <div className="px-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <div className="h-px bg-gray-300 flex-1"></div>
                        </div>
                        
                        <div className="flex justify-between items-center mb-4">
                            <div className="text-left">
                                <p className="text-sm text-gray-500">Issue Date</p>
                                <p className="font-medium">{new Date(certificate.issueDate).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500">Instructor</p>
                                <p className="font-medium">{certificate.instructorName}</p>
                            </div>
                        </div>
                        
                        <div className="mt-8 pt-4 border-t border-gray-200">
                            <p className="text-sm text-gray-500">Certificate ID: {certificateId}</p>
                            <p className="text-sm text-gray-500">Verify at: {window.location.href}</p>
                        </div>
                    </div>
                </div>
                
                {/* Actions */}
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <button 
                        onClick={downloadAsPDF}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors flex items-center justify-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download Certificate
                    </button>
                    
                    <Link 
                        to="/" 
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-6 py-3 rounded-lg transition-colors flex items-center justify-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Return Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Certificate;