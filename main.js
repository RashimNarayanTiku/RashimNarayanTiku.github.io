import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';


// Renderer
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// const renderer = new THREE.WebGL1Renderer({ canvas: document.querySelector('#bg') });
// renderer.setPixelRatio(window.devicePixelRatio);
// renderer.setSize(window.innerWidth, window.innerHeight);



// Scene and Camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0,2,1200);



// Lights and OrbitControls
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(20,23,12);
const ambientLight = new THREE.AmbientLight(0xffffff);
// const lightHelper = new THREE.PointLightHelper(pointLight);
scene.add(pointLight);



// Dynamic Window Size Updation
window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.render(scene, camera);
    
}



// // Making basic dot stars
// function addBasicStar(px,py,pz,size,color) {
//     const geo = new THREE.SphereGeometry(0.1, 24, 24);
//     const material = new THREE.MeshStandardMaterial( { color: color } );
//     const star = new THREE.Mesh(geo, material);
//     const [x,y,z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(size));
//     star.position.set(px+x, py+y, pz+z);
//     scene.add(star);
// }
// // 
// //position, size, count, color
// const groups = [ [[0,0,0],1000,3000,0xffffff] ];

// for(let group of groups) {
//     let position = group[0];
//     let size = group[1];
//     let count = group[2];
//     let color = group[3];

//     for(let i=0; i<count; i++) {
//         addBasicStar(position[0],position[1],position[2],size,color);
//     }
// }



// Adding Hollow Sphere of Stars
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
let sphere;
function makeStarSphere() {
  let geometry = new THREE.BufferGeometry();
  let positions = [];
  let count = 10000;
  let radius = 100;
  for (var i = 0; i<count; i++) {
      var vertex = randomPointInSphere(radius);
      positions.push( vertex.x, vertex.y, vertex.z );
  }
  
  geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
  let material = new THREE.PointsMaterial( { color: 0xffffff, size: 0.1 } );
  sphere = new THREE.Points(geometry, material);
  scene.add( sphere );
}



// Loading 3-D Models 
let saturn;
function loadSaturn() {
  let loader = new GLTFLoader();
  loader.crossOrigin = true;
  loader.load("./saturn/scene.glb", function(data) {
    let object = data.scene;
    object.position.set(0,0,0);
    saturn = object;
    scene.add( object );
  });
}



// Camera Animation Path
let pathCurve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(20,2,150),
  new THREE.Vector3(-30,2,150),
  new THREE.Vector3(-30,2,40),
  new THREE.Vector3(-30,2,30),
  new THREE.Vector3(-30,2,20),
  new THREE.Vector3(-30,2,10),
  new THREE.Vector3(-30,2,0),
  new THREE.Vector3(-30,2,-12),
  new THREE.Vector3(-20,2,-12),
  new THREE.Vector3(-10,2,-12),
  new THREE.Vector3(16,2,-12),
  new THREE.Vector3(17,2,-14),
  new THREE.Vector3(20,2,-11),
  new THREE.Vector3(20,2,0),
  new THREE.Vector3(20,2,10),
  new THREE.Vector3(20,2,11),
  new THREE.Vector3(20,2,12),
  new THREE.Vector3(20,2,21),
  new THREE.Vector3(20,2,31),
  new THREE.Vector3(20,2,41),
  new THREE.Vector3(20,2,51),
  new THREE.Vector3(20,2,81),
  new THREE.Vector3(20,2,120),
  new THREE.Vector3(40,2,150),
  new THREE.Vector3(50,2,150),
]);



//Scroll binding for lerping
let oldValue = 0;
let newValue = 0;
let progress = 0;
let lerpAlpha = 0.1;
let cameraTarget = new THREE.Vector3().copy(pathCurve.getPointAt(0));
window.addEventListener('scroll', (e) => {

  newValue = window.pageYOffset;

  progress += (newValue - oldValue) * 0.009;
  progress = progress % 1; 
  if(!(progress >= 0 && progress < 1))
    progress = 0;
  
  cameraTarget.copy(pathCurve.getPointAt(progress));
  renderer.render( scene, camera );
  oldValue = newValue;
});


function animate() {
  if(saturn) saturn.rotation.y += 0.002;
  if(sphere) sphere.rotation.y += 0.0005;

  camera.lookAt(0,0,0);
  camera.position.lerp(cameraTarget, lerpAlpha);
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}


makeStarSphere();
loadSaturn();
animate();

