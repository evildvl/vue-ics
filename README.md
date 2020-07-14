[![npm version](https://badge.fury.io/js/vue-ics.svg)](https://badge.fury.io/js/vue-ics)
[![Total alerts](https://img.shields.io/lgtm/alerts/g/evildvl/vue-ics.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/evildvl/vue-ics/alerts/)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/evildvl/vue-ics.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/evildvl/vue-ics/context:javascript)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

# vue-ics

Vue.js plugin for generating ICalendar (.ics) files.

## Installation

##### NPM

```
npm install vue-ics --save
```

##### Vue

```javascript
import Vue from 'vue'
import ICS from 'vue-ics'

Vue.use(ICS, options)
```

## Initialising options (optional)
{string} uidDomain - Your domain

{string} prodId - Product ID

## Create event

{string} language    - Language in format en-us (default)

{string} subject     - Subject/Title of event

{string} description - Description of event

{string} location    - Location of event

{string} begin       - Beginning date of event

{string} stop        - Ending date of event

{string} url		 - URL (optional)

{object} organizer   - Organizer

  {string} name - Organizer name
  
  {string} email - Organizer email

{RRule}  rrule       - Reccurence rule (optional)

```javascript
this.$ics.addEvent(language, subject, description, location, begin, stop, url, organizer, rrule)
```
You can add one or more events.

## Reccurence rule
You can add recurrence rule for your event. Event will be repeat as you want.
```javascript
const rrule = {
   freq: 'WEEKLY',
   until: until,
   interval: 1
}
```

Parameters:

{string} freq - Required. The frequency of event recurrence. Can be DAILY, WEEKLY, MONTHLY, or YEARLY.

{string | number | Date} until - date stringA date string representing the date on which to end repitition. Must be friendly to Date()

{number} interval - The interval of freq to recur at. For example, if freq is WEEKLY and interval is 2, the event will repeat every 2 weeks

{array} byday - Which days of the week the event is to occur. An array containing any of SU, MO, TU, WE, TH, FR, SA

## Remove all events from the calendar

```javascript
this.$ics.removeAllEvents()
```

## Get calendar with events as string

```javascript
this.$ics.calendar()
```

##Download calendar file

```javascript
this.$ics.download(fileName)
```

{string} fileName - name of file without extension (will be *.ics)
