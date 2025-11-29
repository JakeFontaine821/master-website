const WebSocket = require('ws');
const server = new WebSocket.Server({ port: '3001' });
console.log('Websocket running on port 3001');

const { Buffer } = require('buffer');
const Utils = require('../Utils.js');

const CONNECTED_CLIENTS = [];
const QUEUED_PLAYERS = [];

server.on('connection', socket => {
    const newUuid = Utils.uuidv4();
    console.log('New Connection', newUuid);

    socket.on('message', message => {
        const parsedMessage = JSON.parse(Buffer.from(message).toString());
        const client = CONNECTED_CLIENTS.find(client => client.uuid === parsedMessage.uuid);

        switch(parsedMessage.key){
            case '__HEARTBEAT__': // heartbeat message
                // console.log('Heartbeat received from ', socket.uuid);
                break;
            case '__TEXT_MESSAGE__':
                sendToUsers(parsedMessage);
                break;

            case 'landing.name.set':
                Object.assign(client, { name: parsedMessage.name });
                break;
            case 'landing.queue.start':
                // socket.send(JSON.stringify({
                //     key: 3,
                //     existingPlayers: CONNECTED_CLIENTS.filter(client => client.socket.uuid !== socket.uuid).map(client => client.player)
                // }));

                // Send player spawn info to other players
                sendToUsers(parsedMessage, [client.uuid]);
                break;
            case 'landing.queue.stop':
                break;
            default:
                sendToUsers(parsedMessage, [socket.uuid]);
                break;
        };
    });

    // Store all connected clients and sockets
    CONNECTED_CLIENTS.push({
        socket,
        uuid: newUuid
    });
    socket.send(JSON.stringify({ uuid: newUuid }));

    // Handle on client close
    socket.on('close', () => {
        CONNECTED_CLIENTS.splice(CONNECTED_CLIENTS.findIndex(client => client.socket.uuid === socket.uuid), 1);
    });
});

const sendToUsers = (message={}, excludedUsers=[]) => {
    for(const client of CONNECTED_CLIENTS){
        if(excludedUsers.includes(client.socket.uuid)){ continue; }

        client.socket.send(JSON.stringify(message));
    }
};