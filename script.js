const root = document.documentElement;
const statusText = document.querySelector("#status-text");
const statusMessages = [
  "Building robots ...",
  "Initialiazing OS ...",
  "Calibrating sensors ...",
  "Loading AI ...",
  "Preparing workshops ...",
  "Coming soon ..."
];

const typeSpeed = 70;
const messageInterval = 5000;
let statusIndex = statusMessages.length - 1;
let typeTimer = 0;
let nextMessageTimer = 0;

function setCubeSize() {
  const viewport = window.visualViewport || window;
  const width = viewport.width || window.innerWidth;
  const height = viewport.height || window.innerHeight;
  const cubeSize = Math.floor(Math.min(width, height) * 0.5);

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
