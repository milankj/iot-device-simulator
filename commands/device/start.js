const fs = require('fs');
const path = require('path');
const readline = require('readline');

const RabbitMQClient = require('../../helpers/rabbitmq');
const { generate_publish_message } = require('../../helpers/publish_message_generator');

let currentInput = '';

module.exports = async (deviceId) => {
    console.log("Starting device simulator for device: ", deviceId, "\n");

    const deviceConfigPath = path.join(
        __dirname,
        `../../devices/${deviceId}.json`
    );
    const deviceConfig = JSON.parse(
        fs.readFileSync(deviceConfigPath, 'utf-8')
    );
    const device_id = deviceId;
    let interval;

    const connectionObj = {
        host: deviceConfig.connection.broker,
        username: deviceConfig.connection.username,
        password: deviceConfig.connection.password,
        publish_topic: deviceConfig.topic.read,
        subscribe_topic: deviceConfig.topic.read,
        device_id: device_id
    }

    const devicePayload = deviceConfig.payload;
    const rabbitMQClient = new RabbitMQClient(connectionObj);
    rabbitMQClient.connect(() => {
        safeLog(`
            =========================================================
                        ✅ Connected to MQTT broker!
            ---------------------------------------------------------
        
            COMMAND          DESCRIPTION
            start <sec>    🔹 Start publishing at an interval
            start          🔹 Publish a single message immediately
            stop           🔹 Stop all active publishing
            exit           🔹 Disconnect and close the simulator
        
            =========================================================
        `);
    });


    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.input.on('data', () => {
        currentInput = rl.line || '';
        rabbitMQClient.setCurrentInput(currentInput);
    });

    rl.on('line', (input) => {
        currentInput = '';
        rabbitMQClient.setCurrentInput(currentInput);
        input = input.split(' ');
        const status = input[0];
        const timeout = input[1] ? Number(input[1]) : 0;
        if (status.toLowerCase() === 'exit') {
            console.log("Stopping all processes... Goodbye! 👋");
            clearInterval(interval);
            rabbitMQClient.disconnect(() => {
                console.log("MQTT Disconnected.");
                rl.close();
                process.exit(0);
            });

        } else if (status.toLowerCase() === 'start') {
            const publish_topic = connectionObj.publish_topic;
            clearInterval(interval);
            if (timeout > 0) {
                const millisecondTime = timeout * 1000;
                interval = setInterval(() => {
                    const publish_message_dynamic = generate_publish_message(devicePayload);
                    const publish_message = JSON.stringify(publish_message_dynamic);
                    rabbitMQClient.publish(publish_topic, publish_message);
                }, millisecondTime);
            } else {
                const publish_message_dynamic = generate_publish_message(devicePayload);
                const publish_message = JSON.stringify(publish_message_dynamic);
                rabbitMQClient.publish(publish_topic, publish_message);
            }

        } else if (status.toLowerCase() === 'stop') {
            safeLog("⏹️ Stopping all publishing... No more messages will be sent.");
            clearInterval(interval);
        } else if (status.toLowerCase() === 'ack') {
            const publish_topic = `device/${device_id}/ack`;
            let publish_message;
            if (timeout || isNaN(timeout)) {
                safeLog("✅ Acknowledged as Success.");
            } else {
                safeLog("⏹️ Failed to Acknowledge");
            }
        }
    });
}


function safeLog(message) {
    readline.clearLine(process.stdout, 0);  // Clear current input line
    readline.cursorTo(process.stdout, 0);  // Move cursor to start
    console.log(message);                   // Print new log
    process.stdout.write(`> ${currentInput}`); // Restore user input
}