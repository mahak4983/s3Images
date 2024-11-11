import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL, // Your backend URL
});

// api.interceptors.request.use(
//     (config) => {
//         const token = localStorage.getItem('token'); // Get token from local storage
//         if (token) {
//             config.headers['Authorization'] = `Bearer ${token}`; // Attach the token to the Authorization header
//         }
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );

export const uploadFile = async (files) => {
    const formData = new FormData();
    files.forEach((file, index) => {
        formData.append('files', file); // Append each file to the form data with the same key
    });

    // Get mobile_number from localStorage and append it to the form data
    const mobileNumber = localStorage.getItem('mobile_number');
    if (mobileNumber) {
        formData.append('mobile_number', mobileNumber);
    }

    return api.post('/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const loginUser = async (email, password) => {
    try {
        const response = await api.post('/login', { email, password });
        return response.data;
    } catch (error) {
        console.error("Error logging in:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

export default api;
