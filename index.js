const express = require('express');
const app = express();
const cors = require('cors');
const { config } = require('./config');

app.use(cors());
app.use(express.json());

//Routers
const cameraipAPI = require('./routes/camip');
cameraipAPI(app);

app.listen(config.port, function () {
    // eslint-disable-next-line no-console
    console.log(`Listening http://localhost:${config.port}`);
});
