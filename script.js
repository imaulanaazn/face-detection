const video = document.getElementById("video");
const overlay = document.getElementById("overlay");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const canvasContext = overlay.getContext("2d");
let timeoutId;

// Load face-api.js models
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
  faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
  faceapi.nets.faceExpressionNet.loadFromUri("/models"),
]).then(startVideo);

// Function to start video streaming
function startVideo() {
  navigator.mediaDevices
    .getUserMedia({ video: {} })
    .then((stream) => {
      video.srcObject = stream;
    })
    .catch((err) => console.error("Error accessing webcam: ", err));
}

// Function to detect faces
async function detectFaces() {
  console.log("Hello");
  const options = new faceapi.TinyFaceDetectorOptions();
  const detections = await faceapi
    .detectAllFaces(video, options)
    .withFaceLandmarks()
    .withFaceExpressions();

  // Clear canvas
  canvasContext.clearRect(0, 0, overlay.width, overlay.height);

  // Draw detections
  faceapi.draw.drawDetections(overlay, detections);
  faceapi.draw.drawFaceLandmarks(overlay, detections);
  faceapi.draw.drawFaceExpressions(overlay, detections);

  // Recursively call detectFaces using setTimeout
  timeoutId = setTimeout(detectFaces); // 100ms interval
}

// Start button functionality
startBtn.addEventListener("click", () => {
  detectFaces();
  startBtn.disabled = true;
  stopBtn.disabled = false;
});

// Stop button functionality
stopBtn.addEventListener("click", () => {
  clearTimeout(timeoutId);
  startBtn.disabled = false;
  stopBtn.disabled = true;
});

// Automatically start video detection on load
video.addEventListener("play", () => {
  overlay.width = video.width;
  overlay.height = video.height;
});
