<script>
import { ref, watch, getCurrentInstance } from '@vue/composition-api'

const shownUids = new Set()

export default {
  inheritAttrs: false,

  setup () {
    const shown = ref()
    const vm = getCurrentInstance()

    watch(shown, value => {
      if (value) {
        shownUids.add(vm._uid)
        document.body.classList.add('popper-open')
      } else {
        shownUids.delete(vm._uid)
        if (!shownUids.size) {
          document.body.classList.remove('popper-open')
        }
      }
    }, { lazy: true })

    return {
      shown,
    }
  },
}
</script>

<template>
  <VDropdown
    v-bind="$attrs"
    v-on="$listeners"
    @apply-show="shown = true"
    @apply-hide="shown = false"
  >
    <slot />
    <template #popper>
      <slot name="popper" />
    </template>
  </VDropdown>
</template>
