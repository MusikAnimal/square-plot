var google; // should already be defined
var client_id = "3JD0TUHCIB2VVNGILRR32KNB4OUHZDYIQJWJMBPDFEZSBRXH";
var redirect_uri = "http://localhost";
var api_root = "https://api.foursquare.com/v2";
var api_version = "20140501";
var access_token = null;
var categories = null;
var infowindow, venues, map;
var current_cat = 0;
var polyList = [];

$(document).ready((function() {
  if (document.location.hash) {
    access_token = document.location.hash.split("=")[1];
    $.getJSON("" + api_root + "/venues/categories?oauth_token=" + access_token + "&v=" + api_version, function(data) {
      categories = data.response.categories;
      showCategories(categories);
      return true;
    });
  }
  $("#connect").click(function() {
    document.location = "https://foursquare.com/oauth2/authenticate?client_id=" + client_id + "&response_type=token&redirect_uri=" + redirect_uri;
  });
  $("#category-list").on("click", "a.cat-link", function() {
    map.clearMarkers();

    current_cat = $(this).data('id');

    $.getJSON("" + api_root + "/users/self/venuehistory?categoryId=" + ($(this).data('id')) + "&oauth_token=" + access_token + "&v=" + api_version, function(data) {
      venues = data.response.venues.items;

      // updateStats(data.response);

      for (var i=0; i<venues.length; i++) {
        var item = venues[i];
        var latlng = new google.maps.LatLng(item.venue.location.lat, item.venue.location.lng);
        map.addMarker(createMarker(item,latlng));
      }
    });
  });

  $("body").on("click","a[href='#']",function(e) {
    e.preventDefault();
  });

  initMap();
}));

function createMarker(item, latlng) {
  var marker = new google.maps.Marker({position: latlng, map: map});
  google.maps.event.addListener(marker, "click", function() {
    if (infowindow) {
      infowindow.close();
    }
    infowindow = new google.maps.InfoWindow({content:
      "<a href='http://foursquare.com/v/" + item.venue.id + "' target='_blank' style='font-weight:bold; font-size:14px; color: black'>" + item.venue.name + "</a>" +
      "<p>" + item.beenHere + " check in" + (item.beenHere > 1 ? "s" : "") + " </p>"
    });
    infowindow.open(map, marker);
  });
  return marker;
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
    this.markers[i].set_map(null);
  }
};

function setUserCoords() {
  navigator.geolocation.getCurrentPosition(function(position) {
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;
    map.setCenter(new google.maps.LatLng(lat, lng));
    map.setZoom(11);
  });
}

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

function showCategories(categories) {
  $.each(categories, showCat);

  var path = null;

  function showCat(key, value) {
    var savePath = path;
    path = path ? path + 1 : 1;

    $("#category-list").append("<div class='cat-entry level-" + path + "'> <img src='" + value.icon.prefix + "bg_32" + value.icon.suffix + "' /> <a href='#' data-id='" + value.id + "' class='cat-link'>" + value.name + "</a> </div>");
    if (value.categories) {
      $.each(value.categories, showCat);
    }

    path = savePath;
  }

  return true;
}

function updateStats (data) {
  html = "";
  html += data.venues.count + " " + categories[current_cat].pluralName + " total visited";
  $("#stats").html(html).show();
}

function setUpZones() {
  $.each(neighborhoods, function(i,zone) {
    var paths = [];
    for(var j in zone.coords) {
      var lat = zone.coords[j].lat;
      var lng = zone.coords[j].lng;
      paths.push(new google.maps.LatLng(lat,lng));
    }

    var poly = new google.maps.Polygon({
      paths: paths,
      strokeColor: "#000000",
      strokeOpacity: 0.25,
      strokeWeight: 2,
      fillColor: '#'+zone.color,
      fillOpacity: 0.45
    });

    poly.infowindow = new google.maps.InfoWindow({
      content : "<div style='font-weight:bold; font-size:14px; color: black'>" + zone.name + "</div>",
      name : i
    });
    poly.setMap(map);
    // google.maps.event.addListener(poly, "click", showInfo);

    polyList.push(poly);
  });
}


