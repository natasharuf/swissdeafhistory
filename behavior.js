var currentview = "timelineviewer";
var currentpopupdata = [];
var bounds = [[0,1050], [0,2600]]; //sets the zoom and panning limits, in this case requires the timeline to be in the middle vertically
//Leaflet Map
var timelineviewer = L.map('timelineviewer',{crs: L.CRS.Simple,
                         maxZoom: 4,
                         minZoom: 0.5,
                         zoomSnap: 0.5,
                         zoomDelta: 0.5,
                         zoomControl: false,
                         renderer: L.canvas({padding: .3}),
                         maxBounds: bounds});
//Canvas rendering turned on for better performance

timelineviewer.fitBounds([[0,1050], [68,2600]]);

//yearmarker layer, placed up here so it draws at the bottom
var yearLayer = L.layerGroup.collision({margin: 4});
var timelineLayer = L.layerGroup();

//First, make a leaflet cluster group.
var markers = L.markerClusterGroup({
    spiderfyDistanceMultiplier: 1, //adjusts the distance of the cluster "spider" of points from the center
    maxClusterRadius: 30, //controls how much is clustered together
    zoomToBoundsOnClick: false,
    elementsPlacementStrategy: 'one-circle',
    removeOutsideVisibleBounds: false,
    animateAddingMarkers: true,
    animate: true,
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false
});

//custom marker icons
var switzerland = L.icon({
    iconUrl: 'images/switzerland.png',
    iconSize:     [20, 20], // size of the icon
    iconAnchor:   [10, 10], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
});
var international = L.icon({
    iconUrl: 'images/international.png',
    iconSize:     [20, 20],
    iconAnchor:   [10, 10],
    popupAnchor:  [0, 0]
});
var sport = L.icon({
    iconUrl: 'images/sport.png',
    iconSize:     [20, 20],
    iconAnchor:   [10, 10],
    popupAnchor:  [0, 0]
});


// loop for making all the many lines for the actual line of the timeline
for(var lineNumber = 0; lineNumber < yeardata.length; lineNumber++) {
    custommarker = L.divIcon({className: 'timeline-part'})
    yearmarker = L.marker([0,yeardata[lineNumber]], {icon: custommarker,interactive: false, clickable: false});
    timelineLayer.addLayer(yearmarker);
}

// loop for making all the dates
for(var lineNumber = 0; lineNumber < yeardata.length; lineNumber++) {
    text = '<span class="label">' + yeardata[lineNumber] + '</span>'
    custommarker = L.divIcon({html: text})
    yearmarker = L.marker([0,yeardata[lineNumber]], {icon: custommarker,interactive: false, clickable: false});
    yearLayer.addLayer(yearmarker);
}
timelineLayer.addTo(timelineviewer)
yearLayer.addTo(timelineviewer)

// loop for making all the points on the timeline
for(var lineNumber = 0; lineNumber < dataset.length; lineNumber++) {

                latitude = 0;
                longtitude = dataset[lineNumber][1];
                title = dataset[lineNumber][0];
                text = dataset[lineNumber][3];
                year = dataset[lineNumber][1];
                markerLocation = dataset[lineNumber][4];
                let imgUrl = dataset[lineNumber][5];
                if (markerLocation == undefined) {
                    markerLocation = '';
                }
                var marker = '';
                pointType = dataset[lineNumber][2];
                heightNeeded = determinePopupHeight(text);
                var currentColor = '';

                if (pointType == 'switzerland') {
                    currentColor = '#D15050'
                } else if(pointType == 'international') {
                    currentColor = '#53ADC4'
                } else if(pointType == 'sport') {
                  currentColor = '#F2C1AE'
                }

                popupComplete = '<div class="customPopup"><div class="columnLeft" style="height:' + heightNeeded + 'px; color:' + currentColor +'; border-color:' + currentColor +'"><h3 class="year">' + year + '</h3><h3 class="location">' + markerLocation + '</div><div class="columnRight" style="height:' + heightNeeded + 'px"><h3 style="color:' + currentColor + '">' + title + '</h3><p>' + text + '</p></div></div>';

                if(pointType == 'switzerland') {
                    markerIcon = switzerland;
                } else if(pointType == 'international') {
                    markerIcon = international;
                } else if(pointType == 'sport') {
                    markerIcon = sport;
                }

                marker = L.marker([latitude,longtitude], {riseOnHover: true, icon: markerIcon}).addTo(markers).bindPopup(popupComplete, {minWidth: 745, autoPan: false}).on('click',movePopup).on('click',function(e){setBackground(e, imgUrl)});

};
// Add the cluster group to the map
markers.addTo(timelineviewer)

// the FULL TIMELINE BUTTON
d3.select('#fulltimeline').on('click', function() {
    $('.label').css('display','none');
    $('.leaflet-div-icon').css('display','none');
    timelineviewer.flyToBounds([[0,1050], [0,2600]])
});

// the ZoomBox button plugin
/*var zoomcontrol = L.control.zoomBox({modal: false, position: 'bottomright', className: "zoomBox"}).addTo(timelineviewer)

d3.select('.zoomBox').html('Zoom to area').on('click', function() {
    zoomBoxColor = d3.select('.zoomBox').style('background-color')
    if (zoomBoxColor == 'rgb(244, 244, 244)') {
        showNotification('draw a rectangle over the area you want to zoom to');
    } else {
        hideNotification();
    }
})*/



