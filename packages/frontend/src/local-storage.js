import Vue from 'vue'
import VueLocalStorage from 'vue-localstorage'

Vue.use(VueLocalStorage)

export default {
  readContributing: {
    type: Boolean,
    default: false,
  },
}
