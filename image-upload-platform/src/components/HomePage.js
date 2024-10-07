import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Box, Typography, Container, BottomNavigation, BottomNavigationAction } from '@mui/material';
import UploadIcon from '@mui/icons-material/CloudUpload';
import GalleryIcon from '@mui/icons-material/PhotoLibrary';
import ProfileIcon from '@mui/icons-material/Person';
import backgroundImage from '../assets/background-image.jpg';
import logo from '../assets/ZisionX.png';

function HomePage() {
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path); // Navigate to the specified path
    };

    return (
        <Box
            sx={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '100vh',  // Ensure full view height
                overflow: 'hidden', // Prevent any overflow
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}
        >
            <Container
                sx={{
                    textAlign: 'center',
                    padding: '30px',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white background
                    borderRadius: '15px',
                    width: '80%',
                    maxWidth: '400px',
                    marginTop: '20px',
                    overflow: 'hidden',  // Prevent content overflow
                }}
            >
                <img src={logo} alt="ZisionX Logo" style={{ width: '200px', marginBottom: '20px' }} />
                <Typography variant="h5">A Smart Media Sharing App</Typography>
                <Typography variant="body1" gutterBottom>
                    Secure and safe upload of your images & videos
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Facial recognition-driven media sharing engine
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Seamless integration with online platforms
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, marginTop: '30px' }}>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: '#b0b0b0',
                            color: '#fff',
                            '&:hover': { backgroundColor: '#909090' },
                            padding: '10px 30px',
                            fontSize: '16px',
                        }}
                    >
                        Upload
                    </Button>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: '#b0b0b0',
                            color: '#fff',
                            '&:hover': { backgroundColor: '#909090' },
                            padding: '10px 30px',
                            fontSize: '16px',
                        }}
                    >
                        Download
                    </Button>
                </Box>
            </Container>

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
        </Box>
    );
}

export default HomePage;
