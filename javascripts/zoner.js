var Zoner = {
  polyList: [],

  plot: function() {
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
        fillOpacity: 0.4
        // clickable: false
      });

      // poly.infowindow = new google.maps.InfoWindow({
      //   content : "<div class='zone-name'>" +
      //             "<span style='background:#" + zone.color + "'></span>" + zone.name +
      //             "<a class='learn-more' href='#'>Learn more</a>" +
      //             "</div>",
      //   name : i
      // });

      var polyZone = {
        name: zone.name,
        polygon: poly
      }
      Zoner.polyList.push(polyZone);

      poly.setMap(map);
      google.maps.event.addListener(poly, "click", function(e) {
        Zoner.showInfo(e,polyZone);
      });
    });
  },

  getNeighborhoods: function(lat,lng) {
    var latLng;

    if(typeof lat === "number") {
      latLng = new google.maps.LatLng(lat,lng);
    } else {
      latLng = lat;
    }

    return $.grep(Zoner.polyList, function(zone) {
      return google.maps.geometry.poly.containsLocation(latLng, zone.polygon);
    });
  },

  getWithinNeighborhood: function(venues,zone) {
    return $.grep(venues, function(venue) {
      var lat = venue.location.lat;
      var lng = venue.location.lng;
      var latLng = new google.maps.LatLng(lat,lng);
      return google.maps.geometry.poly.containsLocation(latLng, zone.polygon);
    });
  },

  showInfo: function(e,zone) {
    var latLng = new google.maps.LatLng(e.latLng.lat(),e.latLng.lng());
    if(infowindow) {
      infowindow.close();
    }
    var html = "<p style='font-weight:bold'>"+zone.name+"</p>";
    infowindow = new google.maps.InfoWindow({
      content: html
    });
    infowindow.setPosition(latLng);
    infowindow.open(map);
  }
}
