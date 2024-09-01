import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000', // Your backend URL
});

export const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    return api.post('/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export default api;
