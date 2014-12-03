var Filter = function(args) {
  args = args ? args : {};
  $.extend(this,
    $.extend({
      image : "https://ss3.4sqi.net/img/categories_v2/food/default_bg_32.png",
      name : "",
      type : undefined
    }, args)
  );
}

Filter.prototype = (function () {

  function attachEvents() {
    this.$el.find(".close-filter").on("click", function() {
      this.$el.remove();
    }.bind(this));
  }

  function render() {
    return $(Handlebars.templates.filter(this));
  }

  return {
    constructor: Filter,

    render: function () {
      this.$el = render.call(this);
      attachEvents.call(this);
      return this.$el;
    }
  };

}());
