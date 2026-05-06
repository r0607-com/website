const root = document.documentElement;
const statusText = document.querySelector("#status-text");

if (!statusText) throw new Error("#status-text element not found");

const statusMessages = [
  "Building robots ...",
  "Initializing OS ...",
  "Calibrating sensors ...",
  "Loading AI ...",
  "Preparing workshops ...",
  "Coming soon ..."
];

const typeSpeed = 70;       // ms per character
const messageInterval = 5000; // ms to hold a completed message before cycling
let statusIndex = statusMessages.length - 1; // starts at last so first showNext() wraps to 0
let typeTimer = null;
let nextMessageTimer = null;

function setCubeSize() {
  const viewport = window.visualViewport || window;
  const width = viewport.width || window.innerWidth;
  const height = viewport.height || window.innerHeight;
  const cubeSize = Math.floor(Math.min(width, height) * 0.45);

  root.style.setProperty("--cube-size", `${cubeSize}px`);
}

let resizeFrame = 0;

function queueCubeResize() {
  cancelAnimationFrame(resizeFrame);
  resizeFrame = requestAnimationFrame(setCubeSize);
}

root.classList.add("js-ready");
setCubeSize();
window.addEventListener("resize", queueCubeResize);

if (window.visualViewport) {
  window.visualViewport.addEventListener("resize", queueCubeResize);
}

function typeStatusMessage(message, characterIndex = 0) {
  statusText.textContent = message.slice(0, characterIndex);

  if (characterIndex < message.length) {
    typeTimer = window.setTimeout(
      () => typeStatusMessage(message, characterIndex + 1),
      typeSpeed
    );
    return;
  }

  nextMessageTimer = window.setTimeout(showNextStatusMessage, messageInterval);
}

function showNextStatusMessage() {
  window.clearTimeout(typeTimer);
  window.clearTimeout(nextMessageTimer);

  statusIndex = (statusIndex + 1) % statusMessages.length;
  typeStatusMessage(statusMessages[statusIndex]);
}

showNextStatusMessage();
