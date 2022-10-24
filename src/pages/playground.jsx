import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

import { useLayoutEffect } from 'react';
import { isBrowser } from '@/src/utils/browser';

function Playground() {
  useLayoutEffect(() => {
    let camera; let scene; let renderer; let bloomComposer;
    let robotModel; let directionalLight; let controls; let starMesh;
    // let geometry, material, mesh;

    function animate() {
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
      starMesh.rotation.x += 0.001;
      // animate camera around the robot
      camera.position.x = robotModel.position.x + Math.sin(Date.now() / 1000) * 1;
      camera.position.y = robotModel.position.z + Math.cos(Date.now() / 1000) * 1;
      camera.lookAt(scene.position);
      bloomComposer.render();
    }

    function render() {
      renderer.render(scene, camera);
    }

    if (isBrowser) {
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x000000);
      //                                    fov         ➡      aspect        ➡        near  ➡  far
      camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 500);
      camera.rotation.y = (85 / 180) * Math.PI; // 85°
      // Set camera position vector 3 (x, y, z)
      camera.position.set(2.5, 18.46, 35.9);

      renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('#bg'),
      });
      renderer.setSize(window.innerWidth, window.innerHeight); // canvas size
      document.body.appendChild(renderer.domElement);

      controls = new OrbitControls(camera, renderer.domElement);
      controls.addEventListener('change', render);

      directionalLight = new THREE.DirectionalLight(0xffffff, 100);
      directionalLight.position.set(0, 1, 0);
      directionalLight.castShadow = true;
      scene.add(directionalLight);

      const loader = new GLTFLoader();

      loader.load(
        'scene.gltf',
        (gltf) => {
          robotModel = gltf.scene && gltf.scene.children[0];
          robotModel.scale.set(0.5, 0.5, 0.5);

          // move robotModel to down
          robotModel.position.y = -7.5;
          scene.add(gltf.scene);

          const rendererScene = new RenderPass(scene, camera);
          const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            1.5,
            0.4,
            0.85,
          );
          bloomPass.threshold = 0;
          bloomPass.strength = 1.5;
          bloomPass.radius = 0.9;

          bloomComposer = new EffectComposer(renderer);
          // bloomComposer.setSize(window.innerWidth, window.innerHeight);
          bloomComposer.renderToScreen = true;
          bloomComposer.addPass(rendererScene);
          bloomComposer.addPass(bloomPass);

          // Solar sphere effect
          const color = new THREE.Color('#FD8813');
          const geometry = new THREE.IcosahedronGeometry(0.6, 5);
          const material = new THREE.MeshBasicMaterial({ color });
          const sphere = new THREE.Mesh(geometry, material);
          sphere.position.set(0, -7.5, -1);
          scene.add(sphere);

          // Galaxy geometry
          const starGeometry = new THREE.SphereGeometry(80, 64, 64);

          // Galaxy material
          const starMaterial = new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load('textures/star-galaxy.png'),
            side: THREE.BackSide,
            transparent: true,
          });

          // Galaxy mesh
          starMesh = new THREE.Mesh(starGeometry, starMaterial);
          starMesh.layers.set(0);
          scene.add(starMesh);

          window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            bloomComposer.setSize(window.innerWidth, window.innerHeight);
          }, false);

          animate();
        },
        (xhr) => {
          // called while loading is progressing
          console.log(`${((xhr.loaded / xhr.total) * 100)}% loaded`);
        },
        (error) => {
          console.log('An error happened', error);
        },
      );
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="leading-flat font-bold text-white">
        Welcome to Playground
      </h1>
      <div>
        <canvas id="bg" />
      </div>
      {/* {isBrowser && init()} */}
    </div>
  );
}

export default Playground;
