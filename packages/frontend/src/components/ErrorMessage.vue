<script>
import { computed } from '@vue/composition-api'

export default {
  props: {
    error: {
      type: [String, Object, Error],
      default: null,
    },
  },

  setup (props) {
    const message = computed(() => {
      if (typeof props.error === 'string') {
        return props.error
      }
      if (props.error.graphQLErrors) {
        return props.error.graphQLErrors.map(e => e.message).join('\n')
      }
      return props.error.message
    })

    return {
      message,
    }
  },
}
</script>

<template>
  <div v-if="error">
    <i class="material-icons text-lg mr-2">error</i>
    <span class="whitespace-pre">{{ message }}</span>
  </div>
</template>

<style lang="postcss">
.error-box {
  @apply p-4 text-red-500 border-2 border-red-900 rounded;
}
</style>
