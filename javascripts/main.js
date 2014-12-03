var google; // should already be defined
var client_id = "3JD0TUHCIB2VVNGILRR32KNB4OUHZDYIQJWJMBPDFEZSBRXH";
var redirect_uri = "http://localhost";
var categories = [];
var infowindow, venues, map;
var current_cat = null;
var activeFilters = [];

$(document).ready((function() {
  if (document.location.hash) {
    $("#connect").hide();
    FS.getCategories().then(function(data) {
      fsCategories = data.response.categories;
      showCategories(fsCategories);
      return true;
    });
  }
  $("#connect").click(function() {
    document.location = "https://foursquare.com/oauth2/authenticate?client_id=" + client_id + "&response_type=token&redirect_uri=" + redirect_uri;
  });
  $("#canvas").on("click", ".open-zone", function() {
    var zoneFilter = new Filter({
      image : "images/neighborhood_bg_32.png",
      name : $(this).text(),
      type : "neighborhood"
    });
    $("#category_list").prepend(zoneFilter.render());

    var data = Zoner.polyList[$(this).data("polyindex")];
    var venues = Zoner.getWithinNeighborhood(zoneFilter.data);
    activeFilters.push(zoneFilter);

    map.clearMarkers();
    updateStats(venues);
    plotVenues(venues);
  });

  $("#category_list").on("click", ".cat-link", function() {
    map.clearMarkers();

    current_cat = $(this).data('id');

    // hide category list and show control to clear this category
    $(".cat-entry").addClass("none");

    var catFilter = new Filter({
      name : $(this).text(),
      image : $(this).siblings(".expand-cat").find("img").prop("src"),
      type : "category"
    });

    activeFilters.push(catFilter);
    $("#category_list").prepend(catFilter.render());

    FS.getUserVenuesInCategory($(this).data('id')).then(function(data) {
      venues = data.response.venues.items;

      updateStats(venues);
      plotVenues(venues);
    });
  });

  $("body").on("click","a[href='#']",function(e) {
    e.preventDefault();
  });

  initMap();
  Zoner.plot();
}));

function accessToken() {
  // FIXME: NOPE
  return document.location.hash.split("=")[1];
}

function showCategories(fsCategories) {
  var cat, path, parentId = null;

  $.each(fsCategories, showCat);

  function showCat(key, value) {
    var savePath = path;
    var saveCat = cat;
    path = path ? path + 1 : 1;

    $.extend(value, {
      path: path,
      hasChildren: value.categories && value.categories.length
    });

    cat = new Category(value);
    if(saveCat) {
      saveCat.categories.push(cat);
    } else {
      categories.push(cat);
    }

    var $parent = $("#category_list").parent().find(".level-"+(path-1)).last();
    $parent.last(".level-"+(path-1)).append(cat.render());

    if(value.hasChildren) {
      $.each(value.categories, showCat);
    }

    path = savePath;
    cat = saveCat;
  }

  return true;
}

function updateStats(venues) {
  debugger;
  var html = venues.length + " visited";
  $("#stats").html(html).show();
}

function clearMap() {
  current_cat = null;
  venues = null;
  map.clearMarkers();
  $(".cat-entry").removeClass("none");
  $("#stats").hide();
}

function plotVenues(venues) {
  for(var i=0; i<venues.length; i++) {
    var item = venues[i];
    var latlng = new google.maps.LatLng(item.venue.location.lat, item.venue.location.lng);

    var zones = Zoner.getNeighborhoods(latlng);
    map.addMarker(createMarker(item,latlng,zones));
  }
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


