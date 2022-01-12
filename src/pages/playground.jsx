import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { isBrowser } from '@/src/utils/browser';

let camera; let scene; let renderer; let
  hlight;
// let geometry, material, mesh;

if (isBrowser) {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xdddddd);
  /*
    fov — Camera frustum vertical field of view.
    aspect — Camera frustum aspect ratio.
    near — Camera frustum near plane.
    far — Camera frustum far plane.
  */
  //                                    fov         ➡      aspect        ➡        near  ➡  far
  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 5000);
  camera.position.z = 1;

  hlight = new THREE.AmbientLight(0x404040, 100); // soft white light
  scene.add(hlight);

  renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
  });
  renderer.setSize(window.innerWidth, window.innerHeight); // canvas size
  document.body.appendChild(renderer.domElement);

  const loader = new GLTFLoader();

  loader.load(
    'scene.gltf',
    (gltf) => {
      scene.add(gltf.scene);
      renderer.render(scene, camera);
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
