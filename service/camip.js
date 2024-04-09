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
                    console.log(streamUrlOutUser);
                    const url = streamUrlOutUser.split('//');
                    // const streamUrl = `${url[0]}//${user}:${pass}@${url[1]}`;
                    const streamUrl = `${url[0]}//${user}:${pass}@172.40.0.123:554/Streaming/Channels/102?transportmode=unicast&profile=Profile_1`;
                    let profile = onvifDevice.getCurrentProfile();
                    console.log(JSON.stringify(profile, null, '  '));
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
            width: 1280,
            height: 720,
            ffmpegOptions: {
                '-stats': '',
                '-r': 30,
            },
        });
    }
    async turnOnStreamTest() {
        if (this.stream) {
            this.stream.stop();
        }
        this.stream = new Stream({
            name: 'ViConIPCAM',
            streamUrl: '',
            wsPort: config.wsPort,
            width: 1280,
            height: 720,
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
