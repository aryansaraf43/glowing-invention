const WebSocket = require('ws');

const PORT = process.env.PORT || 5000;
const wss = new WebSocket.Server({ port: PORT });

let viewers = new Set();

wss.on('connection', function connection(ws, req) {
    const url = req.url;

    if (url === '/mobile') {
        console.log('Mobile camera connected');

        ws.on('message', (data) => {
            // Broadcast video data to all viewers
            viewers.forEach(viewer => {
                if (viewer.readyState === WebSocket.OPEN) {
                    viewer.send(data);
                }
            });
        });

        ws.on('close', () => {
            console.log('Mobile disconnected');
        });

    } else if (url === '/viewer') {
        console.log('Viewer connected');
        viewers.add(ws);

        ws.on('close', () => {
            viewers.delete(ws);
            console.log('Viewer disconnected');
        });
    }
});

console.log(`WebSocket server running on port ${PORT}`);
