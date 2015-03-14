# jquery-analog-clock

Jquery plugin to display time in analog clocks.

![](http://i.gyazo.com/5bfcc3c42036647ef6e58144f73b499f.png)

This is a very early stage of the plugin so there are still lots of planned improvements.

## Features

- Constructs basic analog clock
- Displays time based on the given time
- Support for multiple clocks

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

##### timeFormat

Time format to be used in processing time values. Refer to Moment.js [parsing documentation](http://momentjs.com/docs/#/parsing/string-format/) for other formats you can use. *default: 'H:mm' (24-hour format)*

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
