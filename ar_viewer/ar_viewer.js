// Prefer camera resolution nearest to 1280x720.
var constraints = {
    audio: false,
    video: {
        facingMode: "environment"
    }
};

var screenshotButton;
var uploadButton;
var liveButton;
var opacitySlider;
var canvas = null;
var video;
var currentStep;
var jsonPath;

this.clientid = 'cc86a8de0e7c459';
this.endpoint = 'https://api.imgur.com/3/image';
this.callback = 'feedback' || undefined;
this.dropzone = document.querySelectorAll('.dropzone');

navigator.mediaDevices.getUserMedia(constraints)
    .then(function (mediaStream) {
        var video = document.querySelector('video');
        video.srcObject = mediaStream;
        video.onloadedmetadata = function (e) {
            video.play();
            var absoluteWrapper = document.querySelector('.absolute-wrapper');
            var infoContent = document.querySelector('#slider-row');
            infoContent.style.marginTop = video.offsetHeight + video.offsetTop + "px";
        };

    })
    .catch(function (err) {
        console.log(err.name + ": " + err.message);
    }); // always check for errors at the end.

window.onload = function () {
    var clipboard = new ClipboardJS('#btn-copy');
    clipboard.on('success', function (e) {
        console.log(e);
    });
    loadJson();
    var overlayImage = document.querySelectorAll('.overlay');
    overlayImage.forEach(function (element) {
        element.src = currentStep.imageUrl;
    });
    if (currentStep.description2) {
        var infoText = document.querySelector('#info-text');
        infoText.innerHTML = currentStep.description2;
    }
    screenshotButton = document.querySelector('#btn-capture');
    screenshotButton.onclick = takeScreenshot;

    liveButton = document.querySelector('#btn-live');
    liveButton.onclick = discardPicture;

    var backButton = document.querySelector('#btn-continue');
    backButton.onclick = function(){
        window.location = "../map_viewer/map_viewer.html?json="+jsonPath;
    };

    uploadButton = document.querySelector('#btn-upload');
    //uploadButton.onclick = test;
    uploadButton.onclick = e => {
        takeASnap()
            .then(download);
    };

    opacitySlider = document.querySelector('#slider-opacity');
    opacitySlider.oninput = opacityChanger;
}

function takeScreenshot() {
    canvas = document.querySelector('#mycanvas');
    video = document.querySelector('video');
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
    screenshotButton.disabled = true;
    uploadButton.disabled = false;
    liveButton.disabled = false;
    if (currentStep.description3) {
        var infoText = document.querySelector('#info-text');
        infoText.innerHTML = currentStep.description3;
    }
    merge();
}

function merge() {
    var c = document.querySelector("#myCanvas2");
    var ctx = c.getContext("2d");
    var imageObj1 = new Image();
    var imageObj2 = new Image();
    imageObj1.src = currentStep.imageUrl;

    imageObj1.onload = function() {
          imageObj2.src = "../img/braun.jpg";
          imageObj2.onload = function() {
            var img = c.toDataURL("image/png");
            var im = document.querySelector('#captured-image');
            var ration = (400/imageObj1.height);
            var oldImageWidth = imageObj1.width*ration;
            var nration = (400/im.height);
            var newImageWidth = im.width*nration;
            c.width = newImageWidth + oldImageWidth;
            c.height = 400;

            ctx.drawImage(imageObj1, 0, 0, oldImageWidth ,400);
            ctx.drawImage(document.querySelector('#captured-image'), oldImageWidth, 0, newImageWidth, 400);
       }
    };
}

function takeASnap() {
    return new Promise((res, rej) => {

        var canvasSnap = document.querySelector("#myCanvas2");
        canvasSnap.toBlob(res, 'image/jpeg'); // request a Blob from the canvas
    });
}

function download(blob) {
    var file = new Blob([blob], {
        type: 'image/jpeg'
    });
    matchFiles(file);
}

function matchFiles(file) {
    if (file.type.match(/image/) && file.type !== 'image/svg+xml') {
        document.body.classList.add('busy');
        var fd = new FormData();
        fd.append('image', file);

        this.post(this.endpoint, fd, function (data) {
            document.body.classList.remove('busy');
            typeof this.callback === 'function' && this.callback.call(this, data);
        }.bind(this));
    }
}


function post(path, data, callback) {
    var xhttp = new XMLHttpRequest();

    xhttp.open('POST', path, true);
    xhttp.setRequestHeader('Authorization', 'Client-ID ' + this.clientid);
    xhttp.onreadystatechange = function () {

        if (this.readyState === 4) {
            if (this.status >= 200 && this.status < 300) {
                var response = '';
                try {
                    response = JSON.parse(this.responseText);
                    document.querySelector('#linkbox').hidden = false;
                    document.querySelector('#link').href = response.data.link;
                    document.querySelector('#btn-copy').dataset.clipboardText = response.data.link;
                } catch (err) {
                    response = this.responseText;
                }
                callback.call(window, response);
            } else {
                throw new Error(this.status + " - " + this.statusText);
            }
        }
    };
    xhttp.send(data);
    xhttp = null;
}

function discardPicture() {
    var lifeViewContainer = document.querySelector('#life-view');
    var capturedImageContainer = document.querySelector('#captured-view');
    capturedImageContainer.style.display = 'none';
    lifeViewContainer.style.display = 'initial';

    screenshotButton.disabled = false;
    uploadButton.disabled = true;
    liveButton.disabled = true;
    if (currentStep.description2) {
        var infoText = document.querySelector('#info-text');
        infoText.innerHTML = currentStep.description2;
    }
}

function opacityChanger() {
    var overlayImage = document.querySelectorAll('.overlay');
    overlayImage.forEach(function (element) {
        element.style.opacity = 1 - (opacitySlider.value / 100);
    });
}

function loadJson() {
    var urlParams = new URLSearchParams(window.location.search);
    jsonPath = urlParams.get('json');
    var request = new XMLHttpRequest();
    request.open("GET", "../config/" + jsonPath, false);
    request.send(null);
    var jsonData = JSON.parse(request.responseText);
    currentStep = jsonData.steps[urlParams.get('step')];
}
