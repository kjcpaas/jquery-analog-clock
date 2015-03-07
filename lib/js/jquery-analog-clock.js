(function($) {
  var AnalogClock = function(element, options) {
    var defaults = {
      timeFormat: 'H:mm:ss',
      initialTime: '4:00'
    };

    this.$el = $(element);
    this.options = $.extend({}, defaults, options);
    this._drawClock();
  };

  AnalogClock.prototype = {
    constructor: AnalogClock,

    _drawClock: function() {
      this.hourHandContainer = $('<div class="hour-hand-container"></div>');
      this.hourHandContainer.append('<div class="hour-hand"></div>');

      this.minuteHandContainer = $('<div class="minute-hand-container"></div>');
      this.minuteHandContainer.append('<div class="minute-hand"></div>');

      this.centerCircleContainer = $('<div class="center-circle-container"></div>');
      this.centerCircleContainer.append('<div class="center-circle"></div>');

      this.$el
        .addClass('analog-clock')
        .append(this.hourHandContainer)
        .append(this.minuteHandContainer)
        .append(this.centerCircleContainer);

      this.currentTime = moment(this.options.initTime, this.options.timeFormat);

      this._showTime();
    },

    _showTime: function() {
      var minuteAngle = this.currentTime.minutes() * 6;
      var hourAngle = (this.currentTime.hours() % 12) * 30 + this.currentTime.minutes() * 0.5;

      this.minuteHandContainer.css('transform', 'rotate(' + minuteAngle + 'deg)');
      this.hourHandContainer.css('transform', 'rotate(' + hourAngle + 'deg)');
    }
  };

  $.fn.analogClock = function(options) {
    this.each(function() {
      new AnalogClock(this, options);
    });
  };
}(jQuery));
