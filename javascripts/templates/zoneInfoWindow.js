(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['zoneInfoWindow'] = template({"1":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "  <a href='#' class='open-zone' data-polyIndex='"
    + escapeExpression(((helper = (helper = helpers.polyIndex || (depth0 != null ? depth0.polyIndex : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"polyIndex","hash":{},"data":data}) : helper)))
    + "'>"
    + escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "</a>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, lambda=this.lambda, escapeExpression=this.escapeExpression, functionType="function", helperMissing=helpers.helperMissing, buffer = "<a href='http://foursquare.com/v/"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.venue : depth0)) != null ? stack1.id : stack1), depth0))
    + "' target='_blank' style='font-weight:bold; font-size:14px; color: black'>\n  "
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.venue : depth0)) != null ? stack1.name : stack1), depth0))
    + "\n</a>\n<p>\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.zones : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "  <br/>\n  "
    + escapeExpression(((helper = (helper = helpers.beenHere || (depth0 != null ? depth0.beenHere : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"beenHere","hash":{},"data":data}) : helper)))
    + " check in"
    + escapeExpression(((helper = (helper = helpers.plural || (depth0 != null ? depth0.plural : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"plural","hash":{},"data":data}) : helper)))
    + "\n</p>";
},"useData":true});
})();