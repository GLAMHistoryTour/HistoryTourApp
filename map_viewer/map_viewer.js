var points = new Array();
var x = document.getElementById("demo");
var map;

window.onload = function () {
    map = L.map('mapid').setView([47.3772429, 8.531449499999999], 15);
    navigator.geolocation.watchPosition(function(position){
        //if(position != null)
        //var me = L.circleMarker(position.coords.latitude, position.coords.longitude).addTo(map);
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    

    /*L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiYXJpdHNjaGNvcmFlIiwiYSI6ImNqbnExMnBodjB1MmMzd3ExZ3pzbmsxemUifQ.RmValv0ybcpFGIm2VpX3Vw', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'your.mapbox.access.token'
    }).addTo(map);*/
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(showPosition);
    } else { 
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
    x.innerHTML = "Latitude: " + position.coords.latitude + 
    "<br>Longitude: " + position.coords.longitude; 
    map.setView([position.coords.latitude, position.coords.longitude], 15);
    
    //window.navigator.vibrate([100,30,100,30,100,30,200,30,200,30,200,30,100,30,100,30,100]);
}

function loadTour(jsonPath) {
    if(points != null){
        points.forEach(function(element){
            map.removeLayer(element);
        });
    }
    points = new Array();
    
    path = "../config/" + jsonPath;
    var request = new XMLHttpRequest();
    console.log(path);
    request.open("GET", path, false);
    request.send(null);
    console.log(request.responseText);

   var markers = JSON.parse(request.responseText).steps;

    markers.forEach(function(element){
        var marker = L.marker([element.latitute, element.longitude]).addTo(map);
        marker.bindPopup(element.name).openPopup();
        points.push(marker);
    });

}