// Renderer
const renderer = new THREE.WebGL1Renderer({ canvas: document.querySelector('#bg') });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);



// Scene and Camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0,2,1200);



// Lights and OrbitControls
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(20,23,12);
scene.add(pointLight);



// Dynamic Window Size Updation
window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.render(scene, camera);
    
}



// Adding Hollow Sphere of Stars
let sphere;
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



// Loading 3-D Model
let saturn;
function loadSaturn() {
  let loader = new THREE.GLTFLoader();
  loader.crossOrigin = true;
  loader.load("./saturn/scene.glb", function(data) {
    let object = data.scene;
    object.position.set(0,0,0);
    saturn = object;
    scene.add( object );

    document.getElementById('loader').style.display = "none";
    typeWriter(0);
  });
}



// Camera Animation Path
let pathCurve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(20,2,140),
  new THREE.Vector3(-30,2,140),
  new THREE.Vector3(-30,2,40),
  new THREE.Vector3(-30,2,30),
  new THREE.Vector3(-30,2,20),
  new THREE.Vector3(-30,2,10),
  new THREE.Vector3(-30,2,0),
  new THREE.Vector3(-30,2,-17),
  new THREE.Vector3(-20,2,-17),
  new THREE.Vector3(-10,2,-17),
  new THREE.Vector3(16,2,-17),
  new THREE.Vector3(17,2,-17),
  new THREE.Vector3(20,2,-17),
  new THREE.Vector3(20,2,7),
  new THREE.Vector3(20,2,10),
  new THREE.Vector3(20,2,11),
  new THREE.Vector3(20,2,12),
  new THREE.Vector3(20,2,21),
  new THREE.Vector3(20,2,31),
  new THREE.Vector3(20,2,41),
  new THREE.Vector3(20,2,51),
  new THREE.Vector3(20,2,50),
  new THREE.Vector3(20,2,120),
]);



// Scroll binding for lerping
let oldValue = 0;
let newValue = 0;
let progress = 0;
let lerpAlpha = 0.1;
let cameraTarget = new THREE.Vector3().copy(pathCurve.getPointAt(0));
window.addEventListener('scroll', (e) => {

  newValue = window.pageYOffset;

  progress += (newValue - oldValue) * 0.0002;
  // let speed = ((newValue > oldValue) ? 0.01 : -0.01);

  // if(progress == 0 && speed < 0) {
  //   console.log('Progress is 0');
  //   progress = 0.99
  // }
  // progress += speed;
  // progress = progress % 1; 

  if(!(progress >= 0 && progress < 1)) {

    if(newValue > oldValue) progress = 0;
    else progress = 0.99; 
    // let speed = ((newValue > oldValue) ? 0.1 : -0.1);
    // progress += speed;
    console.log('progress:',progress);
    console.log("NOT NORMAL ")
    // progress = 0;
  }

  cameraTarget.copy(pathCurve.getPointAt(progress));
  renderer.render( scene, camera );
  oldValue = newValue;
});


// Recurring function for 3-D animation
function animate() {
  if(saturn) saturn.rotation.y += 0.002;
  if(sphere) sphere.rotation.y += 0.0005;

  camera.lookAt(0,0,0);
  camera.position.lerp(cameraTarget, lerpAlpha);
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}


// Fade Effect for portfolio scrolling
function fadeEffect() {
$(window).scroll(function() {
  let windowTop = $(this).scrollTop();
  let windowBottom = $(this).scrollTop() + $(this).innerHeight();
  $(".fade").each(function() {
    /* Check the location of each desired element */
    let objectTop = $(this).offset().top;
    let sectionHeight = ($(window).height())/5;

    let objectBottom = $(this).offset().top + $(this).outerHeight();

    if (objectTop < windowBottom) { //object comes into view (scrolling down)
      if ($(this).css("opacity")==0) $(this).fadeTo(500,1);
      this.querySelector('section').classList.add('fixed-position');

      if(objectBottom - 250 < windowTop) {
        if ($(this).css("opacity")==1) {
          $(this).fadeTo(500,0);
        }
        if(objectBottom < windowTop) {
          this.querySelector('section').classList.remove('fixed-position');
        }
      }
    }
    else {
      if ($(this).css("opacity")==1) $(this).fadeTo(500,0);
      this.querySelector('section').classList.remove('fixed-position');
    }

  });
}).scroll(); //invoke scroll-handler on page-load  
}



// First Page animation effect
function typeWriter(i) {

  let txt = '/Software Developer';
  const speed = 100;

  if (i < txt.length) {
      document.getElementById("type-writer").innerHTML += txt.charAt(i);
      setTimeout(() => typeWriter(i+1), speed);

  } else if (i < txt.length+5) {
    if(document.getElementById('type-writer').style.borderRight == "3px solid black")
      document.getElementById('type-writer').style.borderRight = "3px solid white";
    else 
      document.getElementById('type-writer').style.borderRight = "3px solid black";
    setTimeout(() => typeWriter(i+1), speed+400);

  } else {
    document.getElementById('type-writer').style.borderRight = "none";
  }
}



$(function() {
  loadSaturn();
  // typeWriter(0);  
  fadeEffect();    
  makeStarSphere();
  animate();
});
