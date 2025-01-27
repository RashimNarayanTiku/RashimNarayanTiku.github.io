import { cachedSaturnModel, isScreenSmall, slowCPU } from "./preload.js";

// Faking fullscreen to hide address bar in mobile devices
window.scrollTo(0, 1);

let oldHeight = window.outerHeight;

// Renderer, Scene, Camera, Light
const renderer = new THREE.WebGL1Renderer({ canvas: document.querySelector('#bg') });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.outerWidth, window.outerHeight);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.outerWidth / window.outerHeight, 0.1, 1000);
camera.position.set(0, 2, 1200);
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(20, 23, 12);
scene.add(pointLight);

// Dynamic Window Size Updation
window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    if(oldHeight > window.innerHeight) return;

    oldHeight = window.innerHeight;
    camera.aspect = window.outerWidth / window.outerHeight
    camera.updateProjectionMatrix();
    renderer.setSize(window.outerWidth, window.outerHeight)
    renderer.render(scene, camera);   
}

// Make Cursor with stars
const makeStarCursor = () => {
  document.body.style.cursor = 'none';
  let mouseX = 0;
  let mouseY = 0;

  // Reusing star elements for performance
  let cursorStars = [];
  let starCount = 300;
  for (let i = 0; i < starCount; i++) {
    cursorStars.push(document.createElement('div'));
  }

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    createCursorStar(true);
  });

  function createCursorStar() {
    if (!cursorStars.length) return;
    const star = cursorStars.pop();
    star.className = 'cursor-star';
    star.style.left = mouseX + Math.random() * 10 + 'px';
    star.style.top = mouseY + Math.random() * 10 + 'px';

    if (isAlmostInViewport(".page-1", 250)) {
      star.style.backgroundColor = 'black';
    } else {
      star.style.backgroundColor = 'white';
    }

    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 20 + 10;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;

    star.style.setProperty('--tx', `${tx}px`);
    star.style.setProperty('--ty', `${ty}px`);

    document.body.appendChild(star);

    setTimeout(() => {
      cursorStars.push(star);
    }, 2000);
  }

  // Create stars continuously
  setInterval(createCursorStar, 18);
}

// Adding Hollow Sphere of Stars
let sphere;
const v = new THREE.Vector3();
const randomPointInSphere = (radius) => {

  const x = THREE.Math.randFloat(-1, 1);
  const y = THREE.Math.randFloat(-1, 1);
  const z = THREE.Math.randFloat(-1, 1);
  const normalizationFactor = 1 / Math.sqrt(x * x + y * y + z * z);

  v.x = x * normalizationFactor * radius;
  v.y = y * normalizationFactor * radius;
  v.z = z * normalizationFactor * radius;

  return v;
}
const makeStarSphere = () => {
  let geometry = new THREE.BufferGeometry();
  let positions = [];
  let count = 2000;
  let radius = 60;
  if (isScreenSmall) {
    count = 2000;
    radius = 70;
  }
  for (var i = 0; i < count; i++) {
    var vertex = randomPointInSphere(radius);
    positions.push(vertex.x, vertex.y, vertex.z);
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  let material = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 });
  sphere = new THREE.Points(geometry, material);
  scene.add(sphere);
}


// Camera Animation Path
let pathCurveList = [
  new THREE.Vector3(20, 2, 140),
  new THREE.Vector3(-30, 2, 140),
  new THREE.Vector3(-30, 2, 40),
  new THREE.Vector3(-30, 2, 30),
  new THREE.Vector3(-30, 2, 20),
  new THREE.Vector3(-30, 2, 10),
  new THREE.Vector3(-30, 2, 0),
  new THREE.Vector3(-30, 2, -17),
  new THREE.Vector3(-20, 2, -17),
  new THREE.Vector3(-10, 2, -17),
  new THREE.Vector3(16, 2, -17),
  new THREE.Vector3(17, 2, -17),
  new THREE.Vector3(20, 2, -17),
  new THREE.Vector3(20, 2, 7),
  new THREE.Vector3(20, 2, 10),
  new THREE.Vector3(20, 2, 11),
  new THREE.Vector3(20, 2, 12),
  new THREE.Vector3(20, 2, 21),
  new THREE.Vector3(20, 2, 31),
  new THREE.Vector3(20, 2, 41),
  new THREE.Vector3(20, 2, 51),
  new THREE.Vector3(20, 2, 50),
  new THREE.Vector3(20, 2, 120),
]
let pathCurve = new THREE.CatmullRomCurve3(pathCurveList);


