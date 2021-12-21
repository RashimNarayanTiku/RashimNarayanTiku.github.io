import './style.css'

import * as THREE from 'three';
import { AmbientLight, MathUtils } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGL1Renderer({
    canvas: document.querySelector('#bg'),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

camera.position.set(0, 0, 200);

renderer.render(scene, camera);

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(50,100,25);

const ambientLight = new THREE.AmbientLight(0xffffff);

const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200,50);

scene.add(pointLight,lightHelper);

const controls = new OrbitControls(camera, renderer.domElement);



// Making basic dot stars
// function addStar(px,py,pz,size,color) {
//     const geo = new THREE.SphereGeometry(0.1, 24, 24);
//     const material = new THREE.MeshStandardMaterial( { color: color } );
//     const star = new THREE.Mesh(geo, material);
//     const [x,y,z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(size));
//     star.position.set(px+x, py+y, pz+z);
//     scene.add(star);
// }
// // 
// //position, size, count, color
// const groups = [ [[0,0,0],1000,5000,0xffffff] ];

// for(let group of groups) {
//     let position = group[0];
//     let size = group[1];
//     let count = group[2];
//     let color = group[3];

//     for(let i=0; i<count; i++) {
//         addStar(position[0],position[1],position[2],size,color);
//     }
// }



// Making hollow sphere of stars
const v = new THREE.Vector3();
function randomPointInSphere(radius) {

  const x = THREE.Math.randFloat( -1, 1 );
  const y = THREE.Math.randFloat( -1, 1 );
  const z = THREE.Math.randFloat( -1, 1 );
  const normalizationFactor = 1 / Math.sqrt( x * x + y * y + z * z );

  v.x = x * normalizationFactor * radius;
  v.y = y * normalizationFactor * radius;
  v.z = z * normalizationFactor * radius;

  return v;
}

function makeStarSphere() {
  let geometry = new THREE.BufferGeometry();
  var positions = [];
  
  for (var i = 0; i<50000; i++) {
      var vertex = randomPointInSphere(300);
      positions.push( vertex.x, vertex.y, vertex.z );
  }
  
  geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
  let material = new THREE.PointsMaterial( { color: 0xffffff, size: 0.1 } );
  let particles = new THREE.Points(geometry, material);
  scene.add( particles );
}




let loader = new GLTFLoader();
loader.crossOrigin = true;
loader.load("./saturn/scene.glb", function(data) {

    let object = data.scene.children[0];
    object.position.set(0,-5,5);
    scene.add( object );
});


function animate() {
    requestAnimationFrame(animate);

    controls.update();
    renderer.render(scene, camera);
}

makeStarSphere();
animate();



