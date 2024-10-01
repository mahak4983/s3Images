import React, { useState } from 'react';
import myimage from '../assets/bg.png'
import { uploadFile } from '../services/api';
import { Box, Button, Typography, TextField, Snackbar, AppBar,Toolbar, IconButton,Drawer,List,ListItem,ListItemText, useMediaQuery } from '@mui/material';
import { Alert } from '@mui/material'; // Import Alert component for Snackbar
import { useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';


const FileUpload = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [files, setFiles] = useState([]);
    const [message, setMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);

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
            const response = await uploadFile(files); // Call the updated uploadFiles function
            setMessage(response.message || 'Upload successful!');
            setOpenSnackbar(true);
        } catch (error) {
            setMessage('File upload failed.');
            setOpenSnackbar(true);
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };
    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    return (
        <>
            <AppBar position="static" style={{ backgroundColor: 'rgba(33, 150, 243, 0.8)' }}>
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        ZisionX
                    </Typography>
                    {!isMobile ? (
                        <>
                            <Button color="inherit">Gallery</Button>
                            <Button color="inherit">Dark Theme</Button>
                            <Button color="inherit">Blog</Button>
                            <Button color="inherit">Docs</Button>
                            <Button color="inherit">Features</Button>
                        </>
                    ) : (
                        <IconButton color="inherit" onClick={toggleDrawer(true)}>
                            <MenuIcon />
                        </IconButton>
                    )}
                </Toolbar> 
            </AppBar>

            {/* Drawer for mobile */}
            <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
                <List onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
                    <ListItem button>
                        <ListItemText primary="Gallery" />
                    </ListItem>
                    <ListItem button>
                        <ListItemText primary="Dark Theme" />
                    </ListItem>
                    <ListItem button>
                        <ListItemText primary="Blog" />
                    </ListItem>
                    <ListItem button>
                        <ListItemText primary="Docs" />
                    </ListItem>
                    <ListItem button>
                        <ListItemText primary="Features" />
                    </ListItem>
                </List>
            </Drawer>

            {/* Header Section with Background Image */}
            <Box
                sx={{
                    position: 'relative',
                    height: '250px', // Adjust height as needed
                    backgroundImage: `url(${myimage})`, // Your background image path
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    overflow: 'hidden',
                }}
            >
                {/* Overlay with prominent color */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(33, 150, 243, 0.8)', // Adjust opacity here (0.8 for more prominent color)
                    }}
                />
                <Box
                    sx={{
                        position: 'relative', // Ensure text is above the overlay
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        color: '#fff',
                        textAlign: 'center',
                    }}
                >
                    <Typography variant="h2">Upload Your Imges</Typography>
                </Box>
            </Box>
        <Box
                sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px', flexDirection: isMobile ? 'column' : 'row' }}
        >
            
            <TextField
                type="file"
                inputProps={{ multiple: true }}
                onChange={handleFileChange}
                sx={{ marginBottom: 2 }}
            />
            <Button
                variant="contained"
                color="primary"
                onClick={handleUpload}
                sx={{ padding: '10px 20px' }}
            >
                Upload
            </Button>
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={message.includes('failed') ? 'error' : 'success'}>
                    {message}
                </Alert>
            </Snackbar>
        </Box>
        </>
    );
};

export default FileUpload;
