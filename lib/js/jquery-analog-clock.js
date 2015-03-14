(function($) {
  var AnalogClock = function(element, options) {
    this.defaults = {
      timeFormat: 'H:mm:ss',
      initialTime: '4:00',
      showLabels: true,
      hourLabels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
    };

    this.$el = $(element);
    this.options = $.extend({}, this.defaults, options, this.$el.data());
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

      if(this.options.showLabels) this._drawLabels();

      this.currentTime = moment(this.options.initTime, this.options.timeFormat);

      this._showTime();
    },

    _showTime: function() {
      var minuteAngle = this.currentTime.minutes() * 6;
      var hourAngle = (this.currentTime.hours() % 12) * 30 + this.currentTime.minutes() * 0.5;

      this.minuteHandContainer.css('transform', 'rotate(' + minuteAngle + 'deg)');
      this.hourHandContainer.css('transform', 'rotate(' + hourAngle + 'deg)');
    },

    _drawLabels: function() {
      var i;
      var labelContainer = $('<div class="label-container"></div>')
      for(i=0; i < this.options.hourLabels.length; i++) {
        var label = $('<div class="hour-label"><div class="hour-name" unselectable="on">' + this.options.hourLabels[i] + '</div></div>');
        label.addClass('hour-' + (i + 1));
        labelContainer.append(label);
      }
      this.$el.append(labelContainer);
    }
  };

  $.fn.analogClock = function(options) {
    this.each(function() {
      new AnalogClock(this, options);
    });
  };
}(jQuery));
