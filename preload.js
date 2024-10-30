export const isScreenSmall = window.innerWidth <= 576;
export const canTestSpeed = navigator.connection && navigator.connection.downlink;
export let highBandwidth = false; 
if(canTestSpeed && navigator.connection.downlink > 5) {
  highBandwidth = true;
}

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