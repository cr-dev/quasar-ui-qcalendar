<template>
  <q-calendar
    v-model="selectedDate"
    view="day"
    locale="en-us"
    style="height: 400px;"
    class="calendar-container"
  >
    <template #day-header="{ date }">
      <div class="row justify-center">
        <template v-for="(event, index) in eventsMap[date]">
          <q-badge
            v-if="!event.time"
            :key="index"
            style="width: 100%; cursor: pointer;"
            :class="badgeClasses(event, 'header')"
            :style="badgeStyles(event, 'header')"
          >
            <q-icon v-if="event.icon" :name="event.icon" class="q-mr-xs"></q-icon><span class="ellipsis">{{ event.title }}</span>
          </q-badge>
          <q-badge
            v-else
            :key="index"
            class="q-ma-xs"
            :class="badgeClasses(event, 'header')"
            :style="badgeStyles(event, 'header')"
            style="width: 10px; max-width: 10px; height: 10px; max-height: 10px"
          />
        </template>
      </div>
    </template>

    <template #day-body="{ date, timeStartPos, timeDurationHeight }">
      <template v-for="(event, index) in getEvents(date)">
        <q-badge
          v-if="event.time"
          :key="index"
          class="my-event justify-center ellipsis"
          :class="badgeClasses(event, 'body')"
          :style="badgeStyles(event, 'body', timeStartPos, timeDurationHeight)"
        >
          <q-icon v-if="event.icon" :name="event.icon" class="q-mr-xs"></q-icon><span class="ellipsis">{{ event.title }}</span>
        </q-badge>
      </template>
    </template>
  </q-calendar>
</template>

<script>
import { date, colors } from 'quasar'

import {
  parseDate,
  makeDateTime,
  parsed
} from 'ui' // ui is aliased from '@quasar/quasar-ui-qcalendar'

const CURRENT_DAY = new Date()

function getCurrentDay (day) {
  const newDay = new Date(CURRENT_DAY)
  newDay.setDate(day)
  const tm = parseDate(newDay)
  return tm.date
}

export default {
  data () {
    return {
      selectedDate: '',
      events: [
        {
          title: '1st of the Month',
          details: 'Everything is funny as long as it is happening to someone else',
          date: getCurrentDay(1),
          bgcolor: 'orange'
        },
        {
          title: 'Sisters Birthday',
          details: 'Buy a nice present',
          date: getCurrentDay(4),
          bgcolor: 'green',
          icon: 'fas fa-birthday-cake'
        },
        {
          title: 'Meeting',
          details: 'Time to pitch my idea to the company',
          date: getCurrentDay(CURRENT_DAY.getDate()),
          time: '10:00',
          duration: 120,
          bgcolor: 'red',
          icon: 'fas fa-handshake'
        },
        {
          title: 'Lunch',
          details: 'Company is paying!',
          date: getCurrentDay(CURRENT_DAY.getDate()),
          time: '11:30',
          duration: 90,
          bgcolor: 'teal',
          icon: 'fas fa-hamburger'
        },
        {
          title: 'Visit mom',
          details: 'Always a nice chat with mom',
          date: getCurrentDay(20),
          time: '17:00',
          duration: 90,
          bgcolor: 'blue-grey',
          icon: 'fas fa-car'
        },
        {
          title: 'Conference',
          details: 'Teaching Javascript 101',
          date: getCurrentDay(22),
          time: '08:00',
          duration: 540,
          bgcolor: 'blue',
          icon: 'fas fa-chalkboard-teacher'
        },
        {
          title: 'Girlfriend',
          details: 'Meet GF for dinner at Swanky Restaurant',
          date: getCurrentDay(22),
          time: '19:00',
          duration: 180,
          bgcolor: 'teal',
          icon: 'fas fa-utensils'
        },
        {
          title: 'Fishing',
          details: 'Time for some weekend R&R',
          date: getCurrentDay(22),
          bgcolor: 'purple',
          icon: 'fas fa-fish',
          days: 2
        },
        {
          title: 'Vacation',
          details: 'Trails and hikes, going camping! Don\'t forget to bring bear spray!',
          date: getCurrentDay(29),
          bgcolor: 'purple',
          icon: 'fas fa-plane',
          days: 5
        }
      ]
    }
  },
  computed: {
    // convert the events into a map of lists keyed by date
    eventsMap () {
      const map = {}
      this.events.forEach((event) => (map[event.date] = map[event.date] || []).push(event))
      return map
    }
  },

  methods: {
    isCssColor (color) {
      return !!color && !!color.match(/^(#|(rgb|hsl)a?\()/)
    },

    badgeClasses (event, type) {
      const cssColor = this.isCssColor(event.bgcolor)
      const isHeader = type === 'header'
      return {
        [`text-white bg-${event.bgcolor}`]: !cssColor,
        'full-width': !isHeader && (!event.side || event.side === 'full'),
        'left-side': !isHeader && event.side === 'left',
        'right-side': !isHeader && event.side === 'right'
      }
    },

    badgeStyles (event, type, timeStartPos, timeDurationHeight) {
      const s = {}
      if (this.isCssColor(event.bgcolor)) {
        s['background-color'] = event.bgcolor
        s.color = colors.luminosity(event.bgcolor) > 0.5 ? 'black' : 'white'
      }
      if (timeStartPos) {
        s.top = timeStartPos(event.time) + 'px'
      }
      if (timeDurationHeight) {
        s.height = timeDurationHeight(event.duration) + 'px'
      }
      s['align-items'] = 'flex-start'
      return s
    },

    getEvents (dt) {
      const events = []
      for (let i = 0; i < this.events.length; ++i) {
        let added = false
        const event = this.events[i]
        if (event.date === dt) {
          if (event.time) {
            if (events.length > 0) {
              // check for overlapping times
              const startTime = makeDateTime(parsed(event.date + ' ' + event.time))
              const endTime = date.addToDate(startTime, { minutes: event.duration })
              for (let j = 0; j < events.length; ++j) {
                const startTime2 = makeDateTime(parsed(events[j].date + ' ' + events[j].time))
                const endTime2 = date.addToDate(startTime2, { minutes: events[j].duration })
                if (date.isBetweenDates(startTime, startTime2, endTime2) || date.isBetweenDates(endTime, startTime2, endTime2)) {
                  events[j].side = 'left'
                  event.side = 'right'
                  events.push(event)
                  added = true
                  break
                }
              }
            }
          }
          if (!added) {
            event.side = void 0
            events.push(event)
          }
        } else if (event.days) {
          // check for overlapping dates
          const startDate = makeDateTime(parsed(event.date))
          const endDate = date.addToDate(startDate, { days: event.days })
          if (date.isBetweenDates(dt, startDate, endDate)) {
            events.push(event)
            added = true
          }
        }
      }
      return events
    }
  }
}
</script>

<style lang="sass">
  // this page
  .calendar-container
    position: relative

  .my-event
    width: 100%
    position: absolute
    font-size: 12px

  .full-width
    left: 0
    width: 100%

  .left-side
    left: 0
    width: 49.75%

  .right-side
    left: 50.25%
    width: 49.75%
  </style>
