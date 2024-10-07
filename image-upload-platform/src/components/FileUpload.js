import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Snackbar, BottomNavigation, BottomNavigationAction, Container } from '@mui/material';
import UploadIcon from '@mui/icons-material/CloudUpload';
import GalleryIcon from '@mui/icons-material/PhotoLibrary';
import ProfileIcon from '@mui/icons-material/Person';
import { Alert } from '@mui/material';
import { uploadFile } from '../services/api'; // Your API call function
import logo from '../assets/ZisionX.png'; // Path to your logo
import backgroundImg from '../assets/background-image.jpg'; // Path to your background image

const FileUpload = () => {
    const navigate = useNavigate();
    const [files, setFiles] = useState([]);
    const [message, setMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [uploadedImages, setUploadedImages] = useState([]); // Store uploaded images
    const [loading, setLoading] = useState(false); // Add a loading state

    const handleFileChange = (e) => {
        setFiles(Array.from(e.target.files)); // Convert FileList to array
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (files.length === 0) {
            setMessage('Please select files to upload.');
            setOpenSnackbar(true);
            return;
        }

        setLoading(true);

        try {
            const response = await uploadFile(files); // Call the API to upload files
            setMessage(response.message || 'Upload successful!');
            setUploadedImages([...uploadedImages, ...files]); // Add new files to uploadedImages
            setOpenSnackbar(true);
        } catch (error) {
            setMessage('File upload failed.');
            setOpenSnackbar(true);
        } finally {
            setLoading(false);
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
                height: '100vh',
                backgroundImage: `url(${backgroundImg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: '#000',
            }}
        >
            {/* Logo and Header Section */}
            <Container
                sx={{
                    textAlign: 'center',
                    padding: '30px',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white overlay
                    borderRadius: '15px',
                    width: '80%',
                    maxWidth: '400px',
                    marginTop: '20px',
                }}
            >
                <img src={logo} alt="ZisionX Logo" style={{ width: '200px', marginBottom: '20px' }} />
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    Upload Your Media
                </Typography>
                <Typography variant="body1" sx={{ marginBottom: 2 }}>
                    No limit - Upload unlimited images & videos
                </Typography>
                <Typography variant="body1" sx={{ marginBottom: 2 }}>
                    No compression - Store your media in original resolution
                </Typography>
                <Typography variant="body1" sx={{ marginBottom: 2 }}>
                    No worries - Secure & safe storage
                </Typography>

                {/* File Input and Upload Button */}
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, marginTop: '20px' }}>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                        id="upload-button"
                    />
                    <label htmlFor="upload-button">
                        <Button
                            variant="contained"
                            component="span"
                            sx={{
                                backgroundColor: '#b0b0b0',
                                color: '#fff',
                                padding: '10px 30px',
                                borderRadius: '30px',
                                '&:hover': { backgroundColor: '#909090' },
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {loading ? 'Uploading...' : 'Add Files'}
                        </Button>
                    </label>
                    <Button
                        variant="contained"
                        onClick={handleUpload}
                        disabled={loading || files.length === 0}
                        sx={{
                            backgroundColor: '#b0b0b0',
                            color: '#fff',
                            padding: '10px 30px',
                            borderRadius: '30px',
                            '&:hover': { backgroundColor: '#909090' },
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {loading ? 'Uploading...' : 'Upload'}
                    </Button>
                </Box>
            </Container>

            {/* Uploaded Images Section */}
            {uploadedImages.length > 0 && (
                <Container sx={{ textAlign: 'center', marginTop: '20px', paddingBottom: '20px' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '10px' }}>
                        Uploaded Images
                    </Typography>
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
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
                </Container>
            )}

            {/* Bottom Navigation */}
            <BottomNavigation
                showLabels
                sx={{
                    width: '100%',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    position: 'fixed',
                    bottom: 0,
                }}
            >
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
