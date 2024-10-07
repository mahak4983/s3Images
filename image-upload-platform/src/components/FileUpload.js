import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Input, Snackbar, BottomNavigation, BottomNavigationAction } from '@mui/material';
import UploadIcon from '@mui/icons-material/CloudUpload';
import GalleryIcon from '@mui/icons-material/PhotoLibrary';
import ProfileIcon from '@mui/icons-material/Person';
import { Alert } from '@mui/material'; // Import Alert component for Snackbar
import { uploadFile } from '../services/api'; // Assuming this is your API call function
import logo from '../assets/ZisionX.png';
import backgroundImg from '../assets/background-image.jpg'; // Background image for the logo section

const FileUpload = () => {
    const navigate = useNavigate(); 
    const [files, setFiles] = useState([]);
    const [message, setMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [uploadedImages, setUploadedImages] = useState([]); // Store uploaded images

    const handleFileChange = (e) => {
        setFiles(Array.from(e.target.files)); // Convert FileList to an array
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (files.length === 0) {
            setMessage('Please select files to upload.');
            setOpenSnackbar(true);
            return;
        }

        try {
            const response = await uploadFile(files); // Call the API to upload files
            setMessage(response.message || 'Upload successful!');
            setUploadedImages([...uploadedImages, ...files]); // Add new files to uploadedImages
            setOpenSnackbar(true);
        } catch (error) {
            setMessage('File upload failed.');
            setOpenSnackbar(true);
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const handleNavigation = (path) => {
        navigate(path); // Navigate to the specified path
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh', // Full viewport height
                color: '#000', // Set text color to black
                backgroundImage: `url(${backgroundImg})`, // Set background image for the entire page
                backgroundSize: 'cover', // Cover the entire box
                backgroundPosition: 'center', // Center the background image
            }}
        >
            {/* Logo Section */}
            <Box
                sx={{
                    // height: '30vh', // Occupies 30% of the screen height
                    display: 'flex',
                    alignItems: 'center', // Center the logo vertically
                    justifyContent: 'flex-start', // Align logo to the left
                    paddingLeft: '2%', // Add some padding to the left
                    paddingTop:'20%'
                }}
            >
                {/* Logo with Blend Effect */}
                <Box
                    component="img"
                    src={logo} // Path to your PNG logo
                    alt="Logo"
                    sx={{
                        width: {
                            xs: '70%', // 70% width for mobile
                            md: '30%', // 30% width for laptops and above
                        },
                        marginBottom: '0%', // Reduced space below the logo
                        position: 'relative', // Position relative to allow blending
                        opacity: 1, // Full opacity to emphasize the logo
                        zIndex: 1, // Ensure the logo appears above the overlay
                        mixBlendMode: 'multiply', // Blend the logo with the background
                    }}
                />
            </Box>

            {/* Content Section */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    padding: '2%',
                    borderRadius: '8px', // Optional: Rounded corners for the content box
                }}
            >
                <Typography variant="h4" gutterBottom align="left" sx={{ width: '100%', fontSize: '2rem' }}>
                    Upload Your Media
                </Typography>

                {/* Description text */}
                <Box sx={{ textAlign: 'left', width: '100%', marginBottom: 2 }}>
                    <Typography variant="body1" sx={{ fontSize: '1.2rem' }}>- No limit - Upload unlimited images & videos</Typography>
                    <Typography variant="body1" sx={{ fontSize: '1.2rem' }}>- No compression - Store your media in original resolution</Typography>
                    <Typography variant="body1" sx={{ fontSize: '1.2rem' }}>- No worries - Secure & safe storage</Typography>
                </Box>

                {/* File Input and Upload Button */}
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <Input
                        type="file"
                        inputProps={{ multiple: true }}
                        onChange={handleFileChange}
                        sx={{
                            marginRight: 2,
                            flexGrow: 1,
                            borderRadius: '20px', // Round corners
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '20px', // Round corners for input
                            },
                        }}
                    />
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: '#707070', // Greyish color
                            '&:hover': {
                                backgroundColor: '#505050', // Slightly darker on hover
                            },
                            padding: '10px 20px',
                            textTransform: 'none',
                            borderRadius: '20px', // Round corners for button
                        }}
                        onClick={handleUpload}
                    >
                        Upload
                    </Button>
                </Box>
            </Box>

            {/* Uploaded Images Section */}
            {uploadedImages.length > 0 && (
                <Box sx={{ marginTop: 4, width: '100%', padding: '2%' }}>
                    <Typography variant="h5" align="left" sx={{ marginBottom: 2, fontSize: '1.5rem' }}>
                        Your uploaded images
                    </Typography>
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                            gap: 2,
                        }}
                    >
                        {uploadedImages.map((file, index) => (
                            <Box
                                key={index}
                                component="img"
                                src={URL.createObjectURL(file)}
                                alt={`uploaded-${index}`}
                                sx={{ width: '100%', height: 'auto', borderRadius: 2 }}
                            />
                        ))}
                    </Box>
                </Box>
            )}

            <BottomNavigation showLabels sx={{ mt: 4 }}>
                <BottomNavigationAction label="Upload" icon={<UploadIcon />} onClick={() => handleNavigation('/uploadimage')} />
                <BottomNavigationAction label="Gallery" icon={<GalleryIcon />} onClick={() => handleNavigation('/get')} />
                <BottomNavigationAction label="Profile" icon={<ProfileIcon />} onClick={() => handleNavigation('/')} />
            </BottomNavigation>

            {/* Snackbar for success/failure message */}
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={message.includes('failed') ? 'error' : 'success'}>
                    {message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default FileUpload;
