const fs = require('fs');
const path = require('path');


module.exports = async (deviceId) => {

    const templatePath = path.join(
        __dirname,
        '../../templates/device.json'
    );

    const config = JSON.parse(
        fs.readFileSync(templatePath, 'utf-8')
    );

    // Inject values
    config.deviceId = deviceId;

    config.topic.read =
        config.topic.read.replace(
            '{{deviceId}}',
            deviceId
        );

    config.topic.write =
        config.topic.write.replace(
            '{{deviceId}}',
            deviceId
        );


    const devicesPath = path.join(
        process.cwd(),
        'devices'
    );

    fs.mkdirSync(devicesPath, {
        recursive: true
    });

    // Write device config
    fs.writeFileSync(
        path.join(devicesPath, `${deviceId}.json`),
        JSON.stringify(config, null, 2)
    );

    console.log(`✔ Device config created: devices/${deviceId}.json`);
};