// API Configuration
const CONFIG = {
    API_BASE_URL: window.location.hostname.includes('github.io')
        ? 'https://berlin-for-parents.onrender.com'
        : 'http://127.0.0.1:5000',
    APP_NAME: 'BERLIN FOR PARENTS',
    YEAR: new Date().getFullYear()
};
