function initMap() {
  var mapOptions = {
    center: new google.maps.LatLng(40.7902185, -73.945692),
    zoom: 12,
    streetViewControl : false,
    mapTypeControl : false,
    rotateControl : true
  };

  map = new google.maps.Map($("#canvas")[0], mapOptions);
  // setUserCoords();
}

function createMarker(item, latlng, zones) {
  // TODO: make this an object in separate file

  var marker = new google.maps.Marker({position: latlng, map: map});
  google.maps.event.addListener(marker, "click", function() {
    if (infowindow) {
      infowindow.close();
    }

    var data = item;
    $.extend(data, {
      plural : data.beenHere > 1 ? "s" : "",
      zones : zones
    });

    var infoWindowHtml = Handlebars.templates.zoneInfoWindow(data);

    infowindow = new google.maps.InfoWindow({
      content: infoWindowHtml
    });
    infowindow.open(map, marker);
  });
  return marker;
}

function setUserCoords() {
  navigator.geolocation.getCurrentPosition(function(position) {
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;
    map.setCenter(new google.maps.LatLng(lat, lng));
    map.setZoom(11);
  });
}

google.maps.Map.prototype.markers = new Array();
google.maps.Map.prototype.addMarker = function(marker) {
  this.markers[this.markers.length] = marker;
};
google.maps.Map.prototype.getMarkers = function() {
  return this.markers;
};
google.maps.Map.prototype.clearMarkers = function() {
  if(infowindow) {
    infowindow.close();
  }
  for(var i=0; i<this.markers.length; i++){
    this.markers[i].setMap(null);
  }
};

