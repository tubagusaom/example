

const wrapper = document.getElementById("signature-pad");



const lockButton = wrapper.querySelector("[data-action=lock]");
const unlockButton = wrapper.querySelector("[data-action=unlock]");

const clearButton = wrapper.querySelector("[data-action=clear]");
const undoButton = wrapper.querySelector("[data-action=undo]");
// const changeColorButton = wrapper.querySelector("[data-action=change-color]");

const savePNGButton = wrapper.querySelector("[data-action=save-png]");
const saveJPGButton = wrapper.querySelector("[data-action=save-jpg]");
const saveSVGButton = wrapper.querySelector("[data-action=save-svg]");

const canvas = wrapper.querySelector("canvas");

const signaturePadbody = document.getElementById("signature-pad--body");

const signaturePad = new SignaturePad(canvas, {
  // It's Necessary to use an opaque color when saving image as JPEG;
  // this option can be omitted if only saving as PNG or SVG
  backgroundColor: 'rgb(255, 255, 255)'
});

// Adjust canvas coordinate space taking into account pixel ratio,
// to make it look crisp on mobile devices.
// This also causes canvas to be cleared.
function resizeCanvas() {
  // When zoomed out to less than 100%, for some very strange reason,
  // some browsers report devicePixelRatio as less than 1
  // and only part of the canvas is cleared then.
  const ratio =  Math.max(window.devicePixelRatio || 2, 2);

  // This part causes the canvas to be cleared
  // canvas.width = canvas.offsetWidth * ratio;
  // canvas.height = canvas.offsetHeight * ratio;
  // canvas.getContext("2d").scale(ratio, ratio);

  var xxx = canvas.width = canvas.offsetWidth * ratio;
  var yyy = canvas.height = canvas.offsetHeight * ratio;
  var zzz = canvas.getContext("2d").scale(ratio, ratio);

  // alert(canvas.offsetHeight * ratio);

  // This library does not listen for canvas changes, so after the canvas is automatically
  // cleared by the browser, SignaturePad#isEmpty might still return false, even though the
  // canvas looks empty, because the internal data of this library wasn't cleared. To make sure
  // that the state of this library is consistent with visual state of the canvas, you
  // have to clear it manually.
  signaturePad.clear_on();
}

// On mobile devices it might make more sense to listen to orientation change,
// rather than window resize events.
window.onresize = resizeCanvas;
resizeCanvas();

function download(dataURL, filename) {
  const blob = dataURLToBlob(dataURL);
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.style = "display: none";
  a.href = url;
  a.download = filename;

  document.body.appendChild(a);
  a.click();

  window.URL.revokeObjectURL(url);
}

// One could simply use Canvas#toBlob method instead, but it's just to show
// that it can be done using result of SignaturePad#toDataURL.
function dataURLToBlob(dataURL) {
  // Code taken from https://github.com/ebidel/filer.js
  const parts = dataURL.split(';base64,');
  const contentType = parts[0].split(":")[1];
  const raw = window.atob(parts[1]);
  const rawLength = raw.length;
  const uInt8Array = new Uint8Array(rawLength);

  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }

  return new Blob([uInt8Array], { type: contentType });
}

clearButton.addEventListener("click", () => {
  signaturePad.clear();
});

undoButton.addEventListener("click", () => {
  const data = signaturePad.toData();

  if (data) {
    data.pop(); // remove the last dot or line
    signaturePad.fromData(data);
  }
});



const idLock = document.getElementById("lock");
idLock.addEventListener("click", () => {

  var dataAction = idLock.getAttribute("data-action");
  var sig = signaturePadbody.getAttribute("class");

  if (dataAction === "lock") {

    signaturePad.off();

    idLock.setAttribute("data-action", "unlock");
    idLock.innerHTML = "Unlock";

    signaturePadbody.classList.add(sig + "-lock");

    clearButton.setAttribute("disabled", "");
    undoButton.setAttribute("disabled", "");

  }else {

    signaturePad.on();

    idLock.setAttribute("data-action", "lock");
    idLock.innerHTML = "Lock";

    signaturePadbody.removeAttribute("class");
    signaturePadbody.setAttribute("class", 'signature-pad--body');

    clearButton.removeAttribute("disabled");
    undoButton.removeAttribute("disabled");

  }

});

// changeColorButton.addEventListener("click", () => {
//   const r = Math.round(Math.random() * 255);
//   const g = Math.round(Math.random() * 255);
//   const b = Math.round(Math.random() * 255);
//   const color = "rgb(" + r + "," + g + "," + b +")";

//   signaturePad.penColor = color;
// });

savePNGButton.addEventListener("click", () => {
  if (signaturePad.isEmpty()) {
    alert("Please provide a signature first.");
  } else {
    const dataURL = signaturePad.toDataURL();
    download(dataURL, "signature.png");
  }
});

saveJPGButton.addEventListener("click", () => {
  if (signaturePad.isEmpty()) {
    alert("Please provide a signature first.");
  } else {
    const dataURL = signaturePad.toDataURL("image/jpeg");
    download(dataURL, "signature.jpg");
  }
});

saveSVGButton.addEventListener("click", () => {
  if (signaturePad.isEmpty()) {
    alert("Please provide a signature first.");
  } else {
    const dataURL = signaturePad.toDataURL('image/svg+xml');
    download(dataURL, "signature.svg");
  }
});
