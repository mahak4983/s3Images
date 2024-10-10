import React, { useState } from 'react';
import { Box, Button, Typography, Container, Select, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/background-image.jpg';
import logo from '../assets/ZisionX.png';

function RoleSelectionPage() {
    const [role, setRole] = useState('');
    const navigate = useNavigate();
    const mobileNumber = localStorage.getItem('mobile_number'); // Retrieve saved mobile number

    const handleRoleSelection = async () => {
        try {
            const response = await fetch('/update-role', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mobile_number: mobileNumber, role }),
            });

            const data = await response.json();
            if (data.status === 'success') {
                navigate('/'); // Redirect to homepage after role selection
            } else {
                alert('Error updating role. Please try again.');
            }
        } catch (error) {
            console.error('Error updating role:', error);
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
                <Typography variant="h5">Select Your Role</Typography>
                <Typography variant="body1" sx={{ marginBottom: '20px' }}>Choose your role to proceed</Typography>

                <Select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    displayEmpty
                    fullWidth
                    sx={{ marginBottom: '20px' }}
                >
                    <MenuItem value="" disabled>Select Role</MenuItem>
                    <MenuItem value="user">User</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                </Select>

                <Button
                    variant="contained"
                    onClick={handleRoleSelection}
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

export default RoleSelectionPage;
