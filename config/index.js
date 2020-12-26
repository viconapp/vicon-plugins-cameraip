require('dotenv').config();

const config = {
    dev: process.env.NODE_ENV !== 'production',
    port: process.env.PORT || 3005,
    wsPort: process.env.WS_PORT || 3006,
};

module.exports = { config };
