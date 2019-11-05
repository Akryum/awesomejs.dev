import 'focus-visible'
import './plugins'
import Vue from 'vue'
import App from './components/App.vue'
import router from './router'
import './registerServiceWorker'
import { createProvider } from './vue-apollo'
import './components'

Vue.config.productionTip = false
Vue.config.devtools = true

Vue.config.errorHandler = (err, vm, info) => {
  console.error(err, vm, info)
}

const app = new Vue({
  router,
  apolloProvider: createProvider(),
  render: h => h(App),
})

router.onReady(() => {
  app.$mount('#app')
})
