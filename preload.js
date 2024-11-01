export const isScreenSmall = window.innerWidth <= 576;
export const canTestSpeed = navigator.connection && navigator.connection.downlink;
export let highBandwidth = false;

// Testing network speed
if(!canTestSpeed) {
  console.log('Unable to test network speed, smaller 3D model will be shown by default.');
} else if(navigator.connection.downlink > 5) {
  highBandwidth = true;
} else {
  console.log('Slow network speed detected, showing smaller 3D model.');
}

// Caching 3D model
export let cachedSaturnModel = null;
async function preloadSaturn(isScreenSmall, highBandwidth) { 
  const modelName = isScreenSmall || !highBandwidth ? "saturn-compressed" : "saturn"; 
  const modelURL = `/saturn/${modelName}.glb`; 
  if (!cachedSaturnModel) { 
    const response = await fetch(modelURL); 
    cachedSaturnModel = await response.arrayBuffer(); 
  } 
}

preloadSaturn(isScreenSmall, highBandwidth);

// Testing CPU speed
function CPUSpeedTest() {
  const calculation = () => { 
    let sum = 0; 
    for (let i = 0; i < 1e7; i++) { 
      sum += Math.sqrt(i); 
    } return sum; 
  }; 
  const start = performance.now(); 
  calculation(); 
  const end = performance.now(); 
  const duration = end - start; 
  if (duration > 85) { 
    console.log('Slow CPU speed detected, switching off some animations.');
    return true
  }
  return false
}
export const slowCPU = CPUSpeedTest();
