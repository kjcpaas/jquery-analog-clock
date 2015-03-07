(function($) {
  $.fn.analogClock = function(options) {
    this.addClass('analog-clock');

    var hourHandContainer = $('<div class="hour-hand-container"></div>');
    hourHandContainer.append('<div class="hour-hand"></div>');

    var minuteHandContainer = $('<div class="minute-hand-container"></div>');
    minuteHandContainer.append('<div class="minute-hand"></div>');

    var centerCircleContainer = $('<div class="center-circle-container"></div>');
    centerCircleContainer.append('<div class="center-circle"></div>');

    this.append(hourHandContainer);
    this.append(minuteHandContainer);
    this.append(centerCircleContainer);
  };
}(jQuery));
