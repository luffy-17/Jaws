// jshint esversion:6
import * as THREE from './threejs/three.module.js';
import {STLLoader} from './threejs/STLLoader.js';
import {OrbitControls} from './threejs/OrbitControls.js';
import { GUI } from './threejs/dat.gui.module.js';

const scene = new THREE.Scene();
scene.add(new THREE.AxesHelper(5));

const light = new THREE.PointLight( 0xffffff, 1 );
light.layers.enable( 0 );
light.layers.enable( 1 );


const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.layers.enable( 0 ); // enabled by default
camera.layers.enable( 1 );
camera.position.set(0,0,-10);

scene.add( camera );
camera.add( light );

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
    '3dmodels/FWMWK-upperjaw.stl',
    function (geometry) {
        const mesh_upperjaw = new THREE.Mesh(geometry, material);
        mesh_upperjaw.scale.set(0.1, 0.1, 0.1);
        mesh_upperjaw.position.set(0,1,0);
        mesh_upperjaw.rotation.x = -Math.PI/2;
        mesh_upperjaw.layers.set(0);
        scene.add(mesh_upperjaw);
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
    },
    (error) => {
        console.log(error);
    }
);
loader.load(
    '3dmodels/FWMWK-lowerjaw.stl',
    function (geometry) {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.scale.set(0.1, 0.1, 0.1);
        mesh.position.set(0,-1,0);
        mesh.rotation.x = -Math.PI/2;
        mesh.layers.set(1);
        scene.add(mesh);
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
    },
    (error) => {
        console.log(error);
    }
);

const layers = {

  'toggle lower': function () {

    camera.layers.toggle( 0 );

  },

  'toggle upper': function () {

    camera.layers.toggle( 1 );

  },

  'enable all': function () {

    camera.layers.enableAll();

  },

  'disable all': function () {

    camera.layers.disableAll();

  }

};

const gui = new GUI();
gui.add( layers, 'toggle lower' );
gui.add( layers, 'toggle upper' );
gui.add( layers, 'enable all' );
gui.add( layers, 'disable all' );

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
