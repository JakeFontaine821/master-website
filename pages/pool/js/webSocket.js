(async () => {
    const socket = await new WebSocket('ws://localhost:3001');

    // We just spawned in, send player data to server
    // socket.onopen = () => { socket.send(JSON.stringify({ key: '__HEARTBEAT__', newPlayer: localPlayer })); };

    // listen for message
    socket.onmessage = ({ data }) => {
        const message = JSON.parse(data);

        switch(message.key){
            case 2:
                CONNECTED_PLAYERS.push(new Player(message.newPlayer));
                break;
            case 3:
                for(const player of message.existingPlayers){ CONNECTED_PLAYERS.push(new Player(player)); }
                break;
        };
    };

    socket.onclose = () => {
        window.clearInterval(HEART_BEAT_INTERVAL);
    };

    // example sent message
    // socket.send(JSON.stringify({ messageType: 1, message: '' }));

    const HEART_BEAT_INTERVAL = setInterval(() => socket.send(JSON.stringify({ key: '__HEARTBEAT__' })), 45_000);
})();

// const landingPage = document.querySelector('landing-page');
// landingPage.addEventListener('host', ({name}) => { console.log(name, ' wants to host a game') })