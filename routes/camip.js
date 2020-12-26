const express = require('express');
const CameraIPService = require('../service/camip');
function cameraipAPI(app) {
    const router = express.Router();
    app.use('/api/cameraip', router);
    const cameraIPService = new CameraIPService();
    router.get('/', async (req, res) => {
        res.status(200).json({
            msg: 'Successful connection',
        });
    });
    router.post('/on', async (req, res, next) => {
        const { body: camera } = req;
        try {
            const { streamUrl, camInfo } = await cameraIPService.getStreamUrl({ camera });
            cameraIPService.turnOnStrean({ streamUrl });
            res.status(200).json({
                camera: camInfo,
                message: 'Camera enabled',
            });
        } catch (error) {
            next(error);
        }
    });
    router.post('/off', async (req, res, next) => {
        try {
            const { turnOffCamera } = await cameraIPService.turnOffStrean();
            res.status(200).json({
                camera: turnOffCamera,
                message: 'Camera disabled',
            });
        } catch (error) {
            next(error);
        }
    });
}

module.exports = cameraipAPI;
