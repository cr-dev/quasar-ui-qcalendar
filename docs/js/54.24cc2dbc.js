(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[54],{c37b:function(e,n,t){"use strict";t.r(n),n["default"]='<template>\n  <div style="max-width: 800px; width: 100%; overflow: auto; ">\n    <q-calendar\n      v-model="selectedDate"\n      view="month"\n      :disabled-before="disabledBefore"\n      :disabled-after="disabledAfter"\n      :day-style="modifiedStyle"\n      locale="en-us"\n    />\n  </div>\n</template>\n\n<script>\nimport {\n  parseDate,\n  parseTimestamp,\n  addToDate,\n  daysInMonth\n} from \'ui\' // ui is aliased from \'@quasar/quasar-ui-qcalendar\'\nconst CURRENT_DAY = new Date()\n\nfunction getCurrentDay (day) {\n  const newDay = new Date(CURRENT_DAY)\n  newDay.setDate(day)\n  const tm = parseDate(newDay)\n  return tm.date\n}\n\nexport default {\n  data () {\n    return {\n      selectedDate: \'2019-04-01\'\n    }\n  },\n  beforeMount () {\n    // set to today\'s date\n    this.selectedDate = getCurrentDay(CURRENT_DAY.getDate())\n  },\n  computed: {\n    disabledBefore () {\n      // find the last day of the previous month\n      if (this.selectedDate) {\n        let ts = parseTimestamp(this.selectedDate)\n        ts = addToDate(ts, { day: -ts.day })\n        return ts.date\n      }\n      return void 0\n    },\n\n    disabledAfter () {\n      // find the 1st day of the next month\n      if (this.selectedDate) {\n        let ts = parseTimestamp(this.selectedDate)\n        // get days in month\n        const days = daysInMonth(ts.year, ts.month)\n        ts = addToDate(ts, { day: (days - ts.day) })\n        return ts.date\n      }\n      return void 0\n    }\n  },\n  methods: {\n    modifiedStyle (scope) {\n      if (scope.disabled === true) {\n        return {\n          backgroundColor: \'#ffcb9c!important\',\n          cursor: \'not-allowed\'\n        }\n      }\n      return {}\n    }\n  }\n}\n<\/script>\n'}}]);