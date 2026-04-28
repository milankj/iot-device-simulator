````markdown
# 🐇 IoT Simulator CLI

A CLI-based IoT device simulator built with Node.js and RabbitMQ (MQTT). This tool allows users to generate device configurations, simulate virtual IoT devices, and interact with them directly from the terminal.

---

## 🚀 Features

- CLI-based device simulator
- MQTT communication using RabbitMQ
- Interactive device control shell
- Device configuration generation
- Template-based device configs
- Config-driven simulation architecture
- Supports dynamic telemetry payloads

---

## ⚙️ Core Functionality

### Device Creation

Generate new device configurations interactively:

```bash
iot-sim device create
````

This creates a device config JSON file with default MQTT settings, topics, payload generators, and telemetry structure.

---

### Device Templates

Generate reusable device configurations from predefined templates:

```bash
iot-sim device template <deviceId>
```

Templates allow rapid creation of simulated IoT devices with standardized payload structures and topic mappings.

---

### Device Simulation

Start a virtual device simulator:

```bash
iot-sim device start <deviceId>
```

The simulator connects to RabbitMQ via MQTT and begins publishing/subscribing using the device configuration.

---

### Interactive Device Shell

Once a device is started, an interactive terminal session is opened for live device control.

Example controls:

* Publish telemetry
* Check device status
* Simulate reconnects
* Trigger failures
* Stop device simulation

---

## 🔄 How It Works

1. Device configs are stored as JSON files
2. CLI commands load and initialize virtual devices
3. Devices connect to RabbitMQ using MQTT
4. Telemetry payloads are generated dynamically
5. Interactive shell allows runtime device control

---

## 📁 Configuration Driven

The simulator is fully config-driven. Each virtual device contains:

* Device identity
* MQTT credentials
* Topic mappings
* Payload generators
* Simulation intervals

This allows reusable and scalable IoT simulations without modifying source code.

---

## 🧠 Use Cases

* MQTT testing
* IoT backend development
* Device simulation
* Event-driven system testing
* RabbitMQ integration testing
* Local IoT environment emulation

---

## 📄 License

This project is licensed under the MIT License.

```
```