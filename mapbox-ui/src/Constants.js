export const getBackendUri = () => {
    return process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
};