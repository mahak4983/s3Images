import React, { useState } from 'react';
import { uploadFile } from '../services/api';

const FileUpload = () => {
    const [files, setFiles] = useState([]);
    const [message, setMessage] = useState('');

    const handleFileChange = (e) => {
        setFiles(Array.from(e.target.files)); // Convert FileList to an array
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (files.length === 0) {
            setMessage('Please select files to upload.');
            return;
        }

        try {
            const response = await uploadFile(files); // Call the updated uploadFiles function
            setMessage(response.message || 'Upload successful!');
        } catch (error) {
            setMessage('File upload failed.');
        }
    };
    return (
        
        <div>
            <h1>Upload your image</h1>
            <input type="file" multiple onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default FileUpload;
