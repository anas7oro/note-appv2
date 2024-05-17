import React, { useState } from 'react';
import Navbar from '../components/Navbar/Navbar';
import axios from 'axios';
import axiosInstance from '../utils/axiosInstance';

const DeleteFilePage = () => {
    const [fileKey, setFileKey] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState('');

    const handleDelete = async () => {
        try {
            // Make a DELETE request to the API endpoint with the file key
            await axiosInstance.delete(`/api/deleteFileFromS3/${fileKey}`);
            // Update success message
            setSuccessMessage('File deleted successfully');
            // Clear file key input
            setFileKey('');
        } catch (error) {
            console.error(error);
            setError('Error deleting file. Please try again.');
        }
    };

    return (
        <>
            <Navbar />
            <div className='flex items-center justify-center mt-28'>
                <div className='w-96 border rounded bg-white px-7 py-10'>
                    <div className='mb-7'>
                        <h4 className="text-2xl">Delete File from S3</h4>
                    </div>
                    <div className='mb-4'>
                        <label htmlFor='fileKey' className='text-sm mb-1'>File Key:</label>
                        <input type='text' id='fileKey' value={fileKey} onChange={(e) => setFileKey(e.target.value)} className='input-box'></input>
                    </div>
                    <button onClick={handleDelete} className='btn-primary'>Delete File</button>
                    {successMessage && <p className='text-green-500 text-sm mt-2'>{successMessage}</p>}
                    {error && <p className='text-red-500 text-xs mt-2'>{error}</p>}
                </div>
            </div>
        </>
    );
};

export default DeleteFilePage;
