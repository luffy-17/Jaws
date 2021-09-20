// jshint esversion:6
import * as THREE from './threejs/three.module.js';
import {STLLoader} from './threejs/STLLoader.js';
import {TrackballControls} from './threejs/TrackballControls.js';
import { GUI } from './threejs/dat.gui.module.js';

let perspectiveCamera, orthographicCamera, controls;
const params = {orthographicCamera: false};
const frustumSize = 100;


//
// light.layers.enable( 0 );
// light.layers.enable( 1 );

const aspect = window.innerWidth / window.innerHeight;

perspectiveCamera = new THREE.PerspectiveCamera(
    75,
    aspect,
    0.1,
    1000);

perspectiveCamera.layers.enable( 0 ); // enabled by default
perspectiveCamera.layers.enable( 1 );
perspectiveCamera.position.set(0,0,-10);
orthographicCamera = new THREE.OrthographicCamera(
    frustumSize * aspect / -2,
    frustumSize * aspect / 2,
    frustumSize / 2,
    frustumSize / -2,
    0.1, 1000);
orthographicCamera.layers.enable( 0 ); // enabled by default
orthographicCamera.layers.enable( 1 );
orthographicCamera.position.set(0,0,-10);

// world

let scene = new THREE.Scene();
scene.background = new THREE.Color(0xcccccc);

const light = new THREE.DirectionalLight(0xffffff);
light.position.set(-1, -1, -1);
scene.add(light);
light.layers.enable( 0 );
light.layers.enable( 1 );
scene.add(new THREE.AxesHelper(5));



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

let renderer = new THREE.WebGLRenderer({});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const layers = {

  'toggle lower': function () {

    perspectiveCamera.layers.toggle( 0 );
    orthographicCamera.layers.toggle(0);

  },

  'toggle upper': function () {

    perspectiveCamera.layers.toggle( 1 );
    orthographicCamera.layers.toggle( 1 );

  },

  'enable all': function () {

    perspectiveCamera.layers.enableAll();
    orthographicCamera.layers.enableAll();


  },

  'disable all': function () {

    perspectiveCamera.layers.disableAll();
    orthographicCamera.layers.disableAll();


  }

};

const gui = new GUI();
gui.add( layers, 'toggle lower' );
gui.add( layers, 'toggle upper' );
gui.add( layers, 'enable all' );
gui.add( layers, 'disable all' );
gui.add(params, 'orthographicCamera').name('use orthographic').onChange(function(value) {
  controls.dispose();
  createControls(value ? orthographicCamera : perspectiveCamera);
});

window.addEventListener('resize', onWindowResize);
createControls(perspectiveCamera);

function createControls(camera) {

  controls = new TrackballControls(camera, renderer.domElement);

  controls.rotateSpeed = 1.0;
  controls.zoomSpeed = 1.2;
  controls.panSpeed = 0.8;

  controls.keys = ['KeyA', 'KeyS', 'KeyD'];

}

function onWindowResize() {

  const aspect = window.innerWidth / window.innerHeight;

  perspectiveCamera.aspect = aspect;
  perspectiveCamera.updateProjectionMatrix();

  orthographicCamera.left = -frustumSize * aspect / 2;
  orthographicCamera.right = frustumSize * aspect / 2;
  orthographicCamera.top = frustumSize / 2;
  orthographicCamera.bottom = -frustumSize / 2;
  orthographicCamera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

  controls.handleResize();

}

function animate() {
    requestAnimationFrame(animate);

    controls.update();

    render();
}

function render() {
  const camera = (params.orthographicCamera) ? orthographicCamera : perspectiveCamera;
  renderer.render(scene, camera);
}

animate();
