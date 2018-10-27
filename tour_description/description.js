window.onload = function () {
    var request = new XMLHttpRequest();
    var urlParams = new URLSearchParams(window.location.search);
    request.open("GET", "../config/"+urlParams.get('json'), false);
    request.send(null);
    var tour = JSON.parse(request.responseText);
    var tourTitle = document.createElement('h3');
    tourTitle.innerHTML = tour.title;
    var image = document.createElement('img');
    image.classList.add("img-fluid");
    image.src = tour.imageUrl
    image.innerHTML = tour.title;
    var tourDescription = document.createElement('p');
    tourDescription.innerHTML = tour.description;
    document.querySelector('#content-column').appendChild(tourTitle);
    document.querySelector('#content-column').appendChild(image);
    document.querySelector('#content-column').appendChild(tourDescription);
    var startButton = document.createElement('button');
    startButton.innerHTML = "Start tour";
    startButton.classList.add("btn");
    startButton.classList.add("btn-primary");
    startButton.onclick = function(){
         window.location = "../map_viewer/map_viewer.html?json="+urlParams.get('json');
    };
    document.querySelector('#content-column').appendChild(startButton);
}
