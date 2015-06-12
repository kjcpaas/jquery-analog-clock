(function($) {
  var AnalogClock = function(element, options) {
    this.defaults = {
      timeFormat: 'H:mm',
      initialTime: '0:00',
      showLabels: true,
      hourLabels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
      moveable: true,
      quickHourSelect: true,
      // Callbacks
      onTimeSet: null
    };

    this.$el = $(element);
    this.options = $.extend({}, this.defaults, options, this.$el.data());
    this._drawClock();
  };

  AnalogClock.prototype = {
    constructor: AnalogClock,

    _drawClock: function() {
      this.clock = $('<div class="analog-clock"></div>');

      this.hourHand = $('<div class="hour-hand"></div>');
      this.minuteHand = $('<div class="minute-hand"></div>');
      this.centerCircle = $('<div class="center-circle"></div>');

      if(this.options.showLabels) this._drawLabels();

      this.clock
        .append(this.hourHand)
        .append(this.minuteHand)
        .append(this.centerCircle);

      if(this.options.moveable) this.clock.addClass('moveable');

      this.$el
        .addClass('analog-clock-wrapper')
        .append(this.clock);

      this._setTime(this.options.initTime);
      this._attachHandlers();
    },

    _setTime: function(time) {
      // If time is null, the moment object in this.currentTime was already set somewhere else, e.g. _setHour()
      if(time) {
        if(typeof(time) === 'string') {
          this.currentTime = moment(time, this.options.timeFormat);
        } else {
          this.currentTime = moment(time);
        }
      }
      this._showTime();
      if(typeof(this.options.onTimeSet)) this.options.onTimeSet(this.getTime(), this.$el);
    },

    _showTime: function() {
      var minuteAngle = this.currentTime.minutes() * 6;
      var hourAngle = (this.currentTime.hours() % 12) * 30 + this.currentTime.minutes() * 0.5;

      this.minuteHand.css('transform', 'translateX(-50%) rotate(' + minuteAngle + 'deg)');
      this.hourHand.css('transform', 'translateX(-50%) rotate(' + hourAngle + 'deg)');
    },

    _drawLabels: function() {
      var i;
      var labelContainer = $('<div class="label-container"></div>');

      if(this.options.quickHourSelect) labelContainer.addClass('quick-hour-select');

      for(i=0; i < this.options.hourLabels.length; i++) {
        var label = $('<div class="hour-label"><div class="spoke"><div class="spoke-line"></div></div></div>');
        label
          .data('hour', (i + 1) % 12)
          .addClass('hour-' + (i + 1));
        if(this.options.showLabels) label.append('<div class="hour-name" unselectable="on">' + this.options.hourLabels[i] + '</div>');
        labelContainer.append(label);
      }
      this.clock.append(labelContainer);
    },

    _setMinute: function(minute) {
      this.currentTime.minute(minute);
      this._setTime();
    },

    _setHour: function(e) {
      hour = $(e.currentTarget).data('hour');
      if(this.getMeridian() === 'pm') hour += 12;
      this.currentTime.hour(hour);
      this._setTime();
    },

    _attachHandlers: function() {
      if(this.options.moveable) {
        if(this.options.quickHourSelect) this.clock.on('click', '.hour-label', $.proxy(this._setHour, this));
        this.clock.on('mousedown', '.minute-hand', this._dragMinuteHand.bind(this));
      }
    },

    _dragMinuteHand: function(e) {
      var dragged = e.target;
      this.dragCoords = [dragged.offsetLeft - dragged.offsetWidth/2 + e.offsetX, dragged.offsetTop + e.offsetY];
      this.clock.on('mousemove', function(e) {
        var currentCursorAngle = this._currentCursorAngle(e);
        var angleDifference = this._correctAngleDifference(currentCursorAngle - this._currentMinuteAngle());
        // Correct angle difference when crossing 12 o'clock
        var newMinute = this._currentMinute() + Math.round(angleDifference / 6);
        this._setMinute(newMinute);
      }.bind(this));
      this.clock.on('mouseup', this._stopDragHand.bind(this));
    },

    _stopDragHand: function(e) {
      this.clock.off('mousemove');
    },

    _currentMinute: function() {
      return this.currentTime.minute();
    },

    _currentMinuteAngle: function() {
      return this._currentMinute() * 360 / 60;
    },

    _currentCursorAngle: function(e) {
      // Pass mouse event in here
      var coords = this._getMouseCoordsRelativeToCenter(e);
      var atanAngle = Math.atan(coords.x / coords.y) * 360 / (2 * Math.PI);
      // Correction since atan returns -PI/2 to PI/2
      if(coords.y < 0) atanAngle = 180 + atanAngle;
      return (atanAngle + 360) % 360;
    },

    _correctAngleDifference: function(angleDiff) {
      var sign = (angleDiff === 0) ? 1 : angleDiff / Math.abs(angleDiff);
      var newDiff = angleDiff;
      if(Math.abs(angleDiff) > 180) newDiff = (360 - Math.abs(angleDiff)) * -1 * sign;
      return newDiff;
    },

    _getMouseCoordsRelativeToCenter: function(e) {
      return {
        x: e.pageX - this.clock.offset().left - this.centerCircle.width()/2 - this.clock.width()/2,
        y: -(e.pageY - this.clock.offset().top - this.centerCircle.height()/2 - this.clock.height()/2)
      };
    },

    getTime: function(format) {
      if(!format) format = this.options.timeFormat;
      return this.currentTime.format(format);
    },

    getMeridian: function() {
      // am or pm
      return this.currentTime.format('a');
    }
  };

  $.fn.analogClock = function(options) {
    var args = Array.apply(null, arguments);
    //remove method name
    args.shift();
    var returnValue = null;

    this.each(function() {
      var data;
      var $this = $(this);

      if(!options || typeof(options)==='object') {
        // Initialized
        if(data = $this.data('analog-clock')) data.destroy();
        $this.data('analog-clock', new AnalogClock(this, options));
      } else if(typeof(options)==='string') {
        // Trying to access plugin method
        data = $this.data('analog-clock');
        if(data && data[options] && typeof(data[options]) === 'function') {
          if(!returnValue) {
            // First value
            returnValue = data[options].apply(data, args);
          } else if (returnValue instanceof Array) {
            returnValue.push(data[options].apply(data, args));
          } else {
            returnValue = [returnValue, data[options].apply(data, args)];
          }
        }
      }
    });

    return returnValue ? returnValue : this;
  };
}(jQuery));
