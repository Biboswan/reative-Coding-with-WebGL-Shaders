// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require('three');

// Include any additional ThreeJS examples below
require('three/examples/js/controls/OrbitControls');

const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes');

/** canvas-sketch webgl1.js --output=tmp/  cmd+shift+s saves all frames of 
the gif
https://giftool.surge.sh/
*/

const settings = {
  // Make the loop animated
  dimentions: [512, 512],
  fps: 24,
  duration: 4,
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: 'webgl',
};

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas,
  });

  const colorCount = random.rangeFloor(2, 6);
  const palette = random.shuffle(random.pick(palettes)).slice(0, colorCount);

  // WebGL background color
  renderer.setClearColor('hsl(0,0%,95%)', 1);

  // Setup a camera
  const camera = new THREE.OrthographicCamera();

  // Setup camera controller
  //const controls = new THREE.OrbitControls(camera, context.canvas);

  // Setup your scene
  const scene = new THREE.Scene();

  // Setup a geometry
  const geometry = new THREE.SphereGeometry(1, 32, 16);

  // Setup a mesh with geometry + material
  //Thumb rule finger : thumb:y, middle x, 1st finger: z
  for (let i = 0; i < 40; i++) {
    const mesh = new THREE.Mesh(
      geometry,
      new THREE.MeshStandardMaterial({
        color: random.pick(palette),
      })
    );
    mesh.position.set(
      random.range(-1, 1),
      random.range(-1, 1),
      random.range(-1, 1)
    );
    mesh.scale.set(
      random.range(-1, 1),
      random.range(-1, 1),
      random.range(-1, 1)
    );
    scene.add(mesh);
  }

  scene.add(new THREE.AmbientLight('hsl(0,0%,40%'));
  const light = new THREE.DirectionalLight('white', 1);
  light.position.set(0, 0, 4);
  scene.add(light);

  // draw each frame
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight);
      const aspect = viewportWidth / viewportHeight;
      const zoom = 2.5;

      // Bounds
      camera.left = -zoom * aspect;
      camera.right = zoom * aspect;
      camera.top = zoom;
      camera.bottom = -zoom;

      // Near/Far
      camera.near = -100;
      camera.far = 100;

      // Set position & look at world center
      camera.position.set(zoom, zoom, zoom);
      camera.lookAt(new THREE.Vector3());

      camera.updateProjectionMatrix();
    },
    // Update & render your scene here
    render({ playhead }) {
      //controls.update();
      renderer.render(scene, camera);
      scene.rotation.x = playhead * Math.PI * 2;
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      //controls.dispose();
      renderer.dispose();
    },
  };
};

canvasSketch(sketch, settings);
