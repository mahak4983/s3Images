import React, { useState } from 'react';
import axios from 'axios';

const GetImagesPage = () => {
    const [images, setImages] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(true); // State to manage form visibility

    // Function to handle file selection
    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    // Function to fetch matching images from backend
    const fetchMatchingImages = async () => {
        if (!selectedFile) {
            alert("Please select an image to upload.");
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            // Make a POST request to the backend with the selected image
            const response = await axios.post('http://15.206.107.9/getimage', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.matching_images && response.data.matching_images.length > 0) {
                setImages(response.data.matching_images);  // Set the images array with the response data
                setShowForm(false);  // Hide the form and display images
            } else {
                alert("No matching images found.");
            }
        } catch (error) {
            console.error("Error fetching images:", error);
            alert("An error occurred while searching for matching images.");
        } finally {
            setLoading(false);
        }
    };

    // Function to reset the form
    const resetForm = () => {
        setImages([]);
        setSelectedFile(null);
        setShowForm(true);  // Show the form again
    };

    return (
        <div>
            <h2>Find Matching Images</h2>

            {/* Conditionally render form or image gallery */}
            {showForm ? (
                <div>
                    <input type="file" onChange={handleFileChange} />
                    <button onClick={fetchMatchingImages} disabled={loading}>
                        {loading ? 'Searching...' : 'Search for Matching Images'}
                    </button>
                </div>
            ) : (
                <div>
                    <h3>Matching Images Found</h3>
                    {/* Display images */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '20px' }}>
                        {images.map((image, index) => (
                            <div key={index} style={{ margin: '10px' }}>
                                <img
                                    src={image.s3_url} // Use the presigned URL to display the image
                                    alt={`Matched Face ${index + 1}`}
                                    style={{ width: '200px', height: '200px', objectFit: 'cover', borderRadius: '10px' }}
                                />
                                <p>Similarity: {image.similarity.toFixed(2)}%</p>
                            </div>
                        ))}
                    </div>
                    <button onClick={resetForm} style={{ marginTop: '20px' }}>
                        Upload Another Image
                    </button>
                </div>
            )}
        </div>
    );
};

export default GetImagesPage;
