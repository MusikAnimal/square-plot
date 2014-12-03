var Category = function(args) {
  args = args ? args : {};
  $.extend(this,
    $.extend({
      id : 0,
      categories : [],
      hasChildren : 0,
      icon : {},
      name : "",
      path : "",
      pluralName : "",
      shortName : ""
    }, args)
  );
}

Category.prototype = (function () {

  function attachEvents() {
    this.$el.find(".expand-cat").on("click", function() {
      this.$el.toggleClass("expanded");
    }.bind(this));
  }

  function render() {
    return $(Handlebars.templates.category(this));
  }

  return {
    constructor: Category,

    render: function () {
      this.$el = render.call(this);
      attachEvents.call(this);
      return this.$el;
    }
  };

}());
