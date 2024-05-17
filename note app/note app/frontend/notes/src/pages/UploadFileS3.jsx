import React, { useState } from 'react';
import Navbar from '../components/Navbar/Navbar';
import axiosInstance from '../utils/axiosInstance';

const FilePage = () => {
    const [file, setFile] = useState(null);
    const [fileKey, setFileKey] = useState("");
    const [fileBody, setFileBody] = useState(""); // New state for file body
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleFileUpload = async (e) => {
        e.preventDefault();

        if (!file || !fileKey || !fileBody) {
            setError("Please select a file, provide a file key, and enter a file body");
            return;
        }

        setError("");

        try {
            const formData = new FormData();
            formData.append('fileKey', fileKey);
            formData.append('fileBody', fileBody); // Append the file body
            formData.append('file', file); // Append the file itself

            const response = await axiosInstance.post("/api/uploadFileToS3", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.message) {
                alert(response.data.message);
            }
        } catch (error) {
            console.error(error);
            setError("Error uploading file, please try again");
        }
    };

    return (
        <>
            <Navbar />
            <div className='flex items-center justify-center mt-28'>
                <div className='w-96 border rounded bg-white px-7 py-10'>
                    <form onSubmit={handleFileUpload}>
                        <h4 className="text-2xl mb-7">Upload File to S3</h4>

                        <input type='text' placeholder='File Key' className='input-box' value={fileKey} onChange={(e) => setFileKey(e.target.value)}></input>
                        <input type='file' className='input-box' onChange={handleFileChange}></input>
                        <textarea placeholder='File Body' className='input-box mt-2' value={fileBody} onChange={(e) => setFileBody(e.target.value)}></textarea>

                        {error && <p className='text-red-500 text-xs pb-1'>{error}</p>}

                        <button type='submit' className='btn-primary'>Upload</button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default FilePage;
