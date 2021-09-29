// jshint esversion:6
import * as THREE from './threejs/three.module.js';
import {STLLoader} from './threejs/STLLoader.js';
import {TrackballControls} from './threejs/TrackballControls.js';
import { GUI } from './threejs/dat.gui.module.js';

//////////////// Camera ///////////////////
let perspectiveCamera, orthographicCamera, controls;
const params = {orthographicCamera: false};
const frustumSize = 100;

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

//////////////// World //////////////////////

let scene = new THREE.Scene();
let background = new THREE.Color(0xcccccc);
scene.background = background;
////////////// Lights /////////////////////////

const skyColor = 0xffffff;  // light blue
const intensity = 1;
const light = new THREE.HemisphereLight(skyColor, intensity);
light.layers.enable( 0 );
light.layers.enable( 1 );
perspectiveCamera.add(light);
orthographicCamera.add(light);
scene.add(perspectiveCamera);
scene.add(orthographicCamera);

scene.add(new THREE.AxesHelper(5));


//////////////// Object ////////////////////
const material = new THREE.MeshPhysicalMaterial({
    color: 0xf8f8f8,
    roughness: 0.2,
});

const loader = new STLLoader();
loader.load(
    '3dmodels/FWMWK-upperjaw.stl',
    function (geometry) {
        const mesh_upperjaw = new THREE.Mesh(geometry, material);
        mesh_upperjaw.scale.set(0.1, 0.1, 0.1);
        mesh_upperjaw.position.set(0,0,0);
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
        mesh.position.set(0,-0.5,0);
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

////////////// Render /////////////////////////

let renderer = new THREE.WebGLRenderer({});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

/////////////////////// Layers ////////////////////

const layers = {

  'toggle lower': function () {
    perspectiveCamera.layers.enableAll();
    orthographicCamera.layers.enableAll();
    perspectiveCamera.layers.toggle( 0 );
    orthographicCamera.layers.toggle( 0 );

  },

  'toggle upper': function () {
    perspectiveCamera.layers.enableAll();
    orthographicCamera.layers.enableAll();
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

const positions = {
  'front view': function (){
    perspectiveCamera.position.set(0,0,-10);
    orthographicCamera.position.set(0,0,-10);
    perspectiveCamera.layers.enableAll();
    orthographicCamera.layers.enableAll();
  },

  'left view': function (){
    perspectiveCamera.position.set(5,0,0);
    orthographicCamera.position.set(5,0,0);
  },

  'right view': function (){
    perspectiveCamera.position.set(-5,0,0);
    orthographicCamera.position.set(-5,0,0);
  },

  'from above': function (){
    perspectiveCamera.layers.enableAll();
    orthographicCamera.layers.enableAll();
    perspectiveCamera.position.set(0,5,0);
    orthographicCamera.position.set(0,5,0);
    perspectiveCamera.layers.toggle( 0 );
    orthographicCamera.layers.toggle( 0 );
  },

  'from down': function (){
    perspectiveCamera.layers.enableAll();
    orthographicCamera.layers.enableAll();
    perspectiveCamera.position.set(0,-5,0);
    orthographicCamera.position.set(0,-5,0);
    perspectiveCamera.layers.toggle( 1 );
    orthographicCamera.layers.toggle( 1 );
  },
};

class ColorGUIHelper {
  constructor(object, prop) {
    this.object = object;
  }
  get value() {
    return `#${this.object.getHexString()}`;
  }
  set value(hexString) {
    this.object.set(hexString);
  }
}

///////////// GUI //////////////////////

const gui = new GUI();
gui.add( layers, 'toggle lower' );
gui.add( layers, 'toggle upper' );
gui.add( layers, 'enable all' );
gui.add( layers, 'disable all' );
gui.add(params, 'orthographicCamera').name('use orthographic').onChange(function(value) {
  createControls(value ? orthographicCamera : perspectiveCamera);
});
gui.addColor(new ColorGUIHelper(scene.background), 'value').name('Background color: ');
window.addEventListener('resize', onWindowResize);
gui.add( positions, 'front view');
gui.add( positions, 'left view');
gui.add( positions, 'right view');
gui.add( positions, 'from above');
gui.add( positions, 'from down');


///////////////////// Controls /////////////////////////

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
