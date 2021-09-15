// jshint esversion:6
import * as THREE from './threejs/three.module.js';
import {STLLoader} from './threejs/STLLoader.js';
import {OrbitControls} from './threejs/OrbitControls.js';
const scene = new THREE.Scene();
scene.add(new THREE.AxesHelper(5));

const light = new THREE.SpotLight();
light.position.set(20, 20, 20);
scene.add(light);

let light2 = new THREE.DirectionalLight(0xffffff);
light.position.set(0,0,10);
scene.add(light2);

let light3 = new THREE.DirectionalLight(0xffffff);
light2.position.set(0,0,-10);
scene.add(light3);

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.z = 10;

const renderer = new THREE.WebGLRenderer();
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const material = new THREE.MeshPhysicalMaterial({
    color: 0xBEC4B5,
    roughness: 0.1,
});

const loader = new STLLoader();
function myFunction() {
  // Get the checkbox
  var checkBox = document.getElementById("myCheck");
  console.log(checkBox);
  // Get the output text
  var text = document.getElementById("text");

  // If the checkbox is checked, display the output text
  if (checkBox.checked == true){

  } else {
    text.style.display = "none";
  }
}

loader.load(
    '3dmodels/FWMWK-lowerjaw.stl',
    function (geometry) {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.scale.set(0.1, 0.1, 0.1);
        mesh.position.set(0,-1,0);
        mesh.rotation.x = -Math.PI/2;
        scene.add(mesh);
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
    },
    (error) => {
        console.log(error);
    }
);

window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
}
function animate() {
    requestAnimationFrame(animate);

    controls.update();

    render();
}

function render() {
    renderer.render(scene, camera);
}

animate();
