/*!
 * D'niDate 1.0
 * Copyright 2016 Gary Buddell
 * Formulas provided by Brett Middleton: https://archive.guildofarchivists.org/wiki/D'ni_time_conversion
 * Based on the D'ni time system developed by Richard Watson and Cyan, Inc.
 * Licensed under the MIT license
 */
function DniDate(hahr, vailee, yahr, gartahvo, tahvo, gorahn, prorahn) {
    var hahr = hahr;
    var vailee = vailee;
    var yahr = yahr;
    var gartahvo = gartahvo;
    var tahvo = tahvo;
    var gorahn = gorahn;
    var prorahn = prorahn;

    function adjust() {
        while (this.prorahn > 25) {
            this.prorahn = this.prorahn - 25;
            this.gorahn = this.gorahn + 1;
        }
        while (this.prorahn < 0) {
            this.prorahn = this.prorahn + 25;
            this.gorahn = this.gorahn - 1;
        }

        while (this.gorahn > 25) {
            this.gorahn = this.gorahn - 25;
            this.tahvo = this.tahvo + 1;
        }
        while (this.gorahn < 0) {
            this.gorahn = this.gorahn + 25;
            this.tahvo = this.tahvo - 1;
        }

        while (this.tahvo > 25) {
            this.tahvo = this.tahvo - 25;
            this.gartahvo = this.gartahvo + 1;
        }
        while (this.tahvo < 0) {
            this.tahvo = this.tahvo + 25;
            this.gartahvo = this.gartahvo - 1;
        }

        while (this.gartahvo > 5) {
            this.gartahvo = this.gartahvo - 25;
            this.yahr = this.yahr + 1;
        }
        while (this.gartahvo < 0) {
            this.gartahvo = this.gartahvo + 5;
            this.yahr = this.yahr - 1;
        }

        while (this.yahr > 29) {
            this.yahr = this.yahr - 29;
            this.vailee = this.vailee + 1;
        }
        while (this.yahr < 0) {
            this.yahr = this.yahr + 29;
            this.vailee = this.vailee - 1;
        }

        while (this.vailee > 9) {
            this.vailee = this.vailee - 10;
            this.hahr = this.hahr + 1;
        }
        while (this.vailee < 0) {
            this.vailee = this.vailee + 10;
            this.hahr = this.hahr - 1;
        }
    }

    function julianDayNumberToGregorianDate(jdn) {
        var z = Math.floor(jdn);
        var g = z - 0.25;
        var a = Math.floor(g / 36524.25);
        var b = a - (0.25 * a);
        var year = Math.floor((g + b) / 365.25);
        var c = z + b - Math.floor(365.25 * year);
        var month = ~~(((5 * c) + 456) / 153);
        var day = Math.ceil(c - ~~(((153 * month) - 457) / 5));

        if (month > 12) {
            year = year + 1;
            month = month - 12;
        }

        if (year < 1) {
            year = year - 1;
        }

        z = (jdn - Math.floor(jdn)) * 86400;
        var hour = ~~(z / 3600);
        var r = z - (hour * 3600);
        var minute = ~~(r / 60);
        var second = Math.ceil(r - (minute * 60));

        var surfaceDate = new Date(Date.UTC(year, month - 1, day, hour + 7, minute, second));
        surfaceDate.setFullYear(year);
        
        return surfaceDate;
    }

    function gregorianDateToJulianDayNumber(gDate) {
        gDate.setHours(gDate.getUTCHours() - 7);
        var year = gDate.getUTCFullYear();
        var month = gDate.getUTCMonth() + 1; // The DniDate output's month may be 0-indexed, but the math isn't
        var day = gDate.getUTCDate();
        var hour = gDate.getHours();
        var minute = gDate.getUTCMinutes();
        var second = gDate.getUTCSeconds();

        if (month < 3) {
            month = month + 12;
            year = year - 1;
        }

        var wholeDays = day + parseFloat(~~(((153 * month) - 457) / 5)) + parseFloat(Math.floor(365.25 * year)) - parseFloat(Math.floor(0.01 * year)) + parseFloat(Math.floor(0.0025 * year));

        var partialDays = ((hour * 3600) + (minute * 60) + second) / 86400;

        return wholeDays + partialDays;
    }

    function setAtrianDayNumberToCavernDate(adn) {
        var z = parseFloat(Math.floor(adn));
        var g = z - 0.25;
        var a = parseFloat(Math.floor(g / 290));
        hahr = 9647 + a;
        var c = z - (a * 290);
        vailee = parseFloat(Math.floor((c - 0.25) / 29)) + 1;
        yahr = c - ((vailee - 1) * 29);

        z = (adn - Math.floor(adn)) * 78125;
        gartahvo = ~~(z / 15625);
        var r = z - (gartahvo * 15625);
        tahvo = ~~(r / 625);
        r = r - (tahvo * 625);
        gorahn = ~~(r / 25);
        prorahn = Math.floor(r - (gorahn * 25));
        
        vailee = vailee - 1;
    }

    function cavernDateToAtrianDayNumber() {
        var wholeDays = parseInt(yahr) + (vailee * 29) + ((hahr - 9647) * 290);
        
        var partialDays = ((gartahvo * 15625) + (tahvo * 625) + (gorahn * 25) + prorahn) / 78125;

        return wholeDays + partialDays;
    }

    this.getHahr = function () {
        return hahr;
    }
    this.setHahr = function (h) {
        hahr = h;
        adjust();
    }

    this.getVailee = function () {
        return vailee;
    }
    this.setVailee = function (v) {
        vailee = v;
        adjust();
    }

    this.getYahr = function () {
        return yahr;
    }
    this.setYahr = function (y) {
        yahr = y;
        adjust();
    }

    this.getGartahvo = function () {
        return gartahvo;
    }
    this.setGartahvo = function (g) {
        gartahvo = g;
        adjust();
    }

    this.getPartahvo = function () {
        return Math.floor(tahvo / 5);
    }

    this.getTahvo = function () {
        return tahvo;
    }
    this.setTahvo = function (t) {
        tahvo = t;
        adjust();
    }

    this.getGorahn = function () {
        return gorahn;
    }
    this.setGorahn = function (g) {
        gorahn = g;
        adjust();
    }

    this.getProrahn = function () {
        return prorahn;
    }
    this.setProrahn = function (p) {
        prorahn = p;
        adjust();
    }

    this.toString = function () {
        return this.toDateString() + " " + this.toTimeString();
    }

    this.toDateString = function () {
        if (hahr < 0) {
            return this.getVaileeName() + " " + yahr + " " + (hahr * -1) + " BE";
        }
        else {
            return this.getVaileeName() + " " + yahr + " " + hahr + " DE";
        }
    }

    this.toTimeString = function () {
        return gartahvo + ":" + tahvo.pad(2) + ":" + gorahn.pad(2) + ":" + prorahn.pad(2);
    }

    this.getVaileeName = function () {
        switch (vailee) {
            case 0:
                return "Leefo";
            case 1:
                return "Leebro";
            case 2:
                return "Leesahn";
            case 3:
                return "Leetar";
            case 4:
                return "Leevot";
            case 5:
                return "Leevofo";
            case 6:
                return "Leevobro";
            case 7:
                return "Leevosahn";
            case 8:
                return "Leevotar";
            case 9:
                return "Leenovoo";
        }
    }

    this.setFromSurfaceDate = function (surface) {
        var jdn = gregorianDateToJulianDayNumber(surface);
        var jdd = jdn - 727249.745833333;
        var add = jdd * 0.793993705929756;

        var adn = add + 1;

        setAtrianDayNumberToCavernDate(adn);
    }

    this.toSurfaceDate = function () {
        var adn = cavernDateToAtrianDayNumber();
        var add = adn - 1;

        var jdd = add * 1.25945582758621;
        var jdn = jdd + 727249.745833333;

        return julianDayNumberToGregorianDate(jdn);
    }
    
    if(arguments.length === 0) {
	    this.setFromSurfaceDate(new Date());
    } else {
	    if(vailee === undefined) {
		    vailee = 0;
	    }
	    if(yahr === undefined) {
		    yahr = 1;
	    }
	    if(gartahvo === undefined) {
		    gartahvo = 0;
	    }
	    if(tahvo === undefined) {
		    tahvo = 0;
	    }
	    if(gorahn === undefined) {
		    gorahn = 0;
	    }
	    if(prorahn === undefined) {
		    prorahn = 0;
	    }
    }

    adjust();
}

Number.prototype.pad = function(size) {
	var s = String(this);
	while (s.length < (size || 1)) {s = "0" + s;}
	return s;
}