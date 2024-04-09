const onvif = require('node-onvif');
const Stream = require('node-rtsp-stream');

const { config } = require('../config');
const boom = require('@hapi/boom');

class CameraIPService {
    constructor() {
        this.stream;
    }

    async getStreamUrl({ camera }) {
        return new Promise((resolve, reject) => {
            const { ip, port, user, pass } = camera;
            //Create Onvif Connection
            const onvifDevice = new onvif.OnvifDevice({
                xaddr: `http://${ip}:${port}/onvif/device_service`,
                user,
                pass,
            });
            //Initalize Onvif Device
            onvifDevice
                .init()
                .then(async function (info) {
                    const camInfo = info;
                    const streamUrlOutUser = await onvifDevice.getUdpStreamUrl();
                    const url = streamUrlOutUser.split('//');
                    const streamUrl = `${url[0]}//${user}:${pass}@${url[1]}`;
                    resolve({ streamUrl, camInfo });
                })
                .catch((err) => {
                    reject(boom.unauthorized(err));
                });
        });
    }
    async turnOnStream({ streamUrl }) {
        if (this.stream) {
            this.stream.stop();
        }
        console.log(`URLCAM: ${streamUrl}`);
        this.stream = new Stream({
            name: 'ViConIPCAM',
            streamUrl,
            wsPort: config.wsPort,
            ffmpegOptions: {
                '-stats': '',
                '-r': 30,
                '-c:v': 'libx264',
                '-analyzeduration': 0,
                '-probesize': 5000000,
            },
        });
    }
    async turnOnStreamTest() {
        if (this.stream) {
            this.stream.stop();
        }
        this.stream = new Stream({
            name: 'ViConIPCAM',
            streamUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            wsPort: config.wsPort,
            ffmpegOptions: {
                '-stats': '',
                '-r': 30,
            },
        });
    }
    async turnOffStream() {
        if (this.stream) {
            this.stream.stop();
        }
        return true;
    }
}

module.exports = CameraIPService;
