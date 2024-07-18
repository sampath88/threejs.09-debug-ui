import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import GUI from "lil-gui";
import gsap from "gsap";

/* Debug */
const gui = new GUI({
  width: 500,
  title: "Debug Controls",
  closeFolders: false,
});
gui.close();
gui.hide();
const debugObject = {};

window.addEventListener("keydown", (event) => {
  if (event.key === "h") {
    gui.show(gui._hidden);
  }
});

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  //update renderer
  renderer.setSize(sizes.width, sizes.height);
});

window.addEventListener("dblclick", () => {
  let fullscreenElement =
    document.fullscreenElement || document.webkitFullscreenElement;
  if (!fullscreenElement) {
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen();
    } else if (canvas.webkitFullscreenElement) {
      canvas.webkitFullscreenElement();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
});

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Object
 */
debugObject.color = "#ff0000";
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({
  color: debugObject.color,
  //   wireframe: true,
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

const cubeTweaks = gui.addFolder("Awesome cube");
// cubeTweaks.close();
cubeTweaks.add(mesh.position, "y").min(-3).max(3).step(0.01).name("elevation");
cubeTweaks.add(mesh, "visible");
cubeTweaks.add(material, "wireframe");
cubeTweaks
  .addColor(debugObject, "color")
  .onChange(() => material.color.set(debugObject.color));

debugObject.spin = () => {
  gsap.to(mesh.rotation, { y: mesh.rotation.y + Math.PI * 1 });
};

gui.add(debugObject, "spin");

debugObject.subdivision = 2;
gui
  .add(debugObject, "subdivision")
  .min(1)
  .max(20)
  .step(1)
  .onFinishChange(() => {
    mesh.geometry.dispose();
    mesh.geometry = new THREE.BoxGeometry(
      1,
      1,
      1,
      debugObject.subdivision,
      debugObject.subdivision,
      debugObject.subdivision
    );
  });

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(
  /* Field of view: */ 75,
  /* Aspect Ratio: */ sizes.width / sizes.height,
  /* Near: */ 0.1,
  /* Far: */ 100
);

camera.position.z = 3;
camera.lookAt(mesh.position);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const tick = () => {
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
