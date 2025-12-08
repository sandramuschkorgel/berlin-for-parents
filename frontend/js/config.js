// API Configuration
const CONFIG = {
    API_BASE_URL: window.location.hostname.includes('github.io')
        ? 'https://your-app.onrender.com'  // Production - update when you deploy
        : 'http://127.0.0.1:5000',          // Local development
    APP_NAME: 'Berlin for Parents',
    YEAR: new Date().getFullYear()
};
