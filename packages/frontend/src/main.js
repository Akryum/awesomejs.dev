import 'focus-visible'
import './plugins'
import Vue from 'vue'
import App from './components/App.vue'
import router from './router'
import './registerServiceWorker'
import { createClient } from './vue-apollo'
import './components'
import { provide } from '@vue/composition-api'
import { DefaultApolloClient } from '@vue/apollo-composable'

Vue.config.productionTip = false
Vue.config.devtools = true

Vue.config.errorHandler = (err, vm, info) => {
  console.error(err, vm, info)
}

const apolloClient = createClient()

const app = new Vue({
  router,

  setup () {
    provide(DefaultApolloClient, apolloClient)
  },

  render: h => h(App),
})

router.onReady(() => {
  app.$mount('#app')
})
