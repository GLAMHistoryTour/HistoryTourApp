var points = new Array();
var error_msg;
var map;
var me;
var me_radius;
var me_radius_shown = true;

window.onload = function () {
    map = L.map('mapid').setView([47.3772429, 8.531449499999999], 17);

    /*L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);*/

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiYXJpdHNjaGNvcmFlIiwiYSI6ImNqbnExMnBodjB1MmMzd3ExZ3pzbmsxemUifQ.RmValv0ybcpFGIm2VpX3Vw', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'your.mapbox.access.token'
    }).addTo(map);

    error_msg = document.getElementById("no-navi");
    var tour = findGetParameter('json');
    if (tour != null) {
        loadTour(tour);
    }

    startTracking();
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

function initPosition(e) {
    var radius = Math.round(e.coords.accuracy / 2);
    var coord = L.latLng(e.coords.latitude, e.coords.longitude);
    me = L.circleMarker(coord).addTo(map).bindPopup("You are within " + radius + " meters from this point");
    me_radius = L.circle(coord, radius).addTo(map);
    map.panTo(coord);
    //Fit range to markers
    var group = new L.featureGroup(points.concat(me));
    map.fitBounds(group.getBounds());
}

function updatePosition(e) {
    var radius = Math.round(e.coords.accuracy / 2);
    var coord = L.latLng(e.coords.latitude, e.coords.longitude);
    me.setLatLng(coord);
    me.setPopupContent("You are within " + radius + " meters from this point");
    if (radius < 5) {
        me_radius.remove();
        me_radius_shown = false;
    } else if (!me_radius_shown) {
        me_radius.addTo(map);
    }
    me_radius.setLatLng(coord);
    me_radius.setRadius(radius);

    compareDistance(coord);
}

function compareDistance(coord) {
    var found = false;
    points.forEach(function (element) {
        var dist = coord.distanceTo(element.getLatLng());
        console.log(dist);
        if (dist < element.requested_radius) {
            found = true;
            element.on('click', function (e) {
                console.log('whoot');
                window.location = "../metadata_viewer/metadata_viewer.html?json=" + findGetParameter('json') + "&step=" + element.step_nr;
            });
            document.querySelector("#footer").style.display = "inline";

        } else {
            document.querySelector("#footer").style.display = "none";
            element.off('click');
        }
    });
    if (found) {
        navigator.vibrate([1000, 1000, 1000]);
    }
}


function loadTour(jsonPath) {
    if (points != null) {
        points.forEach(function (element) {
            element.remove();
        });
    }
    points = new Array();

    var path = "../config/" + jsonPath;
    var request = new XMLHttpRequest();
    request.open("GET", path, false);
    request.send(null);

    var markers = JSON.parse(request.responseText).steps;

    markers.forEach(function (element, i) {
        if (element.requested_radius == null) {
            element.requested_radius = 20;
        }
        var marker = L.marker([element.latitute, element.longitude]).addTo(map);
        L.circle([element.latitute, element.longitude], element.requested_radius).addTo(map);
        marker.bindPopup(element.name);
        marker.alt = element.imageUrl;
        marker.step_nr = i;
        marker.requested_radius = element.requested_radius;
        marker.interactive = true;
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
