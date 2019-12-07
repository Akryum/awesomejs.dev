<script>
import { watch, ref } from '@vue/composition-api'
import { useGlobalQueryLoading } from '@vue/apollo-composable'

export default {
  setup () {
    const loading = useGlobalQueryLoading()
    const progress = ref(0)

    watch(loading, (value, oldValue, onCleanup) => {
      if (value) {
        progress.value = 0
        const timer = setInterval(() => {
          progress.value += (1 - progress.value) / 8
        }, 200)
        onCleanup(() => {
          clearInterval(timer)
        })
      } else {
        progress.value = 1
      }
    })

    return {
      progress,
    }
  },
}
</script>

<template>
  <div
    class="container fixed top-0 left-0 w-full h-0"
    :class="{
      'opacity-0': progress === 1,
    }"
  >
    <div
      class="bar bg-purple-400"
      :class="{
        animate: progress > 0,
      }"
      :style="{
        width: `${progress * 100}%`
      }"
    />
  </div>
</template>

<style lang="postcss" scoped>
.container {
  transition: opacity .5s ease-out;
}

.bar {
  height: 2px;
  box-shadow: 0 2px 6px theme('colors.purple.300'), 0 2px 6px theme('colors.purple.300');

  &.animate {
    transition: width .2s ease-out;
  }
}
</style>
