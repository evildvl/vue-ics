/*!
 * vue-ics v0.1.0 
 * (c) 2019 Stanislav Mihaylov <ceo@pepper.llc>
 * Released under the MIT License.
 */
'use strict';

var fileSaver = require('file-saver');

var version = '0.1.0';
/**
 * Reccurence rule
 * @typedef {Object} RRule
 * @property {string} freq - Required. The frequency of event recurrence. Can be DAILY, WEEKLY, MONTHLY, or YEARLY.
 * @property {string | number | Date} until - date stringA date string representing the date on which to end repitition. Must be friendly to Date()
 * @property {number} interval - The interval of freq to recur at. For example, if freq is WEEKLY and interval is 2, the event will repeat every 2 weeks
 * @property {array} byday - Which days of the week the event is to occur. An array containing any of SU, MO, TU, WE, TH, FR, SA
 */

var Events = [];
/**
 * Reccurence rule validation
 * @function
 * @param {RRule} rrule - Reccurence rule
 * @returns {boolean}
 */

function validateRepeatRule(rrule) {
  var counter = 0;
  var BYDAY_VALUES = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];

  if (rrule.freq !== 'YEARLY' && rrule.freq !== 'MONTHLY' && rrule.freq !== 'WEEKLY' && rrule.freq !== 'DAILY') {
    counter += 1;
    throw "Recurrence rrule frequency must be provided and be one of the following: 'YEARLY', 'MONTHLY', 'WEEKLY', or 'DAILY'";
  }

  if (rrule.until) {
    if (isNaN(Date.parse(rrule.until))) {
      counter += 1;
      throw "Recurrence rrule 'until' must be a valid date string";
    }
  }

  if (rrule.interval) {
    if (isNaN(parseInt(rrule.interval))) {
      counter += 1;
      throw "Recurrence rrule 'interval' must be an integer";
    }
  }

  if (rrule.count) {
    if (isNaN(parseInt(rrule.count))) {
      counter += 1;
      throw "Recurrence rrule 'count' must be an integer";
    }
  }

  if (typeof rrule.byday !== 'undefined') {
    if (Object.prototype.toString.call(rrule.byday) !== '[object Array]') {
      counter += 1;
      throw "Recurrence rrule 'byday' must be an array";
    }

    if (rrule.byday.length > 7) {
      counter += 1;
      throw "Recurrence rrule 'byday' array must not be longer than the 7 days in a week";
    }

    rrule.byday = rrule.byday.filter(function (elem, pos) {
      return rrule.byday.indexOf(elem) == pos;
    });

    for (var d in rrule.byday) {
      if (BYDAY_VALUES.indexOf(rrule.byday[d]) < 0) {
        counter += 1;
        throw "Recurrence rrule 'byday' values must include only the following: 'SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'";
      }
    }
  }

  return counter === 0;
}
/**
 * Helper function for appending CRLF at start and end of file according to RFC rules.
 * @function
 * @param {string} string - iCalendar source string
 * @return {string}
 */


function addCRLF(string) {
  return "\n".concat(string, "\n");
}

var install = function install(Vue) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
    uidDomain: 'evildvl',
    prodId: 'vueICS'
  };
  Vue.prototype.$ics = {
    /**
     * Add event to the calendar
     * @function
     * @param  {string} language    Language in format en-us (default)
     * @param  {string} subject     Subject/Title of event
     * @param  {string} description Description of event
     * @param  {string} location    Location of event
     * @param  {string} begin       Beginning date of event
     * @param  {string} stop        Ending date of event
     * @param  {RRule}  rrule       Reccurence rule
     * @returns {string} event
     **/
    addEvent: function addEvent() {
      var language = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'en-us';
      var subject = arguments.length > 1 ? arguments[1] : undefined;
      var description = arguments.length > 2 ? arguments[2] : undefined;
      var location = arguments.length > 3 ? arguments[3] : undefined;
      var begin = arguments.length > 4 ? arguments[4] : undefined;
      var stop = arguments.length > 5 ? arguments[5] : undefined;
      var rrule = arguments.length > 6 ? arguments[6] : undefined;
      var rruleString;

      if (typeof subject === 'undefined' || typeof description === 'undefined' || typeof location === 'undefined' || typeof begin === 'undefined' || typeof stop === 'undefined') {
        throw 'You need to specify function arguments';
      }

      if (rrule && validateRepeatRule(rrule)) {
        rruleString = "RRULE:FREQ=".concat(rrule.freq);

        if (rrule.until) {
          var untilDate = new Date(Date.parse(rrule.until)).toISOString();
          rruleString += ";UNTIL=".concat(untilDate.substring(0, untilDate.length - 13).replace(/[-]/g, ''), "000000Z");
        }

        if (rrule.interval) rruleString += ";INTERVAL=".concat(rrule.interval);
        if (rrule.count) rruleString += ";COUNT=".concat(rrule.count);
        if (rrule.byday && rrule.byday.length > 0) rruleString += ";BYDAY=".concat(rrule.byday.join(','));
      }

      var start_date = new Date(begin);
      var end_date = new Date(stop);
      var now_date = new Date();
      var UID = "".concat(now_date.getDay()).concat(now_date.getMonth()).concat(now_date.getFullYear(), "-").concat(now_date.getHours()).concat(now_date.getMinutes()).concat(now_date.getSeconds());
      var start_year = "0000".concat(start_date.getFullYear().toString()).slice(-4);
      var start_month = "00".concat((start_date.getMonth() + 1).toString()).slice(-2);
      var start_day = "00".concat(start_date.getDate().toString()).slice(-2);
      var start_hours = "00".concat(start_date.getHours().toString()).slice(-2);
      var start_minutes = "00".concat(start_date.getMinutes().toString()).slice(-2);
      var start_seconds = "00".concat(start_date.getSeconds().toString()).slice(-2);
      var end_year = "0000".concat(end_date.getFullYear().toString()).slice(-4);
      var end_month = "00".concat((end_date.getMonth() + 1).toString()).slice(-2);
      var end_day = "00".concat(end_date.getDate().toString()).slice(-2);
      var end_hours = "00".concat(end_date.getHours().toString()).slice(-2);
      var end_minutes = "00".concat(end_date.getMinutes().toString()).slice(-2);
      var end_seconds = "00".concat(end_date.getSeconds().toString()).slice(-2);
      var now_year = "0000".concat(now_date.getFullYear().toString()).slice(-4);
      var now_month = "00".concat((now_date.getMonth() + 1).toString()).slice(-2);
      var now_day = "00".concat(now_date.getDate().toString()).slice(-2);
      var now_hours = "00".concat(now_date.getHours().toString()).slice(-2);
      var now_minutes = "00".concat(now_date.getMinutes().toString()).slice(-2);
      var now_seconds = "00".concat(now_date.getSeconds().toString()).slice(-2);
      var start_time = '';
      var end_time = '';

      if (start_hours + start_minutes + start_seconds + end_hours + end_minutes + end_seconds != 0) {
        start_time = "T".concat(start_hours).concat(start_minutes).concat(start_seconds);
        end_time = "T".concat(end_hours).concat(end_minutes).concat(end_seconds);
      }

      var now_time = "T".concat(now_hours).concat(now_minutes).concat(now_seconds);
      var start = start_year + start_month + start_day + start_time;
      var end = end_year + end_month + end_day + end_time;
      var now = now_year + now_month + now_day + now_time;
      var Event = "\n    BEGIN:VEVENT\n    UID:".concat(UID, "@").concat(options.uidDomain, "\n    DESCRIPTION:").concat(description).concat(rruleString ? '\n' + rruleString : '', "\n    DTSTAMP;VALUE=DATE-TIME:").concat(now, ",\n    DTSTART;VALUE=DATE-TIME:").concat(start, "\n    DTEND;VALUE=DATE-TIME:").concat(end, "\n    LOCATION:").concat(location, "\n    SUMMARY;LANGUAGE=").concat(language, ":").concat(subject, "\n    END:VEVENT\n      ");
      Events.push(Event);
      return Event;
    },

    /**
     * Returns calendar
     * @function
     * @return {string} Calendar in iCalendar format
     */
    calendar: function calendar() {
      return addCRLF("\n    BEGIN:VCALENDAR\n    PRODID:".concat(options.prodId, "\n    VERSION:2.0\n    ").concat(Events.join('\n'), "\n    END:VCALENDAR\n      \n      ").replace(/^\s*[\r\n]/gm, "").replace(/^\s+/gm, ''));
    },

    /**
     * Download iCalendar file
     * @function
     * @param {string} filename  - Name of the file without extension
     */
    download: function download(filename) {
      var Calendar = addCRLF("\n    BEGIN:VCALENDAR\n    PRODID:".concat(options.prodId, "\n    VERSION:2.0\n    ").concat(Events.join('\n'), "\n    END:VCALENDAR\n      \n      ").replace(/^\s*[\r\n]/gm, "").replace(/^\s+/gm, ''));
      var blob = new Blob([Calendar], {
        type: "text/x-vCalendar;charset=utf-8"
      });
      fileSaver.saveAs(blob, "".concat(filename, ".ics"));
    }
  };
};

var plugin = {
  install: install,
  version: version
};

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(plugin);
}

module.exports = plugin;
