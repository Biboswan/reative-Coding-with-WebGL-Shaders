const canvasSketch = require('canvas-sketch');

/** 
const settings = {
  dimensions: [ 2048, 2048 ]
};
*/

const settings = {
  dimensions: 'A4',
  pixelsPerInch: 300,
  orientation: 'landscape',
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'green';
    context.fillRect(0, 0, width, height);

    context.beginPath();
    context.arc(width / 2, height / 2, width * 0.2, 0, Math.PI * 2, false);
    context.fillStyle = 'yellow';
    context.fill();
    context.lineWidth = width * 0.05;
    context.strokeStyle = 'orange';
    context.stroke();
  };
};

canvasSketch(sketch, settings);
