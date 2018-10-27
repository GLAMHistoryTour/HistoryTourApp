var points = new Array();
var error_msg;
var map;
var me;
var me_radius;

window.onload = function () {
    map = L.map('mapid').setView([47.3772429, 8.531449499999999], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    error_msg = document.getElementById("no-navi");
    var tour = findGetParameter('json');
    if(tour != null){
        loadTour(tour);   
    }

    startTracking();
    /*L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiYXJpdHNjaGNvcmFlIiwiYSI6ImNqbnExMnBodjB1MmMzd3ExZ3pzbmsxemUifQ.RmValv0ybcpFGIm2VpX3Vw', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'your.mapbox.access.token'
    }).addTo(map);*/
}

function getLocation(){

    navigator.geolocation.getCurrentPosition(showPosition);
}

function startTracking() {
    if (navigator.geolocation) {
        error_msg.style.display = "none";

        //on start up
        navigator.geolocation.getCurrentPosition(function(e){
            var radius = e.coords.accuracy / 2;
            var coord = L.latLng(e.coords.latitude, e.coords.longitude);
            me = L.circleMarker(coord).addTo(map).bindPopup("You are within " + radius + " meters from this point").openPopup();
            me_radius =  L.circle(coord, radius).addTo(map);
            map.panTo(L.latLng(e.coords.latitude, e.coords.longitude));
        });

        //watcher
        navigator.geolocation.watchPosition(showPosition);
    } else { 
        error_msg.innerHTML = "Geolocation is not supported by this browser.";
    }
}


function showPosition(e) {
    var radius = e.coords.accuracy / 2;
    me.setLatLng(L.latLng(e.coords.latitude, e.coords.longitude));
    me.setPopupContent("You are within " + radius + " meters from this point");

    me_radius.setLatLng(L.latLng(e.coords.latitude, e.coords.longitude));
    me_radius.setRadius(radius);

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
    request.open("GET", path, false);
    request.send(null);

   var markers = JSON.parse(request.responseText).steps;

    markers.forEach(function(element){
        var marker = L.marker([element.latitute, element.longitude]).addTo(map);
        marker.bindPopup(element.name);
        points.push(marker);
    });

}

function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    location.search.substr(1).split("&").forEach(function (item) {
          tmp = item.split("=");
          if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
        });
    return result;
}