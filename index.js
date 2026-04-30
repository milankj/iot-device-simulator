#!/usr/bin/env node

const { Command } = require('commander');
const createDevice = require('./commands/device/create');
const generateDeviceTemplate = require("./commands/device/template");
const startDevice = require("./commands/device/start");

const program = new Command();

program
    .name('iot-sim')
    .description('IoT Device Simulator');

const device = program.command('device');

device
    .command('create')
    .description('Create a new device config')
    .action(createDevice);

device
    .command('template <deviceId>')
    .description('Create a template device config')
    .action(generateDeviceTemplate);

device
    .command('start <deviceId>')
    .description('Start a device simulator')
    .action(startDevice);

program.parse();