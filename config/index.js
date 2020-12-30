require('dotenv').config();

const config = {
    dev: process.env.NODE_ENV !== 'production',
    port: process.env.PORT || 3000,
    wsPort: process.env.WS_PORT || 9999,
};

module.exports = { config };
