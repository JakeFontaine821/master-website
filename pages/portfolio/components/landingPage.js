import AddStyle from '../js/Styles.js';

AddStyle(`
    .landing-page{
        width: 100vw;
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        position: relative;
        gap: 10px;
    }

    .landing-page div{
        z-index: 1;
        pointer-events: none;
        text-shadow: 0px 0px 5px var(--background);
    }
        
    .landing-page .name{
        font-size: 50px;
    }

    .landing-page .title{
        font-size: 22px;
    }

    .landing-page .sub-text{
        position: absolute;
        bottom: 10px;
        font-style: italic;
        pointer-events: none;
    }

    .landing-page canvas{
        position: absolute;
        width: 100vw;
        height: 100vh;
        top: 0px;
        left: 0px;
        z-index: 0;
    }    
`);

export default class LandingPage extends HTMLElement{
    constructor(){
        super();

        this.classList.add('landing-page');
        
        this.innerHTML = `
            <canvas width="1920px" height="1080px"></canvas>
            <div class="name">Jake Fontaine</div>
            <div class="title">Software Engineer</div>
            <div class="sub-text">(Click Anywhere)</div>
        `;

        const canvas = this.querySelector('canvas');
        const ctx = canvas.getContext("2d");
        let interval = 1000/60; // 240 times a second

        // setup the canvas to change resolution if the window changes size
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', () => resizeCanvas());

        class Node{
            constructor(x, y){
                this.x = x;
                this.y = y;
                this.radius = .1;
                this.nodeGrowthRate = .2;
                this.maxRadius = 10;
                this.connections = [];
            };

            drawNode(){
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI, true);
                ctx.closePath();
                ctx.fill();

                ctx.setLineDash([5, 3]);
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius + 4, 0, 2*Math.PI, true);
                ctx.closePath();
                ctx.stroke();

                if (this.radius < this.maxRadius) { this.radius += this.nodeGrowthRate; }
            };
        };

        class Grid{
            constructor(){
                this.startingNodeCount = 15;
                this.maxNodes = 25;
                this.nodeCount = 0;
                this.nodes = [];
                this.lineOffset = 0;
            };

            // Creates a new node at at pixel x and y
            createNewNode(x, y){
                let newNode = new Node(x, y);
                this.nodes.push(newNode);
                this.nodeCount > this.maxNodes ? this.nodes.shift() : this.nodeCount += 1;

                this.checkConnections();
            };

            // an onload function to creating some starting nodes
            createRandomNodes(){
                for (let i = 0; i < this.startingNodeCount; i++) { this.createNewNode(Math.floor(Math.random() * (canvas.width - 40)) + 20, Math.floor(Math.random() * (canvas.height - 40)) + 20); }
                this.checkConnections();
            };

            // Every time a node is created, reset the connections arrays
            checkConnections(){
                for(const node of this.nodes){
                    const distanceArray = this.nodes.map((checkNode, i) => ({ connectionIndex: i, distance: Math.sqrt(Math.pow(checkNode.x - node.x, 2) + Math.pow(checkNode.y - node.y, 2))}));
                    distanceArray.sort((a, b) => a.distance - b.distance);

                    node.connections = distanceArray.slice(1, 3);
                }
            };

            // draw all of the connections then all the nodes to ensure nodes on top of connections
            drawNodes(){
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = "#efffef";
                ctx.strokeStyle = "#afffaf";

                for(const [i, node] of this.nodes.entries()){
                    for(const {connectionIndex} of node.connections){
                        // see if we're connecting to a node thats further in the array, if true draw the connection
                        // OR if the node we're connecting too is earlier in the array, see if it already drew a connection to the current node
                        // this ensures all nodes have EXCLUSIVELY 2 connections
                        if (connectionIndex > i || !this.nodes[connectionIndex].connections.some(connectionObj => connectionObj.connectionIndex === i)) {
                            ctx.setLineDash([5, 3]);
                            ctx.lineDashOffset = this.lineOffset;
                            ctx.beginPath();
                            ctx.moveTo(node.x, node.y);
                            ctx.lineTo(this.nodes[connectionIndex].x, this.nodes[connectionIndex].y);
                            ctx.stroke();
                        }
                    }
                }

                for(const node of this.nodes){ node.drawNode(); }
            };
        };

        /*****************************************************************************************************************/
        /*****                                   Canvas set up and drawing                                           *****/
        /*****************************************************************************************************************/
        const grid = new Grid();
        grid.createRandomNodes();

        // User input for placing nodes
        canvas.addEventListener('mousedown', (e) => grid.createNewNode(e.clientX, e.clientY));

        const Animate = () => {    
            grid.drawNodes();

            // Increment the line offsets for the circling dashed lines
            grid.lineOffset >= 8 ? grid.lineOffset = 0 : grid.lineOffset += .2;
        };

        setInterval(() => Animate(), interval);
    };
};
customElements.define('landing-page', LandingPage);