# jquery-analog-clock

Jquery plugin to display time in analog clocks.

![](http://i.gyazo.com/ed19f082e9814e350395719ea1ee3dc6.png)

This is a very early stage of the plugin so there are still lots of planned improvements.

## Features

- Constructs basic analog clock
- Displays time based on the given time
- Support for multiple clocks
- Responsive
- Adjust time by interacting with clock

## Dependencies

- jQuery
- Moment.js

## Usage

### Initialization

```javascript
$('#clock').analogClock(options);
```

Options can also be specified on the element itself. These options take precedence over the options defined in the previous declaration.

```html
<div id="clock" data-init-time="5:20"></div>
```

#### Available Options

##### initTime

Time to be displayed in the clock

*Default:* '0:00'

##### timeFormat

Time format to be used in processing time values. Refer to Moment.js [parsing documentation](http://momentjs.com/docs/#/parsing/string-format/) for other formats you can use.

*Default:* 'H:mm' (24-hour format)

##### showLabels

Shows labels for the hours.

*Default:* true

##### hourLabels

Labels that will be shown when `showLabels` is true.

*Default:* ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']

##### moveable

Allows changing of time by moving clock hands.

*Default:* true

##### quickHourSelect

Allows changing of time by clicking hour labels

*Default:* true

#### Callback options

##### onTimeSet

Callback after setting time. It will pass the formatted time and jQuery element of the clock to the handler.

Sample handler format:

```javascript
function onTimeSetHandler(formattedTime, jQueryEl) {
  ...do whatever...
}
````

### Accessing methods

There are some methods used to access data of analog clock.

```javascript
$('#clock').analogClock(methodName, [arguments]);
```

Example:

```javascript
$('#clock').analogClock('getTime', 'h:mm');
```

#### Available Methods

##### getTime(format)

Gets the time displayed in the clock. If format is not specified, time will be formatted by `initTime`.

##### getMeridian()

Determines if time is AM or PM. (returns 'am' or 'pm')

## License

jquery-analog-clock is released under the [MIT License](http://opensource.org/licenses/MIT)
