<template>
  <div class="demo">
    <h1>Plugin Demo</h1>
    <pre>{{ cal }}</pre>
    <a @click="save()">Download</a>
  </div>
</template>
<script>
export default {
  name: 'demo',
  data() {
    return {
      cal: ''
    }
  },
  methods: {
    save() {
      this.$ics.download('test_event')
    }
  },
  mounted() {
    let now = new Date()
    let start = new Date(now.getFullYear(), now.getMonth() + 1, now.getDay(), now.getHours(), now.getMinutes(), 0, 0)
    let end = new Date(now.getFullYear(), now.getMonth() + 1, now.getDay(), now.getHours() + 1, now.getMinutes(), 0, 0)
    let until = new Date(now.getFullYear(), now.getMonth() + 2, now.getDay(), now.getHours(), now.getMinutes(), 0, 0)
    /**
     * @type {RRule}
     */
    let rrule = {
      freq: 'WEEKLY',
      until: until,
      interval: 1
    }
    this.$ics.addEvent('ru-ru', 'Test event subject', 'Test event description', 'online', start, end, "http://test.com" ,rrule)
    this.cal = this.$ics.calendar()
  }
}
</script>
<style>
  #app {
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
    margin-bottom: 60px;
  }
  pre {
    text-align: left;
  }
  a {
    border: 1px solid black;
    border-radius: 5px;
    color: black;
    text-decoration: none;
    cursor: pointer;
    padding: .5rem 1rem;
  }
  a:hover {
    border-color: blueviolet;
    color: blueviolet;
  }
</style>