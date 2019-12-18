import Vue from 'vue'
import Responsive from './util/responsive'
import { focus } from 'vue-focus'
import VueCompositionApi from '@vue/composition-api'
import VueMeta from 'vue-meta'
import VTooltip from 'v-tooltip'
import 'v-tooltip/dist/v-tooltip.css'
import GlobalEvents from 'vue-global-events'

Vue.use(Responsive, {
  computed: {
    sm () {
      return this.width < 640
    },
    md () {
      return this.width < 768
    },
    mobile () {
      return this.width <= 768
    },
    lg () {
      return this.width < 1024
    },
    xl () {
      return this.width < 1280
    },
  },
})

Vue.directive('focus', focus)

Vue.use(VueCompositionApi)

Vue.use(VueMeta)

Vue.use(VTooltip, {
  boundariesElement: 'viewport',
  themes: {
    tooltip: {
      // Delay (ms)
      delay: {
        show: 700,
        hide: 0,
      },
      offset: 8,
    },
    'yellow-arrow': {
      $extend: 'dropdown',
    },
  },
})

Vue.component('GlobalEvents', GlobalEvents)
