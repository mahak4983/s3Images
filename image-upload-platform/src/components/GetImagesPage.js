import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Button, Box, Grid, Card, CardMedia, CardContent, IconButton, useMediaQuery, BottomNavigation, BottomNavigationAction } from '@mui/material';
import UploadIcon from '@mui/icons-material/CloudUpload';
import GalleryIcon from '@mui/icons-material/PhotoLibrary';
import ProfileIcon from '@mui/icons-material/Person';
import DownloadIcon from '@mui/icons-material/Download';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';

import logo from '../assets/ZisionX.png'; // Path to your logo
import backgroundImage from '../assets/background-image.jpg'; // Path to your background image

const GetImagesPage = () => {
    const [images, setImages] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path); // Navigate to the specified path
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const fetchMatchingImages = async () => {
        if (!selectedFile) {
            alert("Please select an image to upload.");
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await axios.post('/getimage', formData, {
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
        <div style={{ fontFamily: 'Roboto, sans-serif' }}>
            {/* Background Image Section */}
            <Box
                sx={{
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: '300px',
                    position: 'relative',
                }}
            >
                <img
                    src={logo}
                    alt="ZisionX Logo"
                    style={{
                        position: 'absolute',
                        top: '20px',
                        left: '20px',
                        width: '150px',
                        opacity: '0.8', // Make the logo blend with the background
                        mixBlendMode: 'overlay', // Add blend mode for smooth blending with background
                    }}
                />
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                        height: '100%',
                        color: '#000', // Set text color to black
                        textAlign: 'center',
                        zIndex: 1,
                        position: 'relative',
                    }}
                >
                    <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
                        Download Your Media
                    </Typography>
                    <Typography variant="body1" sx={{ marginBottom: 1 }}>
                        No limit - View & download unlimited images & videos
                    </Typography>
                    <Typography variant="body1" sx={{ marginBottom: 1 }}>
                        No compression - Store your media in original resolution
                    </Typography>
                    <Typography variant="body1" sx={{ marginBottom: 1 }}>
                        No worries - Find & share your images easily & efficiently
                    </Typography>
                </Box>
            </Box>

            {/* Upload Image Section */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '20px',
                    gap: '10px',
                    flexWrap: 'nowrap', // Ensure buttons are side by side
                    flexDirection: isMobile ? 'column' : 'row',
                }}
            >
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
                        startIcon={<CloudUploadIcon />}
                        disabled={loading}
                        sx={{
                            backgroundColor: '#D3D3D3', // Greyish color
                            color: '#000',
                            padding: '10px 20px',
                            borderRadius: '30px',
                            width: isMobile ? '100%' : 'auto',
                        }}
                    >
                        {loading ? 'Uploading...' : 'Add your face'}
                    </Button>
                </label>
                <Button
                    variant="contained"
                    onClick={fetchMatchingImages}
                    disabled={loading || !selectedFile}
                    sx={{
                        padding: '10px 20px',
                        borderRadius: '30px',
                        backgroundColor: '#D3D3D3', // Greyish color
                        color: '#000',
                        width: isMobile ? '100%' : 'auto',
                    }}
                >
                    {loading ? 'Searching...' : 'Find your media'}
                </Button>
            </Box>

            {/* Display Images if Available */}
            <Box sx={{ padding: '20px', textAlign: 'center' }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '10px' }}>
                    Images of you
                </Typography>
                <Grid container spacing={2} justifyContent="center">
                    {images.length > 0 ? (
                        images.map((image, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card>
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
                            </Grid>
                        ))
                    ) : (
                        <Typography variant="body2" color="textSecondary">
                            No images found. Please upload a photo to search.
                        </Typography>
                    )}
                </Grid>
            </Box>

            {/* Footer Navigation */}
            <BottomNavigation
                showLabels
                sx={{
                    width: '100%',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                }}
            >
                <BottomNavigationAction label="Upload" icon={<UploadIcon />} onClick={() => handleNavigation('/uploadimage')} />
                <BottomNavigationAction label="Gallery" icon={<GalleryIcon />} onClick={() => handleNavigation('/get')} />
                <BottomNavigationAction label="Profile" icon={<ProfileIcon />} onClick={() => handleNavigation('/')} />
            </BottomNavigation>
        </div>
    );
};

export default GetImagesPage;
