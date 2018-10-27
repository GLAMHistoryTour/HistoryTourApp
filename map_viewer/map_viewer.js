var points = new Array();
var error_msg;
var map;
var me;
var me_radius;
var me_radius_shown = true;

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

    navigator.geolocation.getCurrentPosition(updatePosition);
}

function startTracking() {
    if (navigator.geolocation) {
        error_msg.style.display = "none";

        //on start up
        navigator.geolocation.getCurrentPosition(initPosition);

        //watcher
        navigator.geolocation.watchPosition(updatePosition);
    } else { 
        error_msg.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function initPosition(e){
    var radius = Math.round(e.coords.accuracy / 2);
    var coord = L.latLng(e.coords.latitude, e.coords.longitude);
    me = L.circleMarker(coord).addTo(map).bindPopup("You are within " + radius + " meters from this point").openPopup();
    me_radius =  L.circle(coord, radius).addTo(map);
    map.panTo(coord);
}

function updatePosition(e) {
    var radius = Math.round(e.coords.accuracy / 2);
    var coord = L.latLng(e.coords.latitude, e.coords.longitude);
    me.setLatLng(coord);
    me.setPopupContent("You are within " + radius + " meters from this point");
    if(radius<5){
        me_radius.remove();
        me_radius_shown = false;
    } else if (!me_radius_shown){
        me_radius.addTo(map);
    }
    me_radius.setLatLng(coord);
    me_radius.setRadius(radius);

    compareDistance(coord);
}

function compareDistance(coord){
    points.forEach(function(element){
        var dist = coord.distanceTo(element.getLatLng());
        console.log(dist);
        //TODO get dist from json
        if(dist < 10){
            console.log('bzzzz');
            window.navigator.vibrate([100,30,100,30,100,30,200,30,200,30,200,30,100,30,100,30,100]);
        }
    });
    //window.navigator.vibrate([100,30,100,30,100,30,200,30,200,30,200,30,100,30,100,30,100]);
}


function loadTour(jsonPath) {
    if(points != null){
        points.forEach(function(element){
            element.remove();
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