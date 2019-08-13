# dni-date-converter

The D'ni Date Converter is a JavaScript implementation of the D'ni↔Gregorian calendar conversion algorithms originally developed by Brett Middleton. Details about the algorithms themselves can be found [here](https://archive.guildofarchivists.org/wiki/D%27ni_time_conversion).

This project contains both the converter and a website which can be used to convert arbitrary dates between the two calendar systems. To use the date converter in your own project, you will only need `js/DniDate.js`. 

## `DniDate` Object

`DniDate` is modeled stylistically on the native JavaScript `Date` object, with similar getters and setters for the various components of a D'ni date. It also supports manipulation of D'ni dates, just as the `Date` object supports manipulating dates in the Gregorian calendar.

### Initialization

```javascript
new DniDate();
new DniDate(hahr[, vailee[, yahr[, gartahvo[, tahvo[, gorahn[, prorahn]]]]]]);
```
If no arguments are provided, the constructor creates a `DniDate` object for the current D'ni date and time.

If at least one argument is provided, missing arguments are either set to 1 (for the yahr, if missing), or 0 for all others.

If a value falls outside of the valid range for that argument, the adjacent value will be adjusted. For instance, `new DniDate(2500, 10, 1)` is equivalent to `new DniDate(2501, 0, 1)` – both create a date for Leefo 1, 2501. This auto-adjustment applies to all arguments besides `hahr`.

#### Examples
```javascript
var dd = new DniDate(9672, 8, 3, 2, 5, 20, 12); // Leevosahn 3 9672 DE 2:05:20:12
var dd = new DniDate(9672, 8, 3); // Leevosahn 3 9672 DE 0:00:00:00
var dd = new DniDate(9672); // Leefo 1 9672 DE 0:00:00:00
var dd = new DniDate(); // Date will be set to the current D'ni date and time
```

### Instance methods
#### Converters
##### `setFromSurfaceDate(dateObject[, isUTC])`
Sets the `DniDate` object to the D'ni date and time that matches the supplied JavaScript `Date` object. By default, the time of the specified date is converted to Cavern Time (UTC-0700) before being converted. If you want the time of your specified date to be treated as UTC by the converter, set the `isUTC` parameter to `true`.

**NOTE**: If you try to create a Gregorian date between 1 CE and 99 CE (1 - 99) by calling `new Date(year, month, day)`, the `Date` object will "helpfully" set your date in the 20th century (1901 - 1999). To avoid this, create the `Date` object, then call `setFullYear()` with your desired year before passing it into `DniDate`:

```javascript
var surfaceDate = new Date(47, 0, 1); // January 1, 1947
surfaceDate.setFullYear(47); // January 1, 0047

var dd = new DniDate();
dd.setFromSurfaceDate(surfaceDate);
```

##### `toSurfaceDate()`
Returns a new `Date` object set to the Gregorian calendar equivalent of the `DniDate`'s date and time. The time of this object is aligned so that calling `.toUTCString()` will provide the proper UTC time, and adjusting the value down by 7 hours will provide the proper D'ni Cavern date.

##### `toCavernDateTimeString()`

Returns a full date and time string containing the Gregorian equivalent of the configured D'ni date in the Cavern's local time zone (UTC-0700).

#### Getters

* `getHahr()`
* `getVailee()` (Returns a value between 0 and 9 representing the numerical vailee value.)
* `getVaileeName([useDniFontMapping])` (Returns the actual vailee name as a string value. When `useDniFontMapping` is `true`, the output can be mapped to the webfont version of Cyan's Dnifont font. When `useDniFontMapping` is `false`, the output is written in [OTS](https://archive.guildofarchivists.org/wiki/D%27ni_(language)#Old_Transliteration_Standard). The default value for `useDniFontMapping` is `false`.)
* `getYahr()`
* `getGartahvo()`
* `getPartahvo()` (Not commonly used; this value divides the D'ni yahr into 5 segments, rather than the tahvo's 25.)
* `getTahvo()`
* `getGorahn()`
* `getProrahn()`

#### Setters

* `setHahr()`
* `setVailee()` (Uses 0-indexed values.)
* `setGartahvo()`
* `setTahvo()`
* `setGorahn()`
* `setProrahn()`

As with the constructor, if you supply a value that falls outside of the valid range for that date component via one of these setters, a valid date will automatically be calculated by adjusting adjacent values.

You may notice that there is a `getPartahvo()`, method, but no `setPartahvo()` method. This is because `DniDate` treats the partahvo as a calculated unit, rather than a specified one. The value of the partahvo in a given date is determined by dividing the number of tahvotee by 5, then rounding down, resulting in an integer value between 0 and 4.

#### Formatters

##### `toDateString([useDniFontMapping])`

Returns a string with the vailee name, yahr, and hahr (month, day, year), as well as the era (BE or DE). When `useDniFontMapping` is set to `true`, the vailee name will be formatted to display properly in conjunction with Cyan's Dnifont font. Otherwise, it will use the capitalized OTS transliteration.

##### `toTimeString()`

Returns the gartahvo, tahvo, gorahn, and prorahn, separated by colons. The tahvo, gorahn, and prorahn values are zero-padded to two digits in this output for better legibility.

##### `toString()`

Overrides the default `Object` behavior and returns a single string with both date and time values, concatenated together by a space.

##### `toFontMappedString()`

Outputs the same content as `toString()`, but with the vailee formatted to display properly in conjunction with Cyan's Dnifont font.

##### `valueOf()`

Automatically converts the date to Gregorian time and outputs the built-in `Date()` object's `valueOf()` value, which is the number of milliseconds between 1 January 1970 00:00:00 UTC and the given date.

### Dealing with timezones

#### Converting to D'ni Time

D'ni has only one timezone, which is aligned to UTC-0700 (Mountain Standard Time). Daylight Saving Time does not apply in D'ni, so during the summer, the offset remains UTC-0700. When converting a surface date to D'ni time using ``setFromSurfaceDate()``, the ``Date`` object will be converted to UTC-0700. This means that 1/1/1900 12:00:00 UTC-0800 and 1/1/1900 12:00:00 UTC-0700 will return different D'ni dates, while 1/1/1900 12:00:00 UTC-0700 and 1/1/1900 13:00:00 UTC-0800 will return the same D'ni date.

#### Converting to Surface Time

The surface dates returned by `toSurfaceDate()` are aligned to the UTC (Coordinated Universal Time) timezone, which is GMT with no daylight saving offset. To display dates in the user's local timezone, simply call one of the `Date` object's conversion getters (such as `toString()`) or assemble the date manually using the getters for each individual date component. You can also pass this `Date` object to a date formatting tool like moment.js.

#### Displaying Cavern-local time (UTC-0700)

Use this code snippet to get a date object that is aligned to Mountain Standard Time, where the D'ni cavern is located:

```javascript
var dd = new DniDate(2500, 7, 21);
var surfaceUtc = dd.toSurfaceDate();
var cavernLocal = new Date(surfaceUtc.getTime() - (7 * 3600000));
```