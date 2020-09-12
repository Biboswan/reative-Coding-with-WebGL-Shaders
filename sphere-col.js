
// Ensure ThreeJS is in global scope for the 'examples/'global.THREE = require('three');
global.THREE = require('three');
// Include any additional ThreeJS examples below
require('three/examples/js/controls/OrbitControls');

const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');

const settings = {
  // Make the loop animated
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: 'webgl',
};

const glossary = ['Javascript', 'Python', 'Go', 'Nodejs', 'Rust', 'C++', 'React', 'Angular', 'Vue', 'Optimisation', 
'Performance', 'Scalability', 'Figma', 'CAT Theorem', 'AWS', 'Google Cloud', 'Bugs', 'Gatsby', 'Netlify', 'NextJS', 'Accessibility', 
'PWA', 'BlackLivesMatter', 'Agile', 'DevOps', 'GraphQL', 'postgres', 'mongo', 'elastic search', 'docker', 'kubernetes'];

random.pick(glossary);

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas,
  });

  // WebGL background color
  renderer.setClearColor('black', 1);

  // Setup a camera
  const camera = new THREE.PerspectiveCamera(50, 1, 1, 100);
  camera.position.set(0, 0, 4);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera, context.canvas);

  // Setup your scene
  const scene = new THREE.Scene();
  //scene.background =  new THREE.Color(0x7D86F7);
  const light = new THREE.DirectionalLight(0xffffff);
  light.position.set(0,0,1);
  scene.add(light);
  // Setup a geometry
  const geometry = new THREE.SphereGeometry(1,32,16);
  //const geometry = new THREE.SphereBufferGeometry(1,32,16);
  const loader = new THREE.TextureLoader();
  //const texture = loader.load('https://threejsfundamentals.org/threejs/resources/images/star.png');
  const texture = loader.load('webwords.png');
  // Setup a material  try: MeshPhongMaterial for perf
  const material = new THREE.MeshPhongMaterial({
    //wireframe: true,
    flatShading: true,
	vertexColors: true,
    shininess: 0,
    color:0xff8f44,
    map: texture
  });

  // Setup a mesh with geometry + material
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  const exporter = new GLTFExporter();
  exporter.parse( scene, function ( gltf ) {
	console.log( gltf );
	downloadJSON( gltf );
}, options );
  /** 
  const exporter = new THREE.GLTFExporter();
  const options = {
    trs: false,
    onlyVisible: true,
    truncateDrawRange: true,
    binary: false,
    forceIndices: false,
    forcePowerOfTwoTextures: false
  };

  exporter.parse( that.scene.children[viewer.scene.children.length-1], function(gltf){
    //FBX Model is the last thing added to the scene.
    var stringfied = JSON.stringify(gltf, null, 2);

    require("fs").writeFile( "./models/103_test.gltf", stringfied, 'utf8', function(err) {
        console.log(err);
    });     
    console.log(stringfied);
}, options );

**/


  // draw each frame
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight, false);
      camera.aspect = viewportWidth / viewportHeight;
      camera.updateProjectionMatrix();
    },
    // Update & render your scene here
    render({ time }) {
      controls.update();
      renderer.render(scene, camera);
      mesh.rotation.y = time * 0.5;
      mesh.rotation.x = time * 0.5;
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      controls.dispose();
      renderer.dispose();
    },
  };
};

canvasSketch(sketch, settings);
