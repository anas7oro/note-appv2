
// Frontend Component
import React, { useState } from 'react';
import Navbar from '../components/Navbar/Navbar';
import axiosInstance from '../utils/axiosInstance';

const DownloadFilePage = () => {
    const [fileKey, setFileKey] = useState('');
    const [link, setLink] = useState('');
    const [error, setError] = useState('');

    const handleDownload = async () => {
        try {
            if (!fileKey) {
                setError('Please provide a file key');
                return;
            }

            const response = await axiosInstance.get(`/api/downloadFileFromS3/${fileKey}`);
            setLink(response.data.link);
            setError(''); // Reset error message
        } catch (error) {
            console.error(error);
            setError('Error retrieving download link. Please try again.');
        }
    };

    return (
        <>
            <Navbar />
            <div className='flex items-center justify-center mt-28'>
                <div className='w-96 border rounded bg-white px-7 py-10'>
                    <div className='mb-7'>
                        <h4 className="text-2xl">Download File from S3</h4>
                    </div>
                    <div className='mb-4'>
                        <label htmlFor='fileKey' className='text-sm mb-1'>File Key:</label>
                        <input type='text' id='fileKey' value={fileKey} onChange={(e) => setFileKey(e.target.value)} className='input-box'></input>
                    </div>
                    <button onClick={handleDownload} className='btn-primary'>Get Download Link</button>
                    {link && (
                        <div className='mt-4'>
                            <h4 className="text-xl">Download Link:</h4>
                            <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-600">{link}</a>
                        </div>
                    )}
                    {error && <p className='text-red-500 text-xs mt-2'>{error}</p>}
                </div>
            </div>
        </>
    );
};

export default DownloadFilePage;