import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

import { isBrowser } from '@/src/utils/browser';

let camera; let scene; let renderer; let hlight; let bloomComposer;
let robotModel; let directionalLight; let controls;
// let geometry, material, mesh;

function animate() {
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
  // camera.layers.set(0)
  bloomComposer.render();
}

function render() {
  renderer.render(scene, camera);
}

if (isBrowser) {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  /*
    fov — Camera frustum vertical field of view.
    aspect — Camera frustum aspect ratio.
    near — Camera frustum near plane.
    far — Camera frustum far plane.
  */
  //                                    fov         ➡      aspect        ➡        near  ➡  far
  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 500);
  camera.rotation.y = (85 / 180) * Math.PI; // 45°
  camera.position.x = 34;
  camera.position.y = 50;
  camera.position.z = 8;
  // camera.position.z = 1;

  renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
  });
  renderer.setSize(window.innerWidth, window.innerHeight); // canvas size
  document.body.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.addEventListener('change', render);

  hlight = new THREE.AmbientLight(0x404040, 100); // soft white light
  scene.add(hlight);

  directionalLight = new THREE.DirectionalLight(0xffffff, 100);
  directionalLight.position.set(0, 1, 0);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  // let light = new THREE.PointLight(0xc4c4c4,10);
  // light.position.set(0,300,500);
  // scene.add(light);

  // let light2 = new THREE.PointLight(0xc4c4c4,10);
  // light2.position.set(500,100,0);
  // scene.add(light2);

  // let light3 = new THREE.PointLight(0xc4c4c4,10);
  // light3.position.set(0,100,-500);
  // scene.add(light3);

  // let light4 = new THREE.PointLight(0xc4c4c4,10);
  // light4.position.set(-500,300,0);
  // scene.add(light4);

  const loader = new GLTFLoader();

  loader.load(
    'scene.gltf',
    (gltf) => {
      robotModel = gltf.scene && gltf.scene.children[0];
      robotModel.scale.set(0.5, 0.5, 0.5);
      scene.add(gltf.scene);
      // renderer.render(scene, camera);

      // composer = new EffectComposer(renderer);
      // let rendererScene = new RenderPass(scene, camera);
      // composer.addPass(new RenderPass(scene, camera));

      // const effectPass = new EffectPass(scene, camera);

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

      const color = new THREE.Color('#FD8813');
      const geometry = new THREE.IcosahedronGeometry(1, 15);
      const material = new THREE.MeshBasicMaterial({ color });
      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.set(0, 0, 0);
      scene.add(sphere);

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

export default function About() {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="leading-flat font-bold text-white">
        Welcome to Playground
      </h1>
      <canvas id="bg" />
      {/* {isBrowser && init()} */}
    </div>
  );
}
