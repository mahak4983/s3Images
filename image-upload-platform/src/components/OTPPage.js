import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/background-image.jpg';
import logo from '../assets/ZisionX.png';


const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function OTPPage() {
    const [otp, setOtp] = useState('');
    const navigate = useNavigate();

    const handleVerifyOtp = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/update-role`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ otp }),
            });

            const data = await response.json();
            if (data.status === 'success') {
                // Set the login status to true in localStorage after OTP verification
                localStorage.setItem('isLoggedIn', 'true');
                if (localStorage.getItem('role')) {
                    navigate('/')
                }
                else {

                    navigate('/role-selection'); // Redirect to role selection
                }
            } else {
                alert('Invalid OTP. Please try again.');
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            alert('Failed to connect to the server.');
        }
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
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '15px',
                    width: '80%',
                    maxWidth: '400px',
                    marginTop: '20px',
                }}
            >
                <img src={logo} alt="ZisionX Logo" style={{ width: '200px', marginBottom: '20px' }} />
                <Typography variant="h5">OTP Verification</Typography>
                <Typography variant="body1" sx={{ marginBottom: '20px' }}>
                    Enter the OTP sent to your mobile
                </Typography>
                <TextField
                    label="Enter OTP"
                    variant="outlined"
                    fullWidth
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    sx={{ marginBottom: '20px' }}
                />
                <Button
                    variant="contained"
                    onClick={handleVerifyOtp}
                    sx={{
                        backgroundColor: '#b0b0b0',
                        color: '#fff',
                        '&:hover': { backgroundColor: '#909090' },
                        padding: '10px 30px',
                        fontSize: '16px',
                    }}
                >
                    Verify OTP
                </Button>
            </Container>
        </Box>
    );
}

export default OTPPage;