// Scroll binding for lerping(smooth transition animation)
let oldValue, newValue, progress, lerpAlpha, cameraTarget;
oldValue = newValue = progress = 0;
lerpAlpha = 0.1;
cameraTarget = new THREE.Vector3().copy(pathCurve.getPointAt(0));
window.addEventListener('scroll', () => {
  newValue = window.pageYOffset;
  progress += (newValue - oldValue) * 0.0002;

  if (!(progress >= 0 && progress < 1)) {
    if (newValue > oldValue) progress = 0;
    else progress = 0.99;
  }

  cameraTarget.copy(pathCurve.getPointAt(progress));
  renderer.render(scene, camera);
  oldValue = newValue;
});

// Recurring function for 3-D animation
const animate = () => {
  if (saturn) saturn.rotation.y += 0.002;
  if (sphere) sphere.rotation.y += 0.0005;

  camera.lookAt(0, 0, 0);
  camera.position.lerp(cameraTarget, lerpAlpha);
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}


// Fade Effect for portfolio scrolling
const fadeEffect = () => {
  $(window).scroll(function () {
    let windowTop = $(this).scrollTop();
    let windowBottom = $(this).scrollTop() + $(this).innerHeight();

    // Check the location of each desired element 
    $(".fade").each(function () {
      let objectTop = $(this).offset().top;
      let objectBottom = $(this).offset().top + $(this).outerHeight();

      //object above the view
      if (objectTop < windowBottom && objectBottom < windowTop) {
        if ($(this).css("opacity") == 1) fadeEffectHandler($(this), 100, 0);
        setTimeout(() => {
          this.querySelector('section').classList.remove('fixed-position');
        }, 200);
      }
      //object comes into view
      else if (objectTop < windowBottom) {
        if ($(this).css("opacity") == 0) fadeEffectHandler($(this), 500, 1);
        this.querySelector('section').classList.add('fixed-position');
      }
      // object below the view
      else {
        if ($(this).css("opacity") == 1) fadeEffectHandler($(this), 100, 0);
        setTimeout(() => {
          this.querySelector('section').classList.remove('fixed-position');
        }, 200);
      }

    });
  }).scroll(); //invoke scroll-handler on page-load
}


// First Page type-writer animation effect
const typeWriter = (i) => {

  if (i === undefined) {
    i = 0;
  }

  let txt = '/Software Developer';
  const speed = 130;

  if (i < txt.length) {
    document.getElementById("type-writer").innerHTML += txt.charAt(i);
    setTimeout(() => typeWriter(i + 1), speed);

  } else if (i < txt.length + 5) {
    if (document.getElementById('type-writer').style.borderRight == "3px solid black") {
      document.getElementById('type-writer').style.borderRight = "none";
    } else {
      document.getElementById('type-writer').style.borderRight = "3px solid black";
    }
    setTimeout(() => typeWriter(i + 1), speed + 400);

  } else {
    document.getElementById('type-writer').style.borderRight = "none";
  }

}

// Detect whether element is (ALMOST) inside the viewport
function isAlmostInViewport(elem, delta) {
  const element = document.querySelector(elem);
  var rect = element.getBoundingClientRect();
  var html = document.documentElement;
  return (
    rect.top >= -delta &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || html.clientHeight) + (delta * 2))
}

const hideScrollIndicator = () => $("#scroll-down-indicator").css("opacity", "0");

const showScrollIndicator = () => {
  if (!isAlmostInViewport("footer", 0)) {
    $("#scroll-down-indicator").fadeTo(200, 1);
  };
}


