import React, { useState } from 'react';
import { Button, Box, Typography, Container, Card, CardMedia, CardContent, IconButton, TextField } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import axios from 'axios';

import logo from '../assets/ZisionX.png'; // Path to logo
import backgroundImage from '../assets/background-image.jpg'; // Path to background
import BottomNav from './BottomNav';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const GetImagesPage = () => {
    const [images, setImages] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState(''); // New state for phone number
    const [loading, setLoading] = useState(false);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handlePhoneNumberChange = (event) => {
        setPhoneNumber(event.target.value); // Set phone number state
    };

    const fetchMatchingImages = async () => {
        if (!selectedFile) {
            alert("Please select an image to upload.");
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('event_id', phoneNumber); // Send the phone number as event_id

        try {
            const response = await axios.post(`${API_BASE_URL}/getimage`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.matching_images && response.data.matching_images.length > 0) {
                setImages(response.data.matching_images);
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

    const downloadImage = (url) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = 'image.jpg';
        link.click();
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            {/* Logo and Header Section */}
            <Container
                sx={{
                    textAlign: 'center',
                    padding: '30px',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '15px',
                    width: '80%',
                    maxWidth: '400px',
                    marginTop: '20px',
                    overflow: 'hidden',
                }}
            >
                <img src={logo} alt="ZisionX Logo" style={{ width: '200px', marginBottom: '20px' }} />
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    Download Your Media
                </Typography>
                <Typography variant="body1" sx={{ marginBottom: 2 }}>
                    No limit - View & download unlimited images & videos
                </Typography>
                <Typography variant="body1" sx={{ marginBottom: 2 }}>
                    No compression - Store your media in original resolution
                </Typography>
                <Typography variant="body1" sx={{ marginBottom: 2 }}>
                    No worries - Find & share your images easily & efficiently
                </Typography>

                {/* Phone Number Input and Upload/Find Buttons */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, marginTop: '20px' }}>
                    {/* Phone Number Input Field */}
                    <TextField
                        label="Enter Event Id"
                        variant="outlined"
                        value={phoneNumber}
                        onChange={handlePhoneNumberChange}
                        sx={{ width: '150px' }}
                    />

                    <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="upload-button"
                        type="file"
                        onChange={handleFileChange}
                    />
                    <label htmlFor="upload-button">
                        <Button
                            variant="contained"
                            component="span"
                            sx={{
                                backgroundColor: '#b0b0b0',
                                color: '#fff',
                                padding: '10px 15px',
                                borderRadius: '30px',
                                minWidth: '140px',
                                whiteSpace: 'nowrap',
                                '&:hover': { backgroundColor: '#909090' },
                            }}
                        >
                            {loading ? 'Uploading...' : 'Add your face'}
                        </Button>
                    </label>

                    <Button
                        variant="contained"
                        onClick={fetchMatchingImages}
                        disabled={loading || !selectedFile || !phoneNumber}
                        sx={{
                            backgroundColor: '#b0b0b0',
                            color: '#fff',
                            padding: '10px 15px',
                            borderRadius: '30px',
                            minWidth: '140px',
                            whiteSpace: 'nowrap',
                            '&:hover': { backgroundColor: '#909090' },
                        }}
                    >
                        {loading ? 'Searching...' : 'Find your media'}
                    </Button>
                </Box>
            </Container>

            {/* Scrollable Content Section */}
            <Box sx={{ flex: 1, overflowY: 'auto', padding: '20px', textAlign: 'center' }}>
                {images.length > 0 ? (
                    <>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '10px' }}>
                            Images of you
                        </Typography>
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                gap: 2,
                            }}
                        >
                            {images.map((image, index) => (
                                <Card key={index}>
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={image.s3_url}
                                        alt={`Image ${index + 1}`}
                                        sx={{ objectFit: 'cover' }}
                                    />
                                    <CardContent>
                                        <Typography variant="body2">Similarity: {image.similarity}%</Typography>
                                        <IconButton
                                            aria-label="download"
                                            onClick={() => downloadImage(image.s3_url)}
                                            sx={{ float: 'right' }}
                                        >
                                            <DownloadIcon />
                                        </IconButton>
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>
                    </>
                ) : (
                    <Typography variant="body2" color="textSecondary">
                        No images found. Please upload a photo to search.
                    </Typography>
                )}
            </Box>

            {/* Fixed Footer Navigation */}
            <BottomNav />
        </Box>
    );
};

export default GetImagesPage;
