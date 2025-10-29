const mazeTilesetImage = new Image();
mazeTilesetImage.src = '/games/images/maze-tiles.png';

const imageMap = new Map([
    ['1101', {
        image: mazeTilesetImage,
        frameX: 2,
        frameY: 0,
        bounds: { top: 20, right: 10, bottom: -1, left: 45, }
    }],
    ['1001', {
        image: mazeTilesetImage,
        frameX: 3,
        frameY: 0,
        bounds: { top: 20, right: -1, bottom: -1, left: 45, }
    }],
    ['1100', {
        image: mazeTilesetImage,
        frameX: 4,
        frameY: 0,
        bounds: { top: 20, right: 10, bottom: -1, left: -1, }
    }],
    ['0101', {
        image: mazeTilesetImage,
        frameX: 1,
        frameY: 1,
        bounds: { top: -1, right: 10, bottom: -1, left: 45, }
    }],
    ['0100', {
        image: mazeTilesetImage,
        frameX: 2,
        frameY: 1,
        bounds: { top: -1, right: 10, bottom: -1, left: -1, }
    }],
    ['0011', {
        image: mazeTilesetImage,
        frameX: 3,
        frameY: 1,
        bounds: { top: -1, right: -1, bottom: 7, left: 45, }
    }],
    ['0110', {
        image: mazeTilesetImage,
        frameX: 4,
        frameY: 1,
        bounds: { top: -1, right: 10, bottom: 7, left: -1, }
    }],
    ['1011', {
        image: mazeTilesetImage,
        frameX: 0,
        frameY: 2,
        bounds: { top: 20, right: -1, bottom: 7, left: 45, }
    }],
    ['1010', {
        image: mazeTilesetImage,
        frameX: 1,
        frameY: 2,
        bounds: { top: 20, right: -1, bottom: 7, left: -1, }
    }],
    ['0000', {
        image: mazeTilesetImage,
        frameX: 2,
        frameY: 2,
        bounds: { top: -1, right: -1, bottom: -1, left: -1, }
    }],
    ['1000', {
        image: mazeTilesetImage,
        frameX: 4,
        frameY: 2,
        bounds: { top: 20, right: -1, bottom: -1, left: -1, }
    }],
    ['1110', {
        image: mazeTilesetImage,
        frameX: 5,
        frameY: 2,
        bounds: { top: 20, right: 10, bottom: 7, left: -1, }
    }],
    ['0001', {
        image: mazeTilesetImage,
        frameX: 2,
        frameY: 3,
        bounds: { top: -1, right: -1, bottom: -1, left: 45, }
    }],
    ['0010', {
        image: mazeTilesetImage,
        frameX: 4,
        frameY: 3,
        bounds: { top: -1, right: -1, bottom: 7, left: -1, }
    }],
    ['0111', {
        image: mazeTilesetImage,
        frameX: 2,
        frameY: 4,
        bounds: { top: -1, right: 10, bottom: 7, left: 45, }
    }],
    ['1111', {
        image: mazeTilesetImage,
        frameX: 0,
        frameY: 0,
        bounds: { top: 20, right: 10, bottom: 7, left: 45, }
    }],
    ['goal', {
        image: mazeTilesetImage,
        frameX: 3,
        frameY: 4
    }]
]);

const player_idle_left = new Image();
player_idle_left.src = '/games/images/idle_left.png';

const player_idle_right = new Image();
player_idle_right.src = '/games/images/idle_right.png';

const player_running_left = new Image();
player_running_left.src = '/games/images/running_left.png';

const player_running_right = new Image();
player_running_right.src = '/games/images/running_right.png';

const playerImages = {
    'idle_left': { image: player_idle_left, frameCount: 4},
    'idle_right': { image: player_idle_right, frameCount: 4},
    'running_left': { image: player_running_left, frameCount: 3},
    'running_right': { image: player_running_right, frameCount: 3}
};

export {
    imageMap,
    playerImages
};