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
        link.classList.add("flex-column");
        var wrapperDiv = document.createElement("div");
        wrapperDiv.classList.add("d-flex");
        wrapperDiv.classList.add("w-100");
        wrapperDiv.classList.add("justify-content-between");
        wrapperDiv.classList.add("align-items-start");
        var tourTitle = document.createElement("h6");
        tourTitle.classList.add("mb-1");
        var timeEstimate = document.createElement("small");
        timeEstimate.innerHTML = element.time;
        tourTitle.innerHTML = element.title;
        wrapperDiv.appendChild(tourTitle);
        wrapperDiv.appendChild(timeEstimate);
        var description = document.createElement("p");
        description.innerHTML = element.description;
        description.classList.add("mb-1");
        link.appendChild(wrapperDiv);
        link.appendChild(description);


        document.querySelector('#project-list').appendChild(link);
    });
}
