import './style.css'
import * as THREE from 'three';
import { AmbientLight, MathUtils } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';



const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0,2,500);

// const renderer = new THREE.WebGL1Renderer({
//     canvas: document.querySelector('#bg'),
// });
// renderer.setPixelRatio(window.devicePixelRatio);
// renderer.setSize(window.innerWidth, window.innerHeight);


const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(50,100,25);
const ambientLight = new THREE.AmbientLight(0xffffff);
const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200,50);
scene.add(ambientLight,lightHelper);
const controls = new OrbitControls(camera, renderer.domElement);


// Dynamic Window size updation
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
  let positions = [];
  let count = 55000;
  
  for (var i = 0; i<count; i++) {
      var vertex = randomPointInSphere(200);
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
  data.scene.scale.set(0.7, 0.7, 0.7)
  let object = data.scene;
  object.position.set(0,0,0);
  scene.add( object );
});

// loader.load("./moon/scene.gltf", function(data) {
//   data.scene.scale.set(0.7, 0.7, 0.7)
//   let object = data.scene.children[0];
//   object.position.set(0,-3,30);
//   scene.add( object );
// });

// loader.load("./earth-real/scene.gltf", function(data) {

//   data.scene.scale.set(0.2, 0.2, 0.2)

//   let object = data.scene.children[0];
//   object.position.set(0,0,30);
//   scene.add( object );
// });

















// ----------------------------------RECOMMENDED WAY TO MAKE SPLINE CURVES
// const curv = new THREE.CatmullRomCurve3( [
//   new THREE.Vector3(0,2,500),
//   new THREE.Vector3(0,2,400),
//   new THREE.Vector3(0,2,350),
//   new THREE.Vector3(0,2,300),
//   new THREE.Vector3(0,2,250),
//   new THREE.Vector3(0,2,200),
//   new THREE.Vector3(0,2,150),
//   new THREE.Vector3(-10,2,100),
//   new THREE.Vector3(-20,2,100),
//   new THREE.Vector3(0,2,80),
//   new THREE.Vector3(20,2,100),
//   new THREE.Vector3(25,2,120),
//   new THREE.Vector3(30,2,150),
//   new THREE.Vector3(20,2,200),
//   new THREE.Vector3(10,2,250),
//   new THREE.Vector3(5,2,300),
//   new THREE.Vector3(0,2,350),
// ], true );

// const poin = curv.getPoints( 500 );
// const geometr = new THREE.TubeBufferGeometry(curv, 20, 200, 8, true).setFromPoints( poin );
// const materia = new THREE.MeshBasicMaterial( { color : 0xff0000, wireframe:true } );
// const curveObject = new THREE.Mesh( geometr, materia );
// scene.add(curveObject);









let pathCurve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0,2,500),
  new THREE.Vector3(0,2,400),
  new THREE.Vector3(0,2,350),
  new THREE.Vector3(0,2,300),
  new THREE.Vector3(0,2,250),
  new THREE.Vector3(0,2,200),
  new THREE.Vector3(0,2,150),
  new THREE.Vector3(-10,2,100),
  new THREE.Vector3(-20,2,100),
  new THREE.Vector3(0,2,80),
  new THREE.Vector3(20,2,100),
  new THREE.Vector3(25,2,120),
  new THREE.Vector3(30,2,150),
  new THREE.Vector3(20,2,200),
  new THREE.Vector3(10,2,250),
  new THREE.Vector3(5,2,300),
  new THREE.Vector3(0,2,350),
])

let pathGeo = new THREE.TubeGeometry(pathCurve, 20, 2, 8, true);
let pathMat = new THREE.MeshBasicMaterial({color: 0xffffff, wireframe:true, opacity: 1, transparent: true});
let path = new THREE.Mesh(pathGeo, pathMat);

path.geometry.parameters.getpointat
path.position.z -= 100;


scene.add(path);
// path.geometry.parameters.getpointat()







let cameraTarget = new THREE.Vector3();
cameraTarget.position = pathMesh.geometry.parameters.getpo


//Scroll binding for lerping
let oldValue = 0
let newValue = 0
window.addEventListener('scroll', (e) => {
  newValue = window.pageYOffset;

  //covers both scroll-up and scroll-down cases
  if(cameraTarget.z <= 25) {
      if(cameraTarget.z > 5)
        cameraTarget.z -= (newValue-oldValue) * 0.1;  
    //   else
    //     cameraTarget.z += (newValue-oldValue) * 0.05;  

    if(cameraTarget.x < 30)
      cameraTarget.x += (newValue-oldValue) * 0.3; 
    else
      cameraTarget.x -= (newValue-oldValue) * 0.3; 

  }
  else
    cameraTarget.z -= (newValue-oldValue) * 0.4;  


//   oldValue = newValue;
});

const data = {
    lerpAlpha: 0.1,
    lerpVectorsAlpha: 1.0,
}

function animate() {

    controls.update();
    // camera.position.lerp(cameraTarget, data.lerpAlpha);
    camera.lookAt(0,0,0);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

makeStarSphere();
animate();















// ====================================== LERPING EXAMPLES ====================================================

// import * as THREE from 'three'
// // import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// import Stats from 'three/examples/jsm/libs/stats.module'

// const scene = new THREE.Scene()
// // scene.add(new THREE.AxesHelper(5))

// const camera = new THREE.PerspectiveCamera(
//     75,
//     window.innerWidth / window.innerHeight,
//     0.1,
//     1000
// )
// camera.position.set(1, 10, 40)

// let cameraTarget = new THREE.Vector3(1, 10, 40);

// const renderer = new THREE.WebGLRenderer()
// renderer.setSize(window.innerWidth, window.innerHeight)
// document.body.appendChild(renderer.domElement)

// // const controls = new OrbitControls(camera, renderer.domElement)
// // controls.enableDamping = true

// const floor = new THREE.Mesh(
//     new THREE.PlaneBufferGeometry(20, 20, 10, 10),
//     new THREE.MeshBasicMaterial({ color: 0xaec6cf, wireframe: true })
// )
// floor.rotateX(-Math.PI / 2)
// scene.add(floor)

// const geometry = new THREE.BoxGeometry()

// //the cube used for .lerp
// const cube1 = new THREE.Mesh(
//     geometry,
//     new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })
// )
// cube1.position.y = 0.5
// scene.add(cube1);


// //the cube used for .lerpVectors
// // const cube2 = new THREE.Mesh(
// //     geometry,
// //     new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
// // )
// // cube2.position.y = 0.5;
// // scene.add(cube2);


// window.addEventListener('resize', onWindowResize, false)
// function onWindowResize() {
//     camera.aspect = window.innerWidth / window.innerHeight
//     camera.updateProjectionMatrix()
//     renderer.setSize(window.innerWidth, window.innerHeight)
//     render();

// }

// //Scroll binding for lerping
// let oldValue = 0
// let newValue = 0
// window.addEventListener('scroll', (e) => {
//   newValue = window.pageYOffset;
//   cameraTarget.z -= (newValue-oldValue) * 0.05;  //covers both scroll up and down cases
//   oldValue = newValue;
// });


// // renderer.domElement.addEventListener('dblclick', onDoubleClick, false)
// // function onDoubleClick(event) {
// //     const mouse = {
// //         x: (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
// //         y: -(event.clientY / renderer.domElement.clientHeight) * 2 + 1,
// //     }
// // raycaster.setFromCamera(mouse, camera)
// //     const intersects = raycaster.intersectObject(floor, false)
// //     if (intersects.length > 0) {
// //         v1.copy(intersects[0].point)
// //         v1.y += 0.5 //raise it so it appears to sit on grid
// //     }
// // }


// const data = {
//     lerpAlpha: 0.1,
//     lerpVectorsAlpha: 1.0,
// }


// function animate() {
//   // controls.update();
//   camera.position.lerp(cameraTarget, data.lerpAlpha);
//   // cube2.position.lerpVectors(v1, v2, data.lerpVectorsAlpha);
//   // controls.target.copy(camera.position)
//   renderer.render(scene, camera);
//   requestAnimationFrame(animate);
// }

// animate();


