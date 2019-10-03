// --- Base components ---
import Vue from 'vue'

// Require all the components that start with 'BaseXXX.vue'
const requireComponents = require.context('./components', true, /Base[a-z0-9]+\.(jsx?|vue)$/i)
requireComponents.keys().forEach(fileName => {
  const component = requireComponents(fileName)
  const name = fileName.match(/([a-z0-9]+)\./i)[1]
  Vue.component(name, component.default || component)
})
