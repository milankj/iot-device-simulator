const inquirer = require('inquirer').default;
const fs = require('fs');
const path = require('path');

module.exports = async () => {

    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'deviceId',
            message: 'Device ID:'
        },
        {
            type: 'input',
            name: 'username',
            message: 'Broker username:',
        },
        {
            type: 'input',
            name: 'password',
            message: 'Broker password:',
        }
    ]);

    const config = {
        deviceId: answers.deviceId,
        protocol: 'mqtt',
        connection: {
            broker: answers.broker,
            username: answers.username,
            password: answers.password
        },
        topic: {
            read: `device/${answers.deviceId}/telemetry`,
            write: `device/${answers.deviceId}/command`
        },
        payload: {
            temperature: {
                type: "random",
                min: 20,
                max: 35
            },
            humidity: {
                type: "random",
                min: 40,
                max: 80
            }
        }
    };

    const devicesPath = path.join(
        process.cwd(),
        'devices'
    );

    fs.mkdirSync(devicesPath, {
        recursive: true
    });


    const deviceFilePath = path.join(
        devicesPath,
        `${answers.deviceId}.json`
    );

    fs.writeFileSync(
        deviceFilePath,
        JSON.stringify(config, null, 2)
    );

    console.log('Config created');
};