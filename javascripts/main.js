var google; // should already be defined
var client_id = "3JD0TUHCIB2VVNGILRR32KNB4OUHZDYIQJWJMBPDFEZSBRXH";
var redirect_uri = "http://localhost";
var categories = null;
var infowindow, venues, map;
var current_cat = null;

$(document).ready((function() {
  if (document.location.hash) {
    $("#connect").hide();
    FS.getCategories().then(function(data) {
      categories = data.response.categories;
      showCategories(categories);
      return true;
    });
  }
  $("#connect").click(function() {
    document.location = "https://foursquare.com/oauth2/authenticate?client_id=" + client_id + "&response_type=token&redirect_uri=" + redirect_uri;
  });
  $("#canvas").on("click", ".open-zone", function() {
    filterHtml = Handlebars.templates.filter({
      name : $(this).text(),
      image : "images/neighborhood_bg_32.png"
    });
    $("#category_list").prepend(filterHtml);
    $(".cat-entry.filter").find("img").prop("src","images/neighborhood_bg_32.png");

    // don't know Zoner.polyList index, needs to be data-attr on anchor tag
    // Zoner.getWithinNeighborhood(Zoner.polyList[]);
    // $current_zone.find("a").text($(this));
    
  });
  $("#category_list").on("click", ".close-cat", function() {
    current_cat = null;
    venues = null;
    map.clearMarkers();
    $(this).parent().remove();
    $(".cat-entry").removeClass("none");
    $("#stats").hide();
  });
  $("#category_list").on("click", ".cat-link", function() {
    map.clearMarkers();

    current_cat = $(this).data('id');

    // hide category list and show control to clear this category
    $(".cat-entry").addClass("none");

    filterHtml = Handlebars.templates.filter({
      name : $(this).text(),
      image : $(this).siblings(".expand-cat").find("img").prop("src")
    });
    $("#category_list").prepend(filterHtml);


    $.getJSON("" + FS.api_root + "/users/self/venuehistory?categoryId=" + ($(this).data('id')) + "&oauth_token=" + accessToken() + "&v=" + FS.api_version, function(data) {
      venues = data.response.venues.items;

      updateStats(data.response);

      for (var i=0; i<venues.length; i++) {
        var item = venues[i];
        var latlng = new google.maps.LatLng(item.venue.location.lat, item.venue.location.lng);

        var zones = Zoner.getNeighborhoods(latlng);
        map.addMarker(createMarker(item,latlng,zones));
      }
    });
  });

  $("body").on("click","a[href='#']",function(e) {
    e.preventDefault();
  });

  initMap();
  Zoner.plot();
}));

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

function accessToken() {
  // FIXME: NOPE
  return document.location.hash.split("=")[1];
}

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
  var path, parentId = null;

  $.each(categories, showCat);

  function showCat(key, value) {
    var savePath = path;
    path = path ? path + 1 : 1;

    var $parent = $("#category_list").parent().find(".level-"+(path-1)).last();

    $.extend(value, {
      path: path,
      hasChildren: value.categories && value.categories.length
    });
    var html = Handlebars.templates.category(value);
    $parent.last(".level-"+(path-1)).append(html);

    if(value.hasChildren) {
      $.each(value.categories, showCat);
    }

    path = savePath;
  }

  $(".expand-cat").on("click", expandCats);

  return true;
}

function expandCats() {
  $el = $(this).parent();
  $el.toggleClass("expanded");
}

function updateStats (data) {
  html = "";
  // html += data.venues.count + " " + categories[current_cat].pluralName + " total visited";
  html += data.venues.count + " visited";
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