// background wechseln in data.js

function setBackground(e, url) {
  console.log("function to set background", url);


  $('#container').css({'background-image': 'url(./images/' + url + ')'});


}


// formula to determine how tall a marker popup needs to be
function determinePopupHeight(characters) {
    characters = text.length;
    lines = characters / 50;
    linesrounded = Math.ceil(lines);
    height = 23 + linesrounded*18;
    return height;
}
// determine pointer location
var pointerLocX;
var pointerLocY;

$(document).on( "click", function( event ) {
  pointerLocX = event.pageX;
  pointerLocY = event.pageY;
    console.log('clicked');
})

// function to move the marker popup if the popup falls below the timeline line because it is a part of a cluster
function movePopup(e) {

    $('.leaflet-popup').removeClass('popUpBelow');
    clickedLatitude = this.getLatLng().lat;
    clickedLong = this.getLatLng().lng;

    if (clickedLatitude < -0.9) {

        moveDownLatitude = clickedLatitude * 250;
        movePopupY = moveDownLatitude + 'px'
        $('.leaflet-popup').addClass('popUpBelow');
        console.log('showing below!!')

    };

    // move the click marker to the center
    if (currentview == 'timelineviewer') {
        currentmap = timelineviewer;
    } else {
        currentmap = mapviewer;
    }
        lateranimation = window.setTimeout(thenmovemap, 50);
        function thenmovemap() {
            var movemap;
            if ($(document).width() > 600) {
            if($(document).width()- pointerLocX < 340) {
                movemap = 340 - ($(document).width() - pointerLocX);
            } else if (pointerLocX < 85) {
                movemap = pointerLocX -85;
            };
            currentmap.panBy([movemap,0], {duration: Math.abs(movemap) / 500});
            } else {
                console.log('moving special way ' + clickedLong)
                currentmap.panTo([clickedLatitude, clickedLong], {duration: Math.abs(pointerLocX) / 500});
            };
            };
        lateranimation;
        createMobilePopup();
    }

//}

// notification popup
function showNotification(text) {
    d3.select('#container')
        .append('div')
        .attr('id','notification-holder')
        .transition().delay(7500).remove();
    d3.select('#notification-holder')
        .append('div')
        .attr('id','notification')
        .html(text)
        .transition().duration(500).style('opacity','1')
        .transition().duration(500).delay(7000).style('opacity','0').remove();
}

function hideNotification() {
    d3.select('#notification').remove()
    d3.select('#notification-holder').remove()
}

var latLngBounds;
markers.on('clusterclick', function (a) {
    if (currentview = 'timelineviewer') {
	latLngBounds = a.layer.getBounds();
    console.log(latLngBounds);
    if (latLngBounds._southWest.lng - latLngBounds._northEast.lng !== 0) {
    timelineviewer.flyToBounds([[0,latLngBounds._southWest.lng], [0,latLngBounds._northEast.lng]]);
    }};
});

// hide popup on map click or zoom
timelineviewer.on('mouseup', function() {
    hideNotification();
})
timelineviewer.on('zoomstart', function() {
    hideNotification()
})

var mobilepopupopen = false
// Mobile Popup viewer

function createMobilePopup() {
    if ($(window).width() < 601) {

        if (currentview == 'timelineviewer') {
            currentmapid = '#timelineviewer';
        } else {
            currentmapid = '#mapviewer';
        }

        mobilepopupopen = true;
        function updatePopup() {

        yearandlocation = '';
        heighttimeline = 0;
        yearandlocation = $(currentmapid + ' .customPopup .columnLeft .year').html() + ' ' + $('.customPopup .columnLeft .location').html();
        title = $(currentmapid + ' .customPopup .columnRight h3').html();
        description = $(currentmapid + ' .customPopup .columnRight p').html();
        console.log(yearandlocation, title, description)
        selectedcolor = $(currentmapid + ' .customPopup .columnLeft').css('border-color')
            $('#mobilepopupholder .year-location').html(yearandlocation).css('color',selectedcolor).css('border-bottom','2px solid '+ selectedcolor)
            $('#mobilepopupholder .title').html(title)
            $('#mobilepopupholder .description').html(description)
            heighttimeline = $('#mobilepopupholder').height() * -.3
        $(currentmapid).css('margin-top',heighttimeline);
        $('#mobilepopupholder').css('bottom',-5).css('opacity',0.3).css('display','block').animate({
            opacity: 1,
            bottom: 0
        });
        }
        setTimeout(updatePopup, 200);




    }
}
function hideMobilePopup() {
        if (currentview == 'timelineviewer') {
            currentmapid = '#timelineviewer';
        } else {
            currentmapid = '#mapviewer';
        }


    $('#mobilepopupholder').fadeOut();
    $(currentmapid).css('margin-top','')
}

//Switch to map view start scripts (all setup in map.js)
$('#MapSelect').click(function() {
    showMapView();
})
//Switch to timeline view start scripts
$('#TimelineSelect').click(function() {
    showTimelineView();
})

window.onload = function() {
   $('#mapviewer').css('display','none');
   $('#TimelineSelect a').css('background-color','#ffffff');
   $('#TimelineSelect a').css('color','#000000');
   /*showNotification('click and drag to pan, scroll to zoom');*/
   initializeMap();
   $('#mobilepopupholder a.exit').click(function(){hideMobilePopup()})
}
