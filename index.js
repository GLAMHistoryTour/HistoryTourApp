window.onload = function () {
    var request = new XMLHttpRequest();
   request.open("GET", "config/tours.json", false);
   request.send(null);
   var tours = JSON.parse(request.responseText).tours;
    tours.forEach(function(element){
        var link = document.createElement('a');
        link.href = "tour_description/description.html?json="+element.url;
        link.classList.add("list-group-item");
        link.classList.add("list-group-item-action");
        link.innerHTML = element.title;
        document.querySelector('#project-list').appendChild(link);
    });
}