import AddStyle from '../js/Styles.js';
import { getEasternDateString, formatSecondsToHMS } from '../js/utils.js';
import { imageMap, playerImages } from '../js/mazeImageManager.js';

import './pausePopup.js';
import './winPopup.js';

AddStyle(`
    .maze-page .config-row{
        width: 100%;
        height: 50px;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 5px;
        fill: var(--text);
        border-top: 2px solid var(--shadow-background);
        border-bottom: 2px solid var(--shadow-background);
    }

    .maze-page .config-row > *{
        user-select: none;
        cursor: pointer;
        display: flex;
        align-self: center;
    }

    .maze-page canvas{
        width: 800px;
        height: 640px;
        image-rendering: pixelated;
        border: 1px solid black;
    }
`);

export default class MazePage extends HTMLElement{
    constructor(){
        super();

        this.classList.add('maze-page', 'page', 'hidden');

        this.ORIGINAL_TILE_SIZE = 32;
        this.TILE_SCALE = 5; // 5
        this.WIN_DISTANCE = 30;
        this.innerHTML = `
            <div class="page-container">
                <div class="header-row">Maze Crossword :)</div>
                <div class="config-row">
                    <div class="timer-display">00:00</div>
                    <div class="pause-button"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M360-320h80v-320h-80v320Zm160 0h80v-320h-80v320ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg></div>
                </div>
                <div class="game-section">
                    <!--<canvas width="552px" height="460px">-->
                    <canvas width="${this.TILE_SCALE * 60}px" height="${this.TILE_SCALE * 50}px">
                </div>
                <pause-popup></pause-popup>
                <win-popup></win-popup>
            </div>
        `;

        (async () => {
            let apiCall;

            while (!apiCall) {
                try{
                    const response = await fetch('/games/maze');
                    if(!response.ok){ throw new Error(`HTTP error, Status: ${response.status}`); };

                    apiCall = response;
                }
                catch (err){
                    console.error('Api call failed, retrying in 5s...', err);
                    await new Promise(resolve => setTimeout(resolve, 5000));
                }
            }

            this.saveObject = {
                'name': 'AAA',
                'time': 0,
                'dateString': getEasternDateString(),
            };

            const { grid, goal } = await apiCall.json();
            this.grid = grid;
            this.goal = goal;

            this.canvas = this.querySelector('canvas');
            this.ctx = this.canvas.getContext('2d');
            this.ctx.imageSmoothingEnabled = false;

            this.worldX = (this.canvas.width/2) - ((grid.length * this.TILE_SCALE * this.ORIGINAL_TILE_SIZE) / 2);
            this.worldY = (this.canvas.height/2) - ((grid[0].length * this.TILE_SCALE * this.ORIGINAL_TILE_SIZE) / 2);
            this.currentTile = grid[6][6];

            this.playerFrame = 0;
            this.action = 'idle';
            this.direction = 'left';
            this.timeLastFrameSwitch = Date.now();

            /**********************************************************************************************************/
            /*                                      GENERAL GAME STUFF                                                */
            /**********************************************************************************************************/

            // Setup play timer variables
            this.elapsedMilliseconds = 0;
            this.playTime = 0;

            // Setup pause and resume functionality
            const pausePopup = this.querySelector('.pause-popup');
            this.querySelector('.pause-button').addEventListener('click', () => {
                if(!this.playing){ return; }

                pausePopup.classList.remove('hidden');
                this.stopTime();
            });
            pausePopup.addEventListener('resume', () => {
                pausePopup.classList.add('hidden');
                this.startTime();
            });

            const setKeyInput = (e, keydown=false) => {
                if(this.classList.contains('hidden') || !this.playing){ return; }

                // Arrow keys navigate the board, all that changes between them is math
                if(e.key === 'ArrowUp' || e.key.toLowerCase() === 'w'){ this.up = keydown; }
                else if(e.key === 'ArrowDown' || e.key.toLowerCase() === 's'){ this.down = keydown; }
                else if(e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a'){ this.left = keydown; }
                else if(e.key === 'ArrowRight' || e.key.toLowerCase() === 'd'){ this.right = keydown; }
            }

            // Define player input
            document.addEventListener('keydown', (e) => setKeyInput(e, true));
            document.addEventListener('keyup', (e) => setKeyInput(e, false));

            // Listen to when user wants to save to database
            const winPopup = this.querySelector('.win-popup');
            winPopup.addEventListener('submit', async ({name}) => {
                try{
                    this.saveObject['name'] = name;
                    this.saveObject['time'] = parseFloat((this.playTime + (this.elapsedMilliseconds / 1000)).toFixed(4));

                    const saveResponse = await fetch('/games/maze/times/set', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(this.saveObject)
                    });
                    if (!saveResponse.ok) { throw new Error(`HTTP error! Status: ${saveResponse.status}`); }

                    const data = await saveResponse.json();
                    if (!data.success) { throw new Error(data.error); }

                    setTimeout(() => {
                        winPopup.showSavedText();
                        this.dispatchEvent(new Event('reload-leaderboards'));
                    }, 300);
                }
                catch(err){ console.error('Error saving time: ', err); }
            });

            this.dispatchEvent(new Event('loaded'));
        })();
    };

    gameFunction(){
        // Game goes here lol
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const drawSize = this.TILE_SCALE * this.ORIGINAL_TILE_SIZE;

        //*********************************************UPDATE*********************************************

        // Helper vars used for following two sets
        const pixelOffsetFromWorldX = (this.canvas.width/2) - this.worldX;
        const pixelOffsetFromWorldY = (this.canvas.height/2) - this.worldY;
        
        // Find the pixel the player is on relative to the tile theyre on
        const pixelOffsetOnTileX = pixelOffsetFromWorldX % drawSize;
        const pixelOffsetOnTileY = pixelOffsetFromWorldY % drawSize;
        
        // Find the tile indexes the player is on
        const currentTileX = Math.floor(pixelOffsetFromWorldX / drawSize);
        const currentTileY = Math.floor(pixelOffsetFromWorldY / drawSize);

        // Get the tile obj for the current players location
        const currentTileObj = imageMap.get(this.grid[currentTileY][currentTileX]);

        // Allow movement if the keys are pressed AND if the bounds allow it
        if(this.up || this.down || this.left || this.right){
            this.action = 'running';

            if(this.up && pixelOffsetOnTileY > currentTileObj.bounds.top){ this.worldY += (this.left || this.right ? 2 : 3); }
            else if(this.down && pixelOffsetOnTileY < (drawSize - (currentTileObj.bounds.bottom * this.TILE_SCALE))){ this.worldY -= (this.left || this.right ? 2 : 3); }

            if(this.left && pixelOffsetOnTileX > currentTileObj.bounds.left){
                this.worldX += (this.up || this.down ? 2 : 3);
                this.direction = 'left';
            }
            else if(this.right && pixelOffsetOnTileX < (drawSize - (currentTileObj.bounds.right * this.TILE_SCALE))){
                this.worldX -= (this.up || this.down ? 2 : 3);
                this.direction = 'right';
            }
        }
        else{
            this.action = 'idle';
        }
        

        // PLAYER WIN CONDITION
        const goalX = this.worldX + (this.goal[0] * drawSize) + (drawSize / 2);
        const goalY = this.worldY + (this.goal[1] * drawSize) + (drawSize / 2);
        const playerX = this.canvas.width/2;
        const playerY = this.canvas.height/2;
        const goalDistanceFromPlayer = Math.sqrt(Math.pow(goalX - playerX, 2) + Math.pow(goalY - playerY, 2));
        if(goalDistanceFromPlayer <= this.WIN_DISTANCE){
            this.stopTime();
            const winPopup = this.querySelector('.win-popup');
            winPopup.setTime(this.querySelector('.timer-display').innerHTML);
            winPopup.classList.remove('hidden');
        }

        //*********************************************DRAW*********************************************

        // Draw World
        for (let y = 0; y < this.grid.length; y++) {
            for (let x = 0; x < this.grid[y].length; x++) {

                const pixelTileLocationX = this.worldX + (x * drawSize);
                const pixelTileLocationY = this.worldY + (y * drawSize);

                const imageObj = imageMap.get(this.grid[y][x]);
                this.ctx.drawImage(imageObj.image, 
                    imageObj.frameX*this.ORIGINAL_TILE_SIZE, 
                    imageObj.frameY*this.ORIGINAL_TILE_SIZE, 
                    this.ORIGINAL_TILE_SIZE, 
                    this.ORIGINAL_TILE_SIZE, 
                    pixelTileLocationX, 
                    pixelTileLocationY, 
                    drawSize, 
                    drawSize
                );
            }
        }

        // Draw Goal
        const goalImage = imageMap.get('goal');
        this.ctx.drawImage(goalImage.image, 
            goalImage.frameX*this.ORIGINAL_TILE_SIZE,
            goalImage.frameY*this.ORIGINAL_TILE_SIZE,
            this.ORIGINAL_TILE_SIZE,
            this.ORIGINAL_TILE_SIZE,
            this.worldX + (this.goal[0] * drawSize),
            this.worldY + (this.goal[1] * drawSize),
            drawSize,
            drawSize
        );

        // Draw Player
        const playerObject = playerImages[`${this.action}_${this.direction}`];
        if(Date.now() - this.timeLastFrameSwitch >= 225){
            this.timeLastFrameSwitch = Date.now();
            this.playerFrame = (this.playerFrame + 1) % playerObject.frameCount;
        }

        const playerSize = drawSize / 2;
        this.ctx.drawImage(playerObject.image, 
            this.ORIGINAL_TILE_SIZE*this.playerFrame,
            0,
            this.ORIGINAL_TILE_SIZE,
            this.ORIGINAL_TILE_SIZE,
            (this.canvas.width/2) - (playerSize/2),
            (this.canvas.height/2) - (playerSize/2),
            playerSize,
            playerSize
        );
    };

    startTime(){
        if(this.timer){ return; }

        this.lastCheckedTime = Date.now();
        this.timer = setInterval(() => {
            const now = Date.now();
            this.elapsedMilliseconds += now - this.lastCheckedTime;
            this.lastCheckedTime = now;

            if(this.elapsedMilliseconds >= 1000){
                this.playTime += Math.floor(this.elapsedMilliseconds / 1000);
                this.elapsedMilliseconds = this.elapsedMilliseconds % 1000;

                // Update UI
                this.querySelector('.timer-display').innerHTML = formatSecondsToHMS(this.playTime);
            }

            this.gameFunction();
        }, 1000/60);

        this.playing = true;
    };

    stopTime(){
        if(!this.timer){ return; }

        window.clearInterval(this.timer);
        this.timer = null;

        this.playing = false;
    };

    show(){
        this.startTime();
        this.classList.remove('hidden');
    };

    hide(){
        this.stopTime();
        this.classList.add('hidden');
    };
};
customElements.define('maze-page', MazePage);