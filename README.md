# 🐇 IoT Simulator CLI

A CLI-based IoT device simulator built with Node.js and RabbitMQ (MQTT). This tool allows users to generate device configurations, simulate virtual IoT devices, and interact with them directly from the terminal.

---

## 🚀 Features

- CLI-based IoT device simulation
- MQTT communication using RabbitMQ
- Interactive terminal device control
- Dynamic telemetry payload generation
- Config-driven simulation architecture
- JSON-based device configurations
- Runtime device interaction shell

---

## ⚙️ Installation

Install dependencies:

```bash
npm install
````

Install CLI globally from project root:

```bash
npm install -g .
```

---

## 🐳 RabbitMQ Setup (Docker)

This project includes a Docker Compose setup for running RabbitMQ with MQTT support enabled.

### Start RabbitMQ

Build and start the RabbitMQ container:

```bash
docker-compose up -d --build
````

This will:

* Build the RabbitMQ image
* Enable MQTT support
* Start RabbitMQ in detached mode
* Expose MQTT and Management UI ports

---

### Stop RabbitMQ

```bash
docker-compose down
```

---

### Reset RabbitMQ Data

To remove all persisted RabbitMQ data:

```bash
docker-compose down -v
```

Then start again:

```bash
docker-compose up -d --build
```

---

### RabbitMQ Management UI

Access the management dashboard:

```text
http://localhost:15672
```

Credentials are loaded from:

```text
rabbitmq.env
```

---

### Exposed Ports

| Port  | Purpose                |
| ----- | ---------------------- |
| 5672  | AMQP                   |
| 15672 | RabbitMQ Management UI |
| 1883  | MQTT                   |

```
```
---

## 🛠 Available Commands

### Create Device Configuration

Generate a new device configuration interactively:

```bash
iot-sim device create
```

This creates a device configuration JSON file with default MQTT topics, payload generators, and simulation settings.

Generated configs are stored in:

```bash
./devices/
```

---

### Generate Device Template

Generate a reusable device template configuration:

```bash
iot-sim device template <deviceId>
```

Example:

```bash
iot-sim device template sensor01
```

This creates a template-based configuration file for the provided device ID.

---

### Start Device Simulator

Start a virtual IoT device simulator:

```bash
iot-sim device start <deviceId>
```

Example:

```bash
iot-sim device start sensor01
```

The simulator loads the device configuration, connects to RabbitMQ using MQTT, and starts publishing/subscribing to device topics.

---

## 💻 Interactive Device Shell

Once a device simulator starts, an interactive terminal shell is opened for runtime control.

Example operations:

* Publish telemetry
* Check device status
* Simulate reconnects
* Trigger failures
* Stop device simulation

---

## 🔄 How It Works

1. Device configurations are stored as JSON files
2. CLI commands initialize virtual devices
3. Devices connect to RabbitMQ via MQTT
4. Telemetry payloads are dynamically generated
5. Interactive shell allows live device control

---

## 📁 Configuration Driven

Each simulated device is fully config-driven and contains:

* Device identity
* MQTT credentials
* Topic mappings
* Payload generators
* Simulation intervals

This enables scalable IoT simulation without modifying source code.

---

## 🧠 Use Cases

* MQTT testing
* IoT backend development
* Event-driven architecture testing
* RabbitMQ integration testing
* Local IoT environment simulation
* Device telemetry emulation

---

## 📄 License

This project is licensed under the MIT License.

```
```