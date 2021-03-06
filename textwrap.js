
    'use strict';

    /* global THREE */

    function main() {
      const canvas = document.querySelector('#c');
      const renderer = new THREE.WebGLRenderer({canvas});

      const fov = 40;
      const aspect = 2;  // the canvas default
      const near = 0.1;
      const far = 1000;
      const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
      camera.position.z = 70;

      const scene = new THREE.Scene();
      scene.background = new THREE.Color('black');

      function addLight(...pos) {
        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(...pos);
        scene.add(light);
      }
      addLight(-4, 4, 4);
      addLight(5, -4, 4);

      const lettersTilt = new THREE.Object3D();
      scene.add(lettersTilt);
      lettersTilt.rotation.set(
         THREE.Math.degToRad(-15),
         0,
         THREE.Math.degToRad(-15));
      const lettersBase = new THREE.Object3D();
      lettersTilt.add(lettersBase);
      {
        const letterMaterial = new THREE.MeshPhongMaterial({
          color: 'red',
        });  
        const loader = new THREE.FontLoader();
        loader.load('https://threejsfundamentals.org/threejs/resources/threejs/fonts/helvetiker_regular.typeface.json', (font) => {
          const spaceSize = 1.0;
          let totalWidth = 0;
          let maxHeight = 0;
          const letterGeometries = {
            ' ': { width: spaceSize, height: 0 }, // prepopulate space ' '
          };
          const size = new THREE.Vector3();
          const str = 'threejs fundamentals ';
          const letterInfos = str.split('').map((letter, ndx) => {
            if (!letterGeometries[letter]) {
              const geometry = new THREE.TextBufferGeometry(letter, {
                font: font,
                size: 3.0,
                height: .2,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.5,
                bevelSize: .3,
                bevelSegments: 5,
              });
              geometry.computeBoundingBox();
              geometry.boundingBox.getSize(size);
              letterGeometries[letter] = {
                geometry,
                width: size.x / 2, // no idea why size.x is double size
                height: size.y,
              };
            }
            const {geometry, width, height} = letterGeometries[letter];
            const mesh = geometry
                ? new THREE.Mesh(geometry, letterMaterial)
                : null;
            totalWidth += width;
            maxHeight = Math.max(maxHeight, height);
            return {
              mesh,
              width,
            };
          });
          let t = 0;
          const radius = totalWidth / Math.PI;
          for (const {mesh, width} of letterInfos) {
            if (mesh) {
              const offset = new THREE.Object3D();
              lettersBase.add(offset);
              offset.add(mesh);
              offset.rotation.y = t / totalWidth * Math.PI * 2;
              mesh.position.z = radius;
              mesh.position.y = -maxHeight / 2;
            }
            t += width;
          }
          {
            const geo = new THREE.SphereBufferGeometry(radius - 1, 32, 24);
            const mat = new THREE.MeshPhongMaterial({
             color: 'cyan',
            });
            const mesh = new THREE.Mesh(geo, mat);
            scene.add(mesh);
          }
          camera.position.z = radius * 3;
        });
      }

      function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
          renderer.setSize(width, height, false);
        }
        return needResize;
      }

      function render(time) {
        time *= 0.001;

        if (resizeRendererToDisplaySize(renderer)) {
          const canvas = renderer.domElement;
          camera.aspect = canvas.clientWidth / canvas.clientHeight;
          camera.updateProjectionMatrix();
        }
        
        lettersBase.rotation.y = time * -0.5;

        renderer.render(scene, camera);

        requestAnimationFrame(render);
      }

      requestAnimationFrame(render);
    }

    main();
