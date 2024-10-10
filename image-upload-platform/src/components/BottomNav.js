import React from 'react';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import UploadIcon from '@mui/icons-material/CloudUpload';
import GalleryIcon from '@mui/icons-material/PhotoLibrary';
import ProfileIcon from '@mui/icons-material/Person';
import ExitToAppIcon from '@mui/icons-material/ExitToApp'; // Logout icon
import { useNavigate } from 'react-router-dom';

const BottomNav = () => {
    const navigate = useNavigate();

    // Get the isLoggedIn value from localStorage
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    // Handles navigation to different pages
    const handleNavigation = (path) => {
        navigate(path);
    };

    // Handles user logout, clears localStorage, and redirects to home page
    const handleLogout = () => {
        localStorage.clear(); // Clear all localStorage data
        navigate('/'); // Navigate to the homepage
        window.location.reload();
    };

    return (
        <BottomNavigation
            showLabels
            sx={{
                width: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                position: 'fixed',
                bottom: 0,
                left: 0,
            }}
        >
            <BottomNavigationAction
                label="Upload"
                icon={<UploadIcon />}
                onClick={() => handleNavigation('/uploadimage')}
            />
            <BottomNavigationAction
                label="Gallery"
                icon={<GalleryIcon />}
                onClick={() => handleNavigation('/get')}
            />
            <BottomNavigationAction
                label="Profile"
                icon={<ProfileIcon />}
                onClick={() => handleNavigation('/profile')}
            />
            {/* Conditionally render the Logout button if the user is logged in */}
            {isLoggedIn && (
                <BottomNavigationAction
                    label="Logout"
                    icon={<ExitToAppIcon />}
                    onClick={handleLogout}
                />
            )}
        </BottomNavigation>
    );
};

export default BottomNav;
