import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './registerServiceWorker'
import { createProvider } from './vue-apollo'
import './components'
import Responsive from './util/responsive'

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

Vue.config.productionTip = false

new Vue({
  router,
  apolloProvider: createProvider(),
  render: h => h(App),
}).$mount('#app')
