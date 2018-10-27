window.onload = function () {
    var request = new XMLHttpRequest();
    request.open("GET", "../config/braun.json", false);
    request.send(null);
    var tour = JSON.parse(request.responseText);
    var link = document.createElement('img');
    link.classList.add("img-fluid");
    link.src = tour.imageUrl
    link.innerHTML = tour.title;
    document.querySelector('#content-column').appendChild(link);
    
}
