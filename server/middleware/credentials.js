const allowedOrigins = require('../config/allowedOrigins');

const credentials = (req, res, next) => {
    const origin = req.headers.origin 
    console.log('Origin:', origin); 
    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Credentials', true);

    }
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'POST'); // Set the allowed methods for the actual POST request
        res.header('Access-Control-Allow-Methods', 'GET');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Set the allowed headers for the actual POST request
    }
    next();
}

module.exports = credentials