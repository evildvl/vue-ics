import { saveAs } from 'file-saver'
const version = '__VERSION__'

//TODO: add members https://www.kanzaki.com/docs/ical/member.html

/**
 * Reccurence rule
 * @typedef {Object} RRule
 * @property {string} freq - Required. The frequency of event recurrence. Can be DAILY, WEEKLY, MONTHLY, or YEARLY.
 * @property {string | number | Date} until - date stringA date string representing the date on which to end repitition. Must be friendly to Date()
 * @property {number} interval - The interval of freq to recur at. For example, if freq is WEEKLY and interval is 2, the event will repeat every 2 weeks
 * @property {array} byday - Which days of the week the event is to occur. An array containing any of SU, MO, TU, WE, TH, FR, SA
 */

var Events = []

/**
 * Reccurence rule validation
 * @function
 * @param {RRule} rrule - Reccurence rule
 * @returns {boolean}
 */
function validateRepeatRule(rrule) {
  let counter = 0
  const BYDAY_VALUES = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA']
  if (rrule.freq !== 'YEARLY' && rrule.freq !== 'MONTHLY' && rrule.freq !== 'WEEKLY' && rrule.freq !== 'DAILY') {
    counter += 1
    throw "Recurrence rrule frequency must be provided and be one of the following: 'YEARLY', 'MONTHLY', 'WEEKLY', or 'DAILY'";
  }

  if (rrule.until) {
    if (isNaN(Date.parse(rrule.until))) {
      counter += 1
      throw "Recurrence rrule 'until' must be a valid date string";
    }
  }

  if (rrule.interval) {
    if (isNaN(parseInt(rrule.interval))) {
      counter += 1
      throw "Recurrence rrule 'interval' must be an integer";
    }
  }

  if (rrule.count) {
    if (isNaN(parseInt(rrule.count))) {
      counter += 1
      throw "Recurrence rrule 'count' must be an integer";
    }
  }

  if (typeof rrule.byday !== 'undefined') {
    if ((Object.prototype.toString.call(rrule.byday) !== '[object Array]')) {
      counter += 1
      throw "Recurrence rrule 'byday' must be an array";
    }

    if (rrule.byday.length > 7) {
      counter += 1
      throw "Recurrence rrule 'byday' array must not be longer than the 7 days in a week";
    }

    rrule.byday = rrule.byday.filter(function (elem, pos) {
      return rrule.byday.indexOf(elem) == pos;
    });

    for (var d in rrule.byday) {
      if (BYDAY_VALUES.indexOf(rrule.byday[d]) < 0) {
        counter += 1
        throw "Recurrence rrule 'byday' values must include only the following: 'SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'";
      }
    }
  }
  return (counter === 0)
}

/**
 * Helper function for appending CRLF at start and end of file according to RFC rules.
 * @function
 * @param {string} string - iCalendar source string
 * @return {string}
 */
function addCRLF(string) {
  return `\n${string}\n`
}

const install = (Vue, options = {uidDomain: 'evildvl', prodId: 'vueICS'}) => {
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
     * @param  {string} url			    URL
     * @param  {object} organizer   Organizer
     * @param  {RRule}  rrule       Reccurence rule
     * @returns {string} event
     **/
    addEvent: (language = 'en-us', subject, description, location = 'none', begin, stop, url = null, organizer = null, rrule = null) => {
      let rruleString

      if (typeof subject === 'undefined' ||
          typeof description === 'undefined' ||
          typeof location === 'undefined' ||
          typeof begin === 'undefined' ||
          typeof stop === 'undefined') {
            throw 'You need to specify function arguments'
      }
      if (rrule && validateRepeatRule(rrule)) {
        rruleString = `RRULE:FREQ=${rrule.freq}`
        if (rrule.until) {
          let untilDate = new Date(Date.parse(rrule.until)).toISOString();
          rruleString += `;UNTIL=${untilDate.substring(0, untilDate.length - 13).replace(/[-]/g, '')}000000Z`
        }
        if (rrule.interval) rruleString += `;INTERVAL=${rrule.interval}`
        if (rrule.count) rruleString += `;COUNT=${rrule.count}`
        if (rrule.byday && rrule.byday.length > 0) rruleString += `;BYDAY=${rrule.byday.join(',')}`
      }

      let start_date = new Date(begin);
      let end_date = new Date(stop);
      let now_date = new Date();
      const UID = `${now_date.getDay()}${now_date.getMonth()}${now_date.getFullYear()}-${now_date.getHours()}${now_date.getMinutes()}${now_date.getSeconds()}`

      let start_year = (`0000${(start_date.getFullYear().toString())}`).slice(-4)
      let start_month = (`00${((start_date.getMonth() + 1).toString())}`).slice(-2)
      let start_day = (`00${((start_date.getDate()).toString())}`).slice(-2)
      let start_hours = (`00${(start_date.getHours().toString())}`).slice(-2)
      let start_minutes = (`00${(start_date.getMinutes().toString())}`).slice(-2)
      let start_seconds = (`00${(start_date.getSeconds().toString())}`).slice(-2)

      let end_year = (`0000${(end_date.getFullYear().toString())}`).slice(-4)
      let end_month = (`00${((end_date.getMonth() + 1).toString())}`).slice(-2)
      let end_day = (`00${((end_date.getDate()).toString())}`).slice(-2)
      let end_hours = (`00${(end_date.getHours().toString())}`).slice(-2)
      let end_minutes = (`00${(end_date.getMinutes().toString())}`).slice(-2)
      let end_seconds = (`00${(end_date.getSeconds().toString())}`).slice(-2)

      let now_year = (`0000${(now_date.getFullYear().toString())}`).slice(-4)
      let now_month = (`00${((now_date.getMonth() + 1).toString())}`).slice(-2)
      let now_day = (`00${((now_date.getDate()).toString())}`).slice(-2)
      let now_hours = (`00${(now_date.getHours().toString())}`).slice(-2)
      let now_minutes = (`00${(now_date.getMinutes().toString())}`).slice(-2)
      let now_seconds = (`00${(now_date.getSeconds().toString())}`).slice(-2)

      let start_time = '';
      let end_time = '';
      if (start_hours + start_minutes + start_seconds + end_hours + end_minutes + end_seconds != 0) {
        start_time = `T${start_hours}${start_minutes}${start_seconds}`
        end_time = `T${end_hours}${end_minutes}${end_seconds}`
      }
      let now_time = `T${now_hours}${now_minutes}${now_seconds}`

      let start = start_year + start_month + start_day + start_time
      let end = end_year + end_month + end_day + end_time
      let now = now_year + now_month + now_day + now_time

      const Event = `
    BEGIN:VEVENT
    UID:${UID}@${options.uidDomain}
    ${(url) ? 'URL:' + url : ''}
    DESCRIPTION:${description}${(rruleString) ? '\n' + rruleString : ''}
    DTSTAMP;VALUE=DATE-TIME:${now},
    DTSTART;VALUE=DATE-TIME:${start}
    DTEND;VALUE=DATE-TIME:${end}
    LOCATION:${location}
    ${(organizer) ? 'ORGANIZER;CN=' + organizer.name + ':MAILTO:' + organizer.email : ''}
    SUMMARY;LANGUAGE=${language}:${subject}
    END:VEVENT
      `
      Events.push(Event)
      return Event
    },
    /**
     * Returns calendar
     * @function
     * @return {string} Calendar in iCalendar format
     */
    calendar: () => {
      return addCRLF(`
    BEGIN:VCALENDAR
    PRODID:${options.prodId}
    VERSION:2.0
    ${Events.join('\n')}
    END:VCALENDAR
      
      `.replace(/^\s*[\r\n]/gm, "").replace(/^\s+/gm, ''))
    },
    /**
     * Download iCalendar file
     * @function
     * @param {string} filename  - Name of the file without extension
     */
    download: (filename) => {
      const Calendar = addCRLF(`
    BEGIN:VCALENDAR
    PRODID:${options.prodId}
    VERSION:2.0
    ${Events.join('\n')}
    END:VCALENDAR
      
      `.replace(/^\s*[\r\n]/gm, "").replace(/^\s+/gm, ''))
      var blob = new Blob([Calendar], {type: "text/x-vCalendar;charset=utf-8"});
      saveAs(blob, `${filename}.ics`);
    }

  }
}

const plugin = {
  install,
  version
}

export default plugin

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(plugin)
}
