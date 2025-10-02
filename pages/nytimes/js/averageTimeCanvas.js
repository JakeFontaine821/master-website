export function displayAverageTimes(canvasElement, times){
    const ctx = canvasElement.getContext('2d');
    const STEP_DIST = canvasElement.width / times.length;
    const MAX = Math.max(...times);
    times.reverse();

    // Draw the lines between the nodes
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-1, canvasElement.height);
    ctx.lineTo(-1, canvasElement.height - (times[0] / MAX) * canvasElement.height);
    for (const [i, time] of times.entries()) {
        const pixelHeight = (time / MAX) * canvasElement.height;
        ctx.lineTo((i * STEP_DIST) + (STEP_DIST / 2), canvasElement.height - pixelHeight);
    }
    ctx.lineTo(canvasElement.width + 1, canvasElement.height - (times[times.length-1] / MAX) * canvasElement.height);
    ctx.lineTo(canvasElement.width + 1, canvasElement.height);
    ctx.stroke();

    // Draw the nodes for the time
    ctx.strokeStyle = "#1e5c5c";
    ctx.fillStyle = "#3fcfcf";
    ctx.lineWidth = 2;
    for(const [i, time] of times.entries()){
        const pixelHeight = (time / MAX) * canvasElement.height;

        ctx.beginPath();
        ctx.arc((i * STEP_DIST) + (STEP_DIST / 2), canvasElement.height - pixelHeight, 5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    }
};