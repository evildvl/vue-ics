# vue-ics

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
{string} `uidDomain` - Your domain

{string} `prodId` - Product ID

## Create event

{string} `language`    - Language in format en-us (default)

{string} `subject`     - Subject/Title of event

{string} `description` - Description of event

{string} `location`    - Location of event

{string} `begin`       - Beginning date of event

{string} `stop`        - Ending date of event

{string} `url`		 - URL (optional)

{object} `organizer`  - Organizer

```javascript
organizer = {
  name: 'John Smith'
  email: 'test@example.com'
}
```

{RRule}  `rrule`       - Reccurence rule (optional)

```javascript
this.$ics.addEvent(language, subject, description, location, begin, stop, url, rrule)
```
Example:
```javascript
let now = new Date()
let start = new Date(now.getFullYear(), now.getMonth() + 1, now.getDay(), now.getHours(), now.getMinutes(), 0, 0)
let end = new Date(now.getFullYear(), now.getMonth() + 1, now.getDay(), now.getHours() + 1, now.getMinutes(), 0, 0)

this.$ics.addEvent('en-us', 'Test event subject', 'Test event description', 'online', start, end, "http://test.com")    
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

{string} `freq` - Required. The frequency of event recurrence. Can be `DAILY`, `WEEKLY,` `MONTHLY`, or `YEARLY.`

{string | number | Date} `until` - A date string representing the date on which to end repitition. Must be friendly to `Date()`

{number} `interval` - The interval of freq to recur at. For example, if freq is WEEKLY and interval is 2, the event will repeat every 2 weeks

{array} `byday` - Which days of the week the event is to occur. An array containing any of `SU`, `MO`, `TU`, `WE`, `TH`, `FR`, `SA`

## Get calendar with events as string

```javascript
this.$ics.calendar()
```

##Download calendar file

```javascript
this.$ics.download(fileName)
```

{string} `fileName` - name of file without extension (will be *.ics)