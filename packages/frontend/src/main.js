import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './registerServiceWorker'
import { createProvider } from './vue-apollo'
import './components'

Vue.config.productionTip = false

new Vue({
  router,
  apolloProvider: createProvider(),
  render: h => h(App),
}).$mount('#app')
