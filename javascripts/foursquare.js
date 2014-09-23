// Endpoint helpers

var FS = {
  api_root: "https://api.foursquare.com/v2",
  api_version: "20140501",
  redirect_uri: "http://localhost",

  getter: function(endpoint,params) {
    params = params || [];
    return Promise.resolve($.getJSON(FS.api_root + endpoint + "?oauth_token=" + accessToken() + "&v=" + FS.api_version + params.join("&")));
  },

  explore: function(ll,radius,novelty) {
    return FS.getter("/venues/explore",[
      "radius="+radius,
      "novelty="+novelty
    ]);
  },

  exploreNew: function(ll,radius) {
    return FS.explore(ll,radius,"new");
  },

  getCategories: function() {
    return FS.getter("/venues/categories");
  }
};