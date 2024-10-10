import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/background-image.jpg';
import logo from '../assets/ZisionX.png';

function LoginPage() {
    const [mobileNumber, setMobileNumber] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async () => {
        try {
            const response = await fetch('/check-user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mobile_number: mobileNumber }),
            });

            const data = await response.json();
            if (data.status === 'registered') {
                // Save mobile number and role if the user is registered
                localStorage.setItem('mobile_number', mobileNumber);
                localStorage.setItem('role', data.user.role);
                navigate('/otp'); // Redirect to home or another page for registered users
            } else if (data.status === 'not_registered') {
                // Save mobile number for not registered users
                localStorage.setItem('mobile_number', mobileNumber);
                navigate('/otp'); // Redirect to OTP page for new users
            } else {
                alert('An error occurred. Please try again.');
            }
        } catch (error) {
            console.error('Error checking user:', error);
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
                <Typography variant="h5">Login</Typography>
                <Typography variant="body1" sx={{ marginBottom: '20px' }}>
                    Enter your mobile number to login
                </Typography>
                <TextField
                    label="Mobile Number"
                    variant="outlined"
                    fullWidth
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    sx={{ marginBottom: '20px' }}
                />
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    sx={{
                        backgroundColor: '#b0b0b0',
                        color: '#fff',
                        '&:hover': { backgroundColor: '#909090' },
                        padding: '10px 30px',
                        fontSize: '16px',
                    }}
                >
                    Submit
                </Button>
            </Container>
        </Box>
    );
}

export default LoginPage;
