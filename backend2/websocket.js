const WebSocket = require('ws');
const http = require('http');
const express = require('express');
const { SerialPort } = require('serialport'); // <-- updated import
const { ReadlineParser } = require('@serialport/parser-readline');

let wss;
let currNumber = 0;

/* Arduino */
const ARDUINO_PORT = '/dev/ttyS5'; // In WSL/Docker, make sure this exists (e.g., /dev/ttyS3)
const BAUD_RATE = 9600;

const port = new SerialPort({
  path: ARDUINO_PORT,
  baudRate: BAUD_RATE
});

const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

parser.on('data', (data) => {
    try {
        const jsonData = JSON.parse(data);
        if ([0, 1, 2].includes(jsonData.value)) {
            currNumber = jsonData.value; // Update from Arduino
        }
    } catch (err) {
        console.error('Invalid JSON from Arduino:', data);
    }
});

function init(server) {
    wss = new WebSocket.Server({ server });

    wss.on('connection', (ws) => {
        const interval = setInterval(() => {
            ws.send(JSON.stringify({ number: currNumber }));
        }, 5000);

        ws.on('close', () => {
            clearInterval(interval);
        });
    });
}

module.exports = { init };
