import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Box, Typography, Container } from '@mui/material';
import backgroundImage from '../assets/background-image.jpg';
import logo from '../assets/ZisionX.png';
import BottomNav from './BottomNav';

function HomePage() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Simulate login status

    useEffect(() => {
        // Check login status from localStorage
        const loggedInStatus = localStorage.getItem('isLoggedIn') === 'true';
        setIsLoggedIn(loggedInStatus);
    }, []);

    const handleNavigation = (path) => {
        navigate(path); // Navigate to the specified path
    };

    return (
        <Box
            sx={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '100vh',
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
                    overflow: 'hidden',
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

                {/* Conditional Rendering for Buttons */}
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, marginTop: '30px' }}>
                    {isLoggedIn ? (
                        <>
                            <Button
                                variant="contained"
                                onClick={() => handleNavigation('/uploadimage')}
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
                                onClick={() => handleNavigation('/get')}
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
                            
                        </>
                    ) : (
                        <>
                            <Button
                                variant="contained"
                                onClick={() => handleNavigation('/login')}
                                sx={{
                                    backgroundColor: '#b0b0b0',
                                    color: '#fff',
                                    '&:hover': { backgroundColor: '#909090' },
                                    padding: '10px 30px',
                                    fontSize: '16px',
                                }}
                            >
                                Login to Continue
                            </Button>
                        </>
                    )}
                </Box>
            </Container>

            <BottomNav/>
        </Box>
    );
}

export default HomePage;
