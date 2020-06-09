var map = L.map('map_canvas').setView([51.505, -0.09], 13);
L.tileLayer('http://{s}.tiles.mapbox.com/v3/mapbox.mapbox-light/{z}/{x}/{y}.png', {
    attribution: 'Imagery from <a href="http://mapbox.com/about/maps/">MapBox</a> &mdash; &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
    maxZoom: 18,
}).addTo(map);

var marker = L.marker([51.5, -0.09]).addTo(map);

// Create an element to hold all your text and markup
var container = $('<div />');

// Delegate all event handling for the container itself and its contents to the container
container.on('click', '.smallPolygonLink', function() {
    alert("test");
});

// Insert whatever you want into the container, using whichever approach you prefer
container.html("This is a link: <a href='#' class='smallPolygonLink'>Click me</a>.");
container.append($('<span class="bold">').text(" :)"))

// Insert the container into the popup
marker.bindPopup(container[0]);
