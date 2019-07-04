# Installation

## Direct Download / CDN

https://unpkg.com/vue-ics/dist/vue-ics 

[unpkg.com](https://unpkg.com) provides NPM-based CDN links. The above link will always point to the latest release on NPM. You can also use a specific version/tag via URLs like https://unpkg.com/vue-ics@{{ $version }}/dist/vue-ics.js
 
Include vue-ics after Vue and it will install itself automatically:

```html
<script src="https://unpkg.com/vue/dist/vue.js"></script>
<script src="https://unpkg.com/vue-ics/dist/vue-ics.js"></script>
```

## NPM

```sh
$ npm install vue-ics
```

## Yarn

```sh
$ yarn add vue-ics
```

When used with a module system, you must explicitly install the `vue-ics` via `Vue.use()`:

```javascript
import Vue from 'vue'
import vue-ics from 'vue-ics'

Vue.use(vue-ics)
```

You don't need to do this when using global script tags.

## Dev Build

You will have to clone directly from GitHub and build `vue-ics` yourself if
you want to use the latest dev build.

```sh
$ git clone https://github.com//vue-ics.git node_modules/vue-ics
$ cd node_modules/vue-ics
$ npm install
$ npm run build
```

