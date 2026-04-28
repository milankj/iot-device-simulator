const readline = require('readline');
const mqtt = require('mqtt');
const message_list = require("./publish_message");
const args = process.argv.slice(2);
let device_id = '', interval;
if (!args[0]) {
    console.error("❌ Error: A device id is required! \nUsage: node script.js <device-id>");
    process.exit(1);
}
device_id = args[0];
console.log('DEVICE ID: ', device_id);
let currentInput = '', client, publish_message_dynamic;

if (device_id && message_list[device_id]) {
    publish_message_dynamic = message_list[device_id]
} else {
    publish_message_dynamic = message_list['empty'];
}

const localhost_connection = {
    hostname: 'localhost',
    username: 'tech',
    password: 'tech',
    protocol: 'mqtt',
    port: 1883
};


const deployed_connection = {
    hostname: '15.206.51.214',
    username: 'tech',
    password: 'tech',
    protocol: 'mqtt',
    // clientId: 'device_123'
};
const options = {
    clientId: device_id, // No need to specify 'clean' since it defaults to true
    clean: false
};


/* CONNECT TO RABBITMQ*/
connect_and_subscribe_to_rabbimq(localhost_connection);

client.on('error', (error) => {
    console.error('MQTT client error:', error);
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


function safeLog(message) {
    readline.clearLine(process.stdout, 0);  // Clear current input line
    readline.cursorTo(process.stdout, 0);  // Move cursor to start
    console.log(message);                   // Print new log
    process.stdout.write(`> ${currentInput}`); // Restore user input
}

rl.input.on('data', () => {
    currentInput = rl.line || '';
});

function shutdown() {
    console.log("Stopping all processes... Goodbye! 👋");
    clearInterval(interval);
    if (client) {
        client.end(() => {
            console.log("MQTT Disconnected.");
            rl.close();
            process.exit(0);
        });
    } else {
        rl.close();
        process.exit(0);
    }
}

rl.on('SIGINT', () => {
    shutdown();
});

// Listen for user input
rl.on('line', (input) => {
    currentInput = '';
    input = input.split(' ');
    const status = input[0];
    const timeout = input[1] ? Number(input[1]) : 0;
    if (status.toLowerCase() === 'exit') {
        console.log("Stopping all processes... Goodbye! 👋");
        clearInterval(interval);
        client.end(() => {
            console.log("MQTT Disconnected.");
            rl.close();
            process.exit(0);
        });

    } else if (status.toLowerCase() === 'start') {
        const publish_topic = `device/${device_id}/reading`;
        const publish_message = publish_message_dynamic ? JSON.stringify(publish_message_dynamic) : status;
        clearInterval(interval);
        if (timeout > 0) {
            const millisecondTime = timeout * 1000;
            interval = setInterval(() => {
                publish_to_topic(publish_topic, publish_message);
            }, millisecondTime);
        } else {
            publish_to_topic(publish_topic, publish_message);
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



function connect_and_subscribe_to_rabbimq(connection) {
    client = mqtt.connect('mqtt://localhost:1883', {
        username: 'tech',
        password: 'tech'
    });

    client.on('connect', () => {
        console.log(`
            ========================================
            ✅ Connected to MQTT broker!
            ----------------------------------------
            🔹 To start publishing with interval:   type 'start <TIMEOUT IN SECONDS>'
            🔹 To Acknowledge:                      type 'ack < 1 or 0> 1 - success, 0 - failed'
            🔹 To start publishing once:            type 'start'
            🔹 To stop publishing:                  type 'stop'
            🔹 To exit the process:                 type 'exit'
            ========================================
        `);


        const subscribe_topic = `device/${device_id}/reading`;

        client.subscribe(subscribe_topic, { qos: 1 }, (err) => {
            if (err) {
                console.error('Failed to subscribe:', err);
            } else {
                console.log('Subscribed to topic: ', subscribe_topic);
            }
        });

        client.on('message', async (device_id, message) => {
            safeLog(`📩 Received message | Topic: "${subscribe_topic}" | Message: "${message.toString()}"`);
        });
    });
}


function publish_to_topic(publish_topic, publish_message) {
    client.publish(publish_topic, publish_message, (err) => {
        if (err) console.error('Failed to publish:', err);
        else safeLog(`📤 Published message | Topic: "${publish_topic}" | Message: "${publish_message}"`);
    });
}