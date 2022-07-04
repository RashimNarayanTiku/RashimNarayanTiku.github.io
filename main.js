// Renderer, Scene, Camera, Light
const renderer = new THREE.WebGL1Renderer({ canvas: document.querySelector('#bg') });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0,2,1200);
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
  let count = 4000;
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



// Camera Animation Path
let pathCurveList = [
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
]
let pathCurve = new THREE.CatmullRomCurve3(pathCurveList);



// Scroll binding for lerping(smooth transition animation)
let oldValue, newValue, progress, lerpAlpha, cameraTarget;
oldValue = newValue = progress = 0;
lerpAlpha = 0.1;
cameraTarget = new THREE.Vector3().copy(pathCurve.getPointAt(0));
window.addEventListener('scroll', (e) => {

  newValue = window.pageYOffset;
  progress += (newValue - oldValue) * 0.0002;

  if(!(progress >= 0 && progress < 1)) {
    if(newValue > oldValue) progress = 0;
    else progress = 0.99; 
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
    
    // Check the location of each desired element 
    $(".fade").each(function() {
      let objectTop = $(this).offset().top;
      let objectBottom = $(this).offset().top + $(this).outerHeight();

      //object above the view
      if (objectTop < windowBottom && objectBottom < windowTop) {   
          if ($(this).css("opacity")==1) $(this).fadeTo(100,0);
          setTimeout(() => {
            this.querySelector('section').classList.remove('fixed-position');
          }, 200);
      }
      //object comes into view
      else if (objectTop < windowBottom) {    
        if ($(this).css("opacity")==0) $(this).fadeTo(500,1);
        this.querySelector('section').classList.add('fixed-position');
      }
      // object below the view
      else {
        if ($(this).css("opacity")==1) $(this).fadeTo(100,0);
        setTimeout(() => {
          this.querySelector('section').classList.remove('fixed-position');
        }, 200);
      }

    });
  }).scroll(); //invoke scroll-handler on page-load
}



// First Page type-writer animation effect
function typeWriter(i) {

  if(i === undefined) {
    i = 0;
  }

  let txt = '/Software Developer';
  const speed = 130;

  if (i < txt.length) {
      document.getElementById("type-writer").innerHTML += txt.charAt(i);
      setTimeout(() => typeWriter(i+1), speed);

  } else if (i < txt.length+5) {
    if(document.getElementById('type-writer').style.borderRight == "3px solid black") {
      document.getElementById('type-writer').style.borderRight = "none";
    } else {
      document.getElementById('type-writer').style.borderRight = "3px solid black";
    }
    setTimeout(() => typeWriter(i+1), speed+400);

  } else {
    document.getElementById('type-writer').style.borderRight = "none";
  }
  
}

function showScrollDownIndicator() {
  setTimeout(() => {
    $("#scroll-down-indicator").fadeTo(700,1);
  }, 2500);
}


// First Page background effect (Particles.js)
let particleJson = {
  particles: {
    number: { value: 80, density: { enable: true, value_area: 800 } },
    color: { value: "#000000" },
    shape: {
      type: "circle",
      stroke: { width: 0, color: "#000000" },
      polygon: { nb_sides: 5 },
    },
    opacity: {
      value: 0.5,
      random: false,
      anim: { enable: false, speed: 1, opacity_min: 0.1, sync: false }
    },
    size: {
      value: 3,
      random: true,
      anim: { enable: false, speed: 40, size_min: 0.1, sync: false }
    },
    line_linked: {
      enable: true,
      distance: 200,
      color: "#000000",
      opacity: 0.8,
      width: 1
    },
    move: {
      enable: true,
      speed: 6,
      direction: "none",
      random: false,
      straight: false,
      out_mode: "out",
      bounce: false,
      attract: { enable: false, rotateX: 600, rotateY: 1200 }
    }
  },
  interactivity: {
    detect_on: "canvas",
    events: {
      onhover: { enable: false, mode: "repulse" },
      onclick: { enable: false, mode: "push" },
      resize: true
    },
    modes: {
      grab: { distance: 400, line_linked: { opacity: 1 } },
      bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 },
      repulse: { distance: 200, duration: 0.4 },
      push: { particles_nb: 4 },
      remove: { particles_nb: 2 }
    }
  },
  retina_detect: true
};

function loadParticleJs() {
  particlesJS("particles-js", particleJson);
}



// Loading 3-D Model
let saturn;
function loadSaturn() {
  let loader = new THREE.GLTFLoader();

  const dracoLoader = new THREE.DRACOLoader();
  dracoLoader.setDecoderPath( 'https://unpkg.com/three@0.128.0/examples/js/libs/draco/' );
  loader.setDRACOLoader( dracoLoader );

  loader.crossOrigin = true;
  loader.load("./saturn/scene-compressed.glb", function(data) {
    let object = data.scene;
    object.position.set(0,0,0);
    saturn = object;
    scene.add( object );

    // After loading is completed
    document.getElementById('loader').style.display = "none";
    document.getElementsByTagName('body')[0].style.overflowY = "scroll";
    typeWriter(0);
    showScrollDownIndicator();
  });
}



// Resume
function resumeAnimation() {
  $('.big-resume-container').on('click', function() {
    $(this).fadeTo(500,0);
    setTimeout(() => {
      this.style.display = 'none';
      document.getElementsByTagName('body')[0].style.overflowY = "scroll";
    }, 500);
  });
  $('#resume').on('click', function(){
    document.getElementsByTagName('body')[0].style.overflowY = "hidden";
    $('.big-resume-container').css('opacity',0);
    $('.big-resume-container').css('display','block');
    $('.big-resume-container').fadeTo(500,1);
  });
}

//Loader text changes  
function changeLoaderText() {

  setTimeout(() => {
    document.getElementById('loading-text').innerHTML = 'You won\'t be dissapointed...';
    let margin_left = screen.width > 586 ? '41vw' : '16vw';
    document.getElementById('loading-text').parentNode.style.marginLeft = margin_left;
  }, 20*1000);


  setTimeout(() => {
    document.getElementById('loading-text').innerHTML = 'Well that\'s embarrassing...';  
    if(screen.width < 586) 
      document.getElementById('loading-text').parentNode.style.marginLeft = '18vw';

  }, 40*1000);

  
  setTimeout(() => {
    document.getElementById('loading-text').innerHTML = 'Who wants ice-cream! 🍦';  
    if(screen.width < 586) 
      document.getElementById('loading-text').parentNode.style.marginLeft = '18vw';

  },60*1000);

}

$(function() {

  // Responsive design changes for smartphones
  if(window.innerWidth <= 576) {
    particleJson.particles.number.value = 50;
    pathCurveList.shift();
    pathCurveList.unshift(new THREE.Vector3(20,2,220));
    pathCurveList[1] = new THREE.Vector3(-30,2,220);
  }

  changeLoaderText();  
  loadParticleJs();
  makeStarSphere();
  fadeEffect();    
  resumeAnimation();
  loadSaturn();
  // typeWriter(0) and showScrollDownIndicator() //Inside loadSaturn() function
  animate();
});
