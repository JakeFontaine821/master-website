var canvas = document.querySelector('canvas');
var ctx = canvas.getContext("2d");
let maxWidth = canvas.width;
let maxHeight = canvas.height;

let interval = 1000/240; // 240 times a second

/*****************************************************************************************************************/
/*****                                         Resizing Canvas                                               *****/
/*****************************************************************************************************************/
function ResizeCanvas(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    maxWidth = canvas.width;
    maxHeight = canvas.height;
}
ResizeCanvas();

window.addEventListener("resize", () => {
    ResizeCanvas();
})

/*****************************************************************************************************************/
/*****                                        Mouse Click Input                                              *****/
/*****************************************************************************************************************/
let canClick = true;

canvas.addEventListener('click', (event) => {OnMouseClick(event);});

function OnMouseClick(_event) {
    if(canClick) {
        canClick = false;

        const rect = canvas.getBoundingClientRect();
        const x = _event.clientX - rect.left;
        const y = _event.clientY - rect.top;
      
        grid.ClickNewNode(x, y);

        setTimeout(() => {
            canClick = true;
        }, 100)
    }    
}

/*****************************************************************************************************************/
/*****                                             Functions                                                 *****/
/*****************************************************************************************************************/

function randomRange(high, low) {
    return Math.random() * (high-low) + low;
}

function Node() {
    this.x = 400;
    this.y = 400;
    this.radius = .1;
    this.nodeGrowth = .1;
    this.maxRadius = 10;
    this.connections = [];

    this.drawNode = function(){
        ctx.save();
            ctx.beginPath();
            ctx.translate(this.x, this.y);
            ctx.arc( 0, 0, this.radius, 0, 2*Math.PI, true);
            ctx.closePath();
            ctx.fill();

            ctx.setLineDash([5, 3]);
            ctx.beginPath();
            ctx.arc( 0, 0, this.radius + 4, 0, 2*Math.PI, true);
            ctx.closePath();
            ctx.stroke();
        ctx.restore();

        if (this.radius < this.maxRadius) { this.radius += this.nodeGrowth; }
    }
}

function Grid() {
    this.startingNodeCount = 15;
    this.maxNodes = 25;
    this.nodeCount = 0;
    this.nodes = [];
    this.lineOffset = 0;
    
    this.ClickNewNode = function(_x, _y) {
        if(this.nodeCount + 1 > this.maxNodes) {
            this.nodes.shift();
        }
        else {
            this.nodeCount += 1;
        }

        let newNode = new Node();
            newNode.x = _x;
            newNode.y = _y;
        this.nodes.push(newNode);

        this.CheckConnections();
    }

    this.StartingNodes = function(_x, _y) {
        let newNode = new Node();
            newNode.x = _x;
            newNode.y = _y;
        this.nodes.push(newNode);
    }

    this.CheckConnections = function() {
        for (let i = 0; i < this.nodes.length; i++) {
            /* [0] = node index | [1] = node distance */
            var first = [0, 10000];
            var second = [0, 10000];

            for (let j = 0; j < this.nodes.length; j++) {
                if(j != i) {
                    var xDist = this.nodes[j].x - this.nodes[i].x;
                    var yDist = this.nodes[j].y - this.nodes[i].y;
                    var distance = Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));

                    if (distance <= first[1]) {
                        second = first;
                        first = [j, distance];
                    }
                    else if (distance <= second[1]) {
                        second = [j, distance];
                    }
                }
            }

            this.nodes[i].connections = [first[0], second[0]];
        }
    }

    this.CreateRandomNodes = function() {
        for (let i = 0; i < this.startingNodeCount; i++) {
            let newX = randomRange(maxWidth - 20, 20);
            let newY = randomRange(maxHeight - 20, 20);
            this.StartingNodes( newX, newY);

            this.nodeCount += 1;
        }

        this.CheckConnections();
    }

    this.DrawNodes = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#efffef";
        ctx.strokeStyle = "#afffaf";

        for (let i = 0; i < this.nodes.length; i++) {
            /* Draw Connections */
            for (let j = 0; j < 2; j++) {
                /* Connection is to Node of height index *//* Connect is to Node that hasn't already drawn connection to it 
                                                                        i.e. No connection double up */
                if ((this.nodes[i].connections[j] > i) || (this.nodes[this.nodes[i].connections[j]].connections[0] != i && 
                                                           this.nodes[this.nodes[i].connections[j]].connections[1] != i)) { 
                    ctx.setLineDash([5, 3]);
                    ctx.lineDashOffset = this.lineOffset;
                    ctx.beginPath();
                    ctx.moveTo(this.nodes[i].x, this.nodes[i].y);
                    ctx.lineTo(this.nodes[this.nodes[i].connections[j]].x, this.nodes[this.nodes[i].connections[j]].y);
                    ctx.stroke();
                }
            }
        }

        for (let i = 0; i < this.nodes.length; i++) {
            /* Draw Node, doing this separetly because I want nodes to be drawn on top of connection lines */
            this.nodes[i].drawNode();
        }
    }
}

/*****************************************************************************************************************/
/*****                                   Canvas set up and drawing                                           *****/
/*****************************************************************************************************************/
grid = new Grid();
grid.CreateRandomNodes();

function Animate() {    
    grid.DrawNodes();

    if(grid.lineOffset >= 8){
        grid.lineOffset = 0;
    }
    else{
        grid.lineOffset += .1;
    }
}

setInterval(Animate, interval);