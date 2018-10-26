window.onload = function () {
    var request = new XMLHttpRequest();
   request.open("GET", "config/tours.json", false);
   request.send(null);
   var tours = JSON.parse(request.responseText).tours;
    tours.forEach(function(element){
        var link = document.createElement('a');
        link.href = "tour_viewer/tour.html?json="+element.url;
        link.innerHTML = element.title;
        var listItem = document.createElement('li');
        listItem.appendChild(link);
        document.querySelector('#project-list').appendChild(listItem);
    });
}