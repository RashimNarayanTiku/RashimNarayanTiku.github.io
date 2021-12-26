import './style.css'
import * as THREE from 'three';
import { AmbientLight, MathUtils } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';


// Scene and Camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0,2,1000);

// const renderer = new THREE.WebGL1Renderer({ canvas: document.querySelector('#bg') });
// renderer.setPixelRatio(window.devicePixelRatio);
// renderer.setSize(window.innerWidth, window.innerHeight);

// Renderer
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)


// Lights and OrbitControls
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(50,100,100);
const ambientLight = new THREE.AmbientLight(0xffffff);
// const lightHelper = new THREE.PointLightHelper(pointLight);
// let controls = new OrbitControls(camera, renderer.domElement);
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
// const groups = [ [[0,0,0],1000,3000,0xffffff] ];

// for(let group of groups) {
//     let position = group[0];
//     let size = group[1];
//     let count = group[2];
//     let color = group[3];

//     for(let i=0; i<count; i++) {
//         addStar(position[0],position[1],position[2],size,color);
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

let particles;
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
  particles = new THREE.Points(geometry, material);
  scene.add( particles );
}


// Loading 3-D Models 
let saturn;
let loader = new GLTFLoader();
loader.crossOrigin = true;

loader.load("./saturn/scene.glb", function(data) {

  let object = data.scene;
  object.position.set(0,0,0);
  saturn = object;
  scene.add( object );
});


// Camera Animation Path
let pathCurve = new THREE.CatmullRomCurve3([
  // new THREE.Vector3(-20,2,500),
  // new THREE.Vector3(-20,2,400),
  // new THREE.Vector3(-20,2,350),
  // new THREE.Vector3(-20,2,300),
  // new THREE.Vector3(-20,2,250),

  new THREE.Vector3(50,2,150),
  new THREE.Vector3(35,2,150),
  new THREE.Vector3(15,2,150),
  new THREE.Vector3(5,2,150),
  new THREE.Vector3(0,2,150),
  new THREE.Vector3(-10,2,150),
  new THREE.Vector3(-20,2,100),

  new THREE.Vector3(-30,2,50),
  new THREE.Vector3(-30,2,40),
  new THREE.Vector3(-30,2,30),
  new THREE.Vector3(-30,2,20),
  new THREE.Vector3(-30,2,10),
  new THREE.Vector3(-30,2,0),

  new THREE.Vector3(-30,2,-21),
  new THREE.Vector3(-30,2,-21),
  new THREE.Vector3(-30,2,-21),
  new THREE.Vector3(-30,2,-21),
  new THREE.Vector3(-30,2,-21),
  new THREE.Vector3(-20,2,-21),
  new THREE.Vector3(-10,2,-21),
  new THREE.Vector3(30,2,-21),

  new THREE.Vector3(30,2,-11),
  new THREE.Vector3(30,2,0),
  new THREE.Vector3(30,2,10),
  new THREE.Vector3(30,2,21),
  new THREE.Vector3(30,2,31),
  new THREE.Vector3(30,2,41),
  new THREE.Vector3(30,2,51),
  new THREE.Vector3(30,2,81),
  new THREE.Vector3(30,2,120),

  
  new THREE.Vector3(40,2,150),
  new THREE.Vector3(50,2,150),
  // new THREE.Vector3(40,2,280),
  // new THREE.Vector3(30,2,300),
  // new THREE.Vector3(20,2,350),
  // new THREE.Vector3(10,2,350),

]);
let pathGeo = new THREE.TubeGeometry(pathCurve, 20, 2, 8, true);
let pathMat = new THREE.MeshBasicMaterial({ wireframe : true, visible: false });
let path = new THREE.Mesh(pathGeo, pathMat);
path.position.z -= 100;
scene.add(path);



//Scroll binding for lerping
let oldValue = 0;
let newValue = 0;
let progress = 0;
let lerpAlpha = 0.1;

let cameraTarget = new THREE.Vector3(0,2,500);

window.addEventListener('scroll', (e) => {

  newValue = window.pageYOffset;

  progress += (newValue - oldValue) * 0.001;
  // progress += 0.005;
  progress = progress % 1; 
  if(!(progress >= 0 && progress < 1))
    progress = 0;
  
  cameraTarget.copy(pathCurve.getPointAt(progress));

  if(cameraTarget.x <= 0) {
    console.log('Adding 15');
    cameraTarget.x += 15;
  } else {
    console.log('Subtracting 15');
    cameraTarget.x -= 15;
  }

  renderer.render( scene, camera );
  // oldValue = newValue;
});


function animate() {

    // controls.update();
    camera.lookAt(0,0,0);
    camera.position.lerp(cameraTarget, lerpAlpha);
    if(saturn) saturn.rotation.y += 0.002;
    if(particles) particles.rotation.y += 0.0006;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

makeStarSphere();
animate();