const dynamicColorChange = () => {
  if (!isAlmostInViewport(".page-1", 100)) {
    $("#scroll-down-indicator").addClass("white");
  } else {
    $("#scroll-down-indicator").removeClass("white");
  }
}

// Dynamic scroll indicator color change
window.addEventListener('scroll', () => {
  dynamicColorChange();
});

const showScrollIndicatorOnScrollStop = (element, timeout) => {
  var handle = null;
  var onScroll = function () {
    if (handle) {
      hideScrollIndicator();
      clearTimeout(handle);
    }
    handle = setTimeout(showScrollIndicator, timeout || 2000); // default 2 sec
  };
  element.addEventListener('scroll', onScroll);
  return function () {
    element.removeEventListener('scroll', onScroll);
  };
}


// First Page background effect (Particles.js)
let particleJson = {
  particles: {
    number: { value: 50, density: { enable: true, value_area: 1000 } },
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

const loadParticleJs = () => {
  particlesJS("particles-js", particleJson);
}

// Loading 3-D Model
let saturn;
const loadSaturn = async (callback) => {
  const loader = new THREE.GLTFLoader(); 
  const dracoLoader = new THREE.DRACOLoader(); 
  dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/'); 
  loader.setDRACOLoader(dracoLoader);
  loader.crossOrigin = true;

  const interval = setInterval(() => {
    if (cachedSaturnModel) {
      clearInterval(interval);
      loader.parse(cachedSaturnModel, '', function (gltf) {
        const object = gltf.scene;
        object.position.set(0, 0, 0);
        saturn = object;
        scene.add(object);
        callback();
      });
    }
  }, 500);
}

const fadeEffectHandler = (element, time, opacity) => {
  if(!slowCPU) {
    element.fadeTo(time, opacity);
  } else {
    element.css('opacity', opacity);
  }
}

// Resume
const resumeAnimation = () => {
  function openBigResume() {
    document.getElementsByTagName('body')[0].style.overflowY = "hidden";
    bigResumeContainer.css('opacity', 0);
    bigResumeContainer.css('visibility', 'visible');
    bigResumeContainer.css('position', 'fixed');
    fadeEffectHandler(bigResumeContainer, 500, 1);
 }

  const bigResumeContainer = $('.big-resume-container');

  bigResumeContainer.on('click', function () {
    fadeEffectHandler(bigResumeContainer, 500, 0);
    setTimeout(() => {
      this.style.visibility = 'hidden';
      document.getElementsByTagName('body')[0].style.overflowY = "scroll";
    }, 500);
  });
    $('.resume__img').on('click', openBigResume);
    $('.resume__click-icon').on('click', openBigResume);
}

//Loader text changes  
const changeLoaderText = () => {
  const loaderText = document.getElementsByClassName('loader__text')[0];
  setTimeout(() => {
    loaderText.innerHTML = "You won't be dissapointed...";
  }, 5 * 1000);

  setTimeout(() => {
    loaderText.innerHTML = "Well that's embarrassing...";
  }, 10 * 1000);

  setTimeout(() => {
    const loaderImage = document.getElementsByClassName("loader__image")[0];
    loaderImage.style.visibility = "hidden";
    loaderText.innerHTML = "Something's taking too much time. Reloading the page might help.";
  }, 20 * 1000);
}

$(() => {

  // Responsive design changes for smartphones
  if (isScreenSmall) {
    particleJson.particles.number.value = 40;
    pathCurveList.shift();
    pathCurveList.unshift(new THREE.Vector3(20, 2, 220));
    pathCurveList[1] = new THREE.Vector3(-30, 2, 220);
  }

  if (!isScreenSmall && !slowCPU) {
    makeStarCursor();
  }

  loadSaturn(() => {
    document.getElementById('loader').style.display = "none";
    document.getElementsByTagName('body')[0].style.overflowY = "scroll";
    typeWriter(0);
    setTimeout(() => {
      showScrollIndicator();
    }, 2500);
  });

  changeLoaderText();
  makeStarSphere();
  dynamicColorChange();
  loadParticleJs();
  fadeEffect();
  resumeAnimation();
  animate();

  showScrollIndicatorOnScrollStop(window);
});
