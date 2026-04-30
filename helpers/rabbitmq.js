const readline = require('readline');
const mqtt = require('mqtt');

class RabbitMQClient {
    constructor(connection) {
        this.connection = connection;
        this.client = null;
        this.currentInput = '';
    }

    connect(onConnectCallback) {
        this.client = mqtt.connect(this.connection.host, {
            username: this.connection.username,
            password: this.connection.password
        });

        const subscribe_topic = this.connection.subscribe_topic;

        this.client.on('error', (err) => {
            this.safeLog(`❌ MQTT Connection Error: ${err.message}`);
        });

        this.client.on('connect', () => {
            this.client.subscribe(subscribe_topic, { qos: 1 }, (err) => {
                if (err) {
                    this.safeLog(`❌ Failed to subscribe: ${err}`);
                } else {
                    this.safeLog(`✅ Subscribed to topic: ${subscribe_topic}`);
                    if (onConnectCallback) {
                        onConnectCallback();
                    }
                }
            });
        });

        this.client.on('message', async (topic, message) => {
            this.safeLog(`📩 Received message | Topic: "${topic}" | Message: "${message.toString()}"`);
        });
    }

    publish(topic, message) {
        if (this.client && this.client.connected) {
            this.client.publish(topic, message, (err) => {
                if (err) {
                    this.safeLog(`❌ Failed to publish to ${topic}: ${err}`);
                } else {
                    this.safeLog(`📤 Published to ${topic}: ${message}`);
                }
            });
        } else {
            this.safeLog(`❌ Cannot publish, MQTT client not connected.`);
        }
    }

    disconnect(callback) {
        if (this.client) {
            this.client.end(false, callback);
        } else if (callback) {
            callback();
        }
    }

    setCurrentInput(input) {
        this.currentInput = input;
    }

    safeLog(message) {
        readline.clearLine(process.stdout, 0);  // Clear current input line
        readline.cursorTo(process.stdout, 0);  // Move cursor to start
        console.log(message);                   // Print new log
        process.stdout.write(`> ${this.currentInput}`); // Restore user input
    }
}

module.exports = RabbitMQClient;