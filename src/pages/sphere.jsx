import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Canvas from '../common/components/Canvas';
import { isBrowser } from '../utils/browser';

function Sphere() {
  const canvasRef = useRef({});
  let geometry;
  let material;
  let mesh;
  let camera;
  let renderer;
  let controls;
  const scene = new THREE.Scene();

  const setGeometry = () => {
    geometry = new THREE.SphereGeometry(1, 32, 32);
  };
  const setMaterial = () => {
    material = new THREE.MeshBasicMaterial({ wireframe: true });
  };
  const setMesh = () => {
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
  };

  useEffect(() => {
    if (isBrowser) {
      const canvas = canvasRef.current;
      const sizes = {
        width: window.innerWidth,
        height: window.innerHeight,
      };

      const render = () => {
        renderer.render(scene, camera);
      };
      scene.background = new THREE.Color(0x000000);
      camera = new THREE.PerspectiveCamera(6, sizes.width / sizes.height, 0.01, 500);
      camera.rotation.y = (85 / 180) * Math.PI; // 85°
      // Set camera position vector 3 (x, y, z)
      camera.position.set(0, 0, 35.9);

      renderer = new THREE.WebGLRenderer({
        canvas,
      });
      renderer.setSize(sizes.width, sizes.height); // canvas size
      controls = new OrbitControls(camera, renderer.domElement);
      controls.addEventListener('change', render);
      setGeometry();
      setMaterial();
      setMesh();
      render();
    }
  }, []);
  return (
    <div className="Canvas">
      <Canvas ref={canvasRef} className="sphere" />
    </div>
  );
}

export default Sphere;
