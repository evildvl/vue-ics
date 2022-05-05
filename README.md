[![Awesome](https://cdn.rawgit.com/sindresorhus/awesome/d7305f38d29fed78fa85652e3a63e154dd8e8829/media/badge.svg)](https://github.com/sindresorhus/awesome)
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

Vue.use(ICS, { options })
```

## Global options (optional)
{ `uidDomain`: *string*, `prodId`: *string* }

`uidDomain` – Your domain

`prodId` - Product ID

## Initializing
You can add one or more events.

```javascript
this.$ics.addEvent(language, subject, description, location, begin, stop, url, organizer, rrule)
```

### Parameters

`language` *string* - Language in format en-us (default)

`subject` *string* - Subject/Title of event

`description` *string* - Description of event

`location` *string* - Location of event

 `begin` *string | Date* - Beginning date of event. Date must match `Date()` format.
 
 `stop` *string | Date* - Ending date of event. Date must match `Date()` format. Note: make sure to provide an ending date to display event correctly in a calendar

`url` *string* - URL (optional)

`organizer` *object* { `name`: *string*, `email`: *string* }
 
`name` – Name of organizer
 
`email` – E-mail of organizer

`rrule` *object* - Reccurence rule (optional)


## Reccurence rule
You can add a recurrence rule for your event. Event will be repeated as often as you want.

```javascript
const rrule = {
   freq: 'WEEKLY',
   until: until,
   interval: 1
}
```

### Parameters

`freq` *string* - Required. The frequency of event recurrence. Can be DAILY, WEEKLY, MONTHLY, or YEARLY.

`until` *string | number | Date* - A date string representing the date on which to end repetition. Date must match `Date() format.

`interval` *number* - The interval of freq to recurr at. For example, if freq is `WEEKLY` and interval is `2`, the event will repeat every 2 weeks

`byday` *array* - Which days of the week the event is to occur. An array containing any of SU, MO, TU, WE, TH, FR, SA

## Remove all events from the calendar

```javascript
this.$ics.removeAllEvents()
```

## Get calendar with events as string

```javascript
this.$ics.calendar()
```

## Download calendar file

```javascript
this.$ics.download(fileName)
```

`fileName` *string* - name of file without extension (will be *.ics)
