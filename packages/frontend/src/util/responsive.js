import { computed } from '@vue/composition-api'

export let responsive

let computedFields

export default {
  install (Vue, options) {
    const finalOptions = Object.assign({}, {
      computed: {},
    }, options)

    responsive = new Vue({
      data () {
        return {
          width: window.innerWidth,
          height: window.innerHeight,
        }
      },
      computed: finalOptions.computed,
    })

    computedFields = Object.keys(finalOptions.computed)

    Object.defineProperty(Vue.prototype, '$responsive', {
      get: () => responsive,
    })

    window.addEventListener('resize', () => {
      responsive.width = window.innerWidth
      responsive.height = window.innerHeight
    })
  },
}

export function useResponsive () {
  return {
    width: computed(() => responsive.width),
    height: computed(() => responsive.height),
    ...computedFields.reduce((obj, key) => {
      obj[key] = computed(() => responsive[key])
      return obj
    }, {}),
  }
}
