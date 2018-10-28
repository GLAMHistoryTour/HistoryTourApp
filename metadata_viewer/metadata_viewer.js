var currentStep;
var currentStepNr;
var jsonPath;

window.onload = function () {
    document.querySelector("#btn-take-foto").onclick = function () {
        window.location = "../ar_viewer/ar_viewer.html?json=" + jsonPath + "&step=" + currentStepNr;
    };
    loadJsonData();
    var historicImage = document.querySelector("#historic-image");
    historicImage.src = currentStep.imageUrl;
    var metaData = document.querySelector("#data-info");
    metaData.innerHTML = currentStep.metadata;
    var infoData = document.querySelector("#info-block");
    if (currentStep.description1 != null) {
        infoData.innerHTML = currentStep.description1;
    }
};

function loadJsonData() {
    var urlParams = new URLSearchParams(window.location.search);
    var overlayImage = document.querySelectorAll('.overlay');
    jsonPath = urlParams.get('json');
    var request = new XMLHttpRequest();
    request.open("GET", "../config/" + jsonPath, false);
    request.send(null);
    var jsonData = JSON.parse(request.responseText);
    currentStepNr = urlParams.get('step');
    currentStep = jsonData.steps[currentStepNr];
}
