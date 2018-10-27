// Prefer camera resolution nearest to 1280x720.
var constraints = {
    audio: false,
    video:  {facingMode: "environment"}
};

navigator.mediaDevices.getUserMedia(constraints)
    .then(function (mediaStream) {
        var video = document.querySelector('video');
        video.srcObject = mediaStream;
        video.onloadedmetadata = function (e) {
            video.play();
        };
    })
    .catch(function (err) {
        console.log(err.name + ": " + err.message);
    }); // always check for errors at the end.
window.onload = function () {
    var urlParams = new URLSearchParams(window.location.search);
    var overlayImage = document.querySelectorAll('.overlay');
    overlayImage.forEach(function (element) {
            element.src = urlParams.get('imageLink');
    });
    var screenshotButton = document.querySelector('#btn-capture');
    var liveButton = document.querySelector('#btn-live');
    var opacitySlider = document.querySelector('#slider-opacity');
    screenshotButton.onclick = function () {
        var canvas = document.querySelector('canvas');
        var video = document.querySelector('video');
        var img = document.querySelector('#captured-image');
        var lifeViewContainer = document.querySelector('#life-view');
        var capturedImageContainer = document.querySelector('#captured-view');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        img.width = video.offsetWidth;
        img.height = video.offsetHeight;
        img.src = canvas.toDataURL('image/webp');
        capturedImageContainer.style.display = 'initial';
        lifeViewContainer.style.display = 'none';
    };
    
    liveButton.onclick = function () {
        var lifeViewContainer = document.querySelector('#life-view');
        var capturedImageContainer = document.querySelector('#captured-view');
        capturedImageContainer.style.display = 'none';
        lifeViewContainer.style.display = 'initial';
    };

    opacitySlider.oninput = function () {
        var overlayImage = document.querySelectorAll('.overlay');
        overlayImage.forEach(function (element) {
            element.style.opacity = 1-(opacitySlider.value / 100);
        });
    };
}
