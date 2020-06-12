var mapviewer;

function initializeMap() {
    mapviewer = L.map('mapviewer', {
         maxZoom: 5,
         minZoom: 1,
         zoomControl: false,
    }).setView([1, 0], 2);
    L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiZGF0eWVsbCIsImEiOiJjajNzOG9hY2QwMDVkMzJxY3ZwdDF1NHhpIn0.u6X1litujJiVfrbNdwzWgw').addTo(mapviewer);

    //First, make a leaflet cluster group.
    var mapclusters = L.markerClusterGroup({
    spiderfyDistanceMultiplier: 1, //adjusts the distance of the cluster "spider" of points from the center
    maxClusterRadius: 30, //controls how much is clustered together
    zoomToBoundsOnClick: true,
    elementsPlacementStrategy: 'one-circle',
    removeOutsideVisibleBounds: false,
    animateAddingMarkers: true,
    animate: true,
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false
    });

// loop for making all the points on the map
for(var lineNumber = 0; lineNumber < dataset.length; lineNumber++) {

                latitude = 0;
                longtitude = 0;
                title = dataset[lineNumber][0];
                text = dataset[lineNumber][3];
                year = dataset[lineNumber][1];
                markerLocation = dataset[lineNumber][4];
                if (markerLocation == undefined) {
                    markerLocation = '';
                }
                // give lat,long depending on location
                if (markerLocation == 'England') {
                    latitude = 53;
                    longtitude = -1
                } else if (markerLocation == 'London') {
                    latitude = 51.65;
                    longtitude = -0.2;
                } else if (markerLocation == 'Germany') {
                    latitude = 51.2;
                    longtitude = 10.5;
                } else if (markerLocation == 'France') {
                    latitude = 46.2;
                    longtitude = 2.2;
                  } else if (markerLocation == 'Paris') {
                      latitude = 49.05;
                      longtitude = 2.3;
                } else if (markerLocation == 'USA') {
                    latitude = 37;
                    longtitude = -95.7;
                } else if (markerLocation == 'Washington D.C.') {
                    latitude = 39;
                    longtitude = -77;
                } else if (markerLocation == 'Connecticut') {
                  latitude = 41;
                  longtitude = -72.9;
                } else if (markerLocation == 'Vancouver') {
                  latitude = 49.3;
                  longtitude = -123.2;
                } else if (markerLocation == 'Italy') {
                    latitude = 41.9;
                    longtitude = 12.6;
                } else if (markerLocation == 'Milano') {
                    latitude = 45.25;
                    longtitude = 9.2;
                } else if (markerLocation == 'Rom') {
                    latitude = 41.9;
                    longtitude = 12.6;
                } else if (markerLocation == 'Switzerland') {
                    latitude = 46.8;
                    longtitude = 8.2;
                } else if (markerLocation == 'Zurich') {
                    latitude = 47;
                    longtitude = 8.2;
                } else if (markerLocation == 'Luzern') {
                    latitude = 47.1;
                    longtitude = 8.2;
                } else {
                    continue;
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

                popupComplete = '<div class="customPopup"><div class="columnLeft" style="height:' + heightNeeded + 'px; color:' + currentColor +'; border-color:' + currentColor +'"><h3>' + year + '</h3><h3>' + markerLocation + '</div><div class="columnRight" style="height:' + heightNeeded + 'px"><h3 style="color:' + currentColor + '">' + title + '</h3><p style="color: #ffffff">' + text + '</p></div></div>';
                popupComplete = '<div class="customPopup"><div class="columnLeft" style="height:' + heightNeeded + 'px; color:' + currentColor +'; border-color:' + currentColor +'"><h3 class="year">' + year + '</h3><h3 class="location">' + markerLocation + '</div><div class="columnRight" style="height:' + heightNeeded + 'px"><h3 style="color:' + currentColor + '">' + title + '</h3><p>' + text + '</p></div></div>';

                if(pointType == 'switzerland') {
                    markerIcon = switzerland;
                } else if(pointType == 'international') {
                    markerIcon = international;
                } else if(pointType == 'sport') {
                    markerIcon = sport;
                }



                marker = L.marker([latitude,longtitude], {riseOnHover: true, icon: markerIcon}).addTo(mapclusters).bindPopup(popupComplete, {minWidth: 745, autoPan: false}).on('click', movePopup);

};

// Add the cluster group to the map
mapclusters.addTo(mapviewer)
}; // end initializeMap()


function showMapView() {
    $('#TimelineSelect a').css('background-color','');
    $('#MapSelect a').css('background-color','#ffffff');
    $('#mapviewer').css('display','block');
    $('#timelineviewer').css('display','none');
    mapviewer.invalidateSize();
    $('.leaflet-zoom-box-control.leaflet-bar.leaflet-control').css('display','none');
    $('#fulltimeline').css('display','none');
    $('.title1').css('color','#ffffff');
    $('.subtitle1').css('color','#ffffff');
    $('#attribution').css('display','block');
    $('#TimelineSelect a').css('color','#ffffff');
    $('#MapSelect a').css('color','#000000');
    currentview = "mapviewer";
    $('#title-mobile').css('color','#fff');
    $('#title-mobile2').css('color','#fff');
};

function showTimelineView() {
    $('#MapSelect a').css('background-color','');
    $('#TimelineSelect a').css('background-color','#ffffff');
    $('#mapviewer').css('display','none');
    $('#timelineviewer').css('display','block');
    $('.leaflet-zoom-box-control.leaflet-bar.leaflet-control').css('display','block');
    $('#fulltimeline').css('display','block');
    $('.title1').css('color','');
    $('.subtitle1').css('color','');
    $('#title-mobile').css('color','');
    $('#attribution').css('display','none');
    $('#TimelineSelect a').css('color','#000000');
    $('#MapSelect a').css('color','#ffffff');
    currentview = "timelineviewer";
};
