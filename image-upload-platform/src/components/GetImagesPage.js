import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Tabs, Tab, Box, Grid, Card, CardMedia, CardContent, IconButton, Drawer, List, ListItem, ListItemText, useMediaQuery } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import MenuIcon from '@mui/icons-material/Menu';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';

import myimage from '../assets/bg.png'

const GetImagesPage = () => {
    const [images, setImages] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedTab, setSelectedTab] = useState(0);
    const [showForm, setShowForm] = useState(true);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    const downloadImage = (url) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = 'image.jpg';
        link.click();
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
                setShowForm(false);
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

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    return (
        <div>
            {/* Responsive AppBar */}
            <AppBar position="static" style={{ backgroundColor: '#9c27b0' }}>
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
                        backgroundColor: 'rgba(156, 39, 176, 0.8)', // Adjust opacity here (0.8 for more prominent color)
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
                    <Typography variant="h2">Find Matching Images</Typography>
                </Box>
            </Box>

            {/* Upload Image Section */}
            {showForm && (
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px', flexDirection: isMobile ? 'column' : 'row' }}>
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
                            sx={{ marginBottom: '20px', width: isMobile ? '100%' : 'auto' }}
                        >
                            {loading ? 'Uploading...' : 'Upload Photo'}
                        </Button>
                    </label>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={fetchMatchingImages}
                        disabled={loading || !selectedFile}
                        sx={{ marginLeft: isMobile ? '0' : '10px', marginBottom: '20px', width: isMobile ? '100%' : 'auto' }}
                    >
                        {loading ? 'Searching...' : 'Find Matches'}
                    </Button>
                </Box>
            )}

            {/* Display Images if Available */}
            {images.length > 0 && (
                <>
                    {/* Tabs */}
                    <Box sx={{ bgcolor: '#f8f8f8', padding: '16px' }}>
                        <Tabs value={selectedTab} onChange={handleTabChange} centered>
                            <Tab label="All" />
                            <Tab label="Polygon" />
                            <Tab label="Big Bang" />
                            <Tab label="Sacred Geometry" />
                        </Tabs>
                    </Box>

                    {/* Image Gallery */}
                    <Grid container spacing={2} sx={{ padding: '20px' }}>
                        {images.map((image, index) => (
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
                                        <Typography variant="h6">{`Image ${index + 1}`}</Typography>
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
                        ))}
                    </Grid>
                </>
            )}
        </div>
    );
};

export default GetImagesPage;
