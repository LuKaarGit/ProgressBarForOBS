// Save as server.js
const WebSocket = require('ws');
const http = require('http');
const express = require('express');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Store the current values
let progressState = {
    title: 'PROGRESS',
    current: 50,
    min: 0,
    max: 100
};

// WebSocket connection handling
wss.on('connection', (ws) => {
    console.log('Client connected');
    
    // Send current state to newly connected client
    ws.send(JSON.stringify(progressState));

    // Handle incoming messages
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            progressState = { ...progressState, ...data };
            
            // Broadcast to all connected clients
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(progressState));
                }
            });
        } catch (e) {
            console.error('Error processing message:', e);
        }
    });
});

// Serve static files (for the control panel)
app.use(express.static('public'));

// Start server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
