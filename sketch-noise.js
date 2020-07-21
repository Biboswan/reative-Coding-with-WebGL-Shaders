const canvasSketch = require('canvas-sketch');
const { lerp } = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes');

const settings = {
  dimensions: [2048, 2048],
};

const sketch = () => {
  const colorCount = random.rangeFloor(2, 6);
  const palette = random.shuffle(random.pick(palettes)).slice(0, colorCount);

  const createGrid = () => {
    const points = [];
    const count = 50;

    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        const u = count <= 1 ? 0.5 : x / (count - 1);
        const v = count <= 1 ? 0.5 : y / (count - 1);
        const radius = Math.abs(random.noise2D(u, v)) * 0.05;
        points.push({
          //radius: random.value() * 0.01,
          radius,
          position: [u, v],
          color: random.pick(palette),
          rotation: random.noise2D(u, v),
        });
      }
    }

    return points;
  };

  //random.setSeed(10);
  const points = createGrid().filter(() => random.value() > 0.5);
  const margin = 400;
  console.log(points);

  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    points.forEach((data) => {
      const { position, radius, color, rotation } = data;
      const [u, v] = position;
      //const x = u * width;
      //const y = v * height;
      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, height - margin, v);

      context.save();
      context.fillStyle = color;
      context.font = `${radius * width}px Helvetica`;
      context.translate(x, y);
      context.rotate(rotation);
      context.fillText('=', 0, 0);
      context.restore();
    });
  };
};

canvasSketch(sketch, settings);
