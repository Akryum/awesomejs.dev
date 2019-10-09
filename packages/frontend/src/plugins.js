import Vue from 'vue'
import Responsive from './util/responsive'
import { focus } from 'vue-focus'
import VueCompositionApi from '@vue/composition-api'

Vue.use(Responsive, {
  computed: {
    sm () {
      return this.width <= 640
    },
    md () {
      return this.width <= 768
    },
    lg () {
      return this.width <= 1024
    },
    xl () {
      return this.width <= 1280
    },
  },
})

Vue.directive('focus', focus)

Vue.use(VueCompositionApi)
