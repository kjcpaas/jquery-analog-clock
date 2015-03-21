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

      this.hourHandContainer = $('<div class="hour-hand-container"></div>');
      this.hourHandContainer.append('<div class="hour-hand"></div>');

      this.minuteHandContainer = $('<div class="minute-hand-container"></div>');
      this.minuteHandContainer.append('<div class="minute-hand"></div>');

      this.centerCircleContainer = $('<div class="center-circle-container"></div>');
      this.centerCircleContainer.append('<div class="center-circle"></div>');

      this.clock
        .append(this.hourHandContainer)
        .append(this.minuteHandContainer)
        .append(this.centerCircleContainer);

      if(this.options.moveable) this.clock.addClass('moveable');

      this.$el
        .addClass('analog-clock-wrapper')
        .append(this.clock);

      if(this.options.showLabels) this._drawLabels();
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

      this.minuteHandContainer.css('transform', 'rotate(' + minuteAngle + 'deg)');
      this.hourHandContainer.css('transform', 'rotate(' + hourAngle + 'deg)');
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

    _setHour: function(e) {
      hour = $(e.currentTarget).data('hour');
      if(this.getMeridian() === 'pm') hour += 12;
      this.currentTime.hour(hour);
      this._setTime();
    },

    _attachHandlers: function() {
      if(this.options.moveable && this.options.quickHourSelect) this.clock.on('click', '.hour-label', $.proxy(this._setHour, this));
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
