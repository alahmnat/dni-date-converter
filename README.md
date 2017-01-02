# dni-date-converter

The D'ni Date Converter is a JavaScript implementation of the D'ni↔Gregorian calendar conversion algorithms originally developed by Brett Middleton. Details about the algorithms themselves can be found [here](https://archive.guildofarchivists.org/wiki/D%27ni_time_conversion).

This project contains both the converter and a website which can be used to convert arbitrary dates between the two calendar systems. To use the date converter in your own project, you should only need the DniDate object's declaration, which is in `js/DniDate.js`. 

## DniDate() Object

This object is modeled on the native JavaScript `Date()` object, and supports manipulation of dates in the D'ni calendar, just as the `Date()` object supports manipulating dates in the Gregorian calendar.

### Creating a new date

You can create a new `DniDate()` in one of three ways.

#### Supply a D'ni date

```javascript
var dd = new DniDate(hahr, vailee, yahr, gartahvo, tahvo, gorahn, prorahn);
```

#### Call `DniDate.now()`

```javascript
var dd = DniDate.now();
```

#### Create from Gregorian date

Generate a new `DniDate()`, then pass a `Date()` object into the `setFromSurfaceDate()` method: 

```javascript
var dd = new DniDate();
dd.setFromSurfaceDate(surfaceDate);
```

**NOTE:** If you create a Gregorian date between 1 CE and 99 CE (1 - 99) by calling `new Date(year, month, day)`, the `Date()` object will "helpfully" set your date in the 20th century (1901 - 1999). To avoid this, create the `Date()` object, then call `setFullYear()` with your desired year before passing it into `DniDate()`.

### Converting dates

#### "Surface" (Gregorian) date to D'ni

Follow the instructions above, under "Create from Gregorian date".

#### D'ni date to Gregorian date

Create a `DniDate()` object with the desired D'ni date, then call `toSurfaceDate()`. This will return a new `Date()` object set to the equivalent date in the Gregorian calendar.

### Modifying the date

You can use one of the `setX` methods to alter a particular component of the D'ni date once it has been created. There are set methods for the following date components:

* Hahr
* Vailee (0-indexed)
* Yahr
* Gartahvo
* Tahvo
* Gorahn
* Prorahn

If you supply a value for a date component that is out of range (such as calling `setVailee(10)` when the valid range is 0 through 9), a valid date will automatically be calculated. In this case, `hahr` will be incremented by 1, and `vailee` will be set to 0.

You many notice that there is a `getPartahvo()`, method, but no `setPartahvo()` method. This is because `DniDate()` treats the partahvo as a calculated unit, rather than a specified one. The value of the partahvo in a given date is determined by dividing the number of tahvotee by 5, then rounding down.

### Retrieving / formatting D'ni dates

There are three built-in methods for displaying a D'ni date:

1. `toDateString()`: Returns the vailee, yahr, and hahr (month, day, year), as well as the era (BE or DE).
2. `toTimeString()`: Returns the gartahvo, tahvo, gorahn, and prorahn, separated by colons. The tahvo, gorahn, and prorahn values are zero-padded to two digits in this output for better legibility.
3. `toString()`: Returns both of the above values, concatenated together by a space.

Alternatively, you can build your own date format using the following getters:

* `getHahr()`
* `getVailee()` (returns a value between 0 and 9 representing the numerical vailee value)
* `getVaileeName()` (returns the actual vailee name, written in [OTS](https://archive.guildofarchivists.org/wiki/D%27ni_(language)#Old_Transliteration_Standard)).
* `getYahr()`
* `getGartahvo()`
* `getPartahvo()` (not commonly used; this value divides the D'ni yahr into 5 segments, rather than the tahvo's 25)
* `getTahvo()`
* `getGorahn()`
* `getProrahn()`