<script>
import ErrorMessage from '../ErrorMessage.vue'
import LoadingIndicator from '../LoadingIndicator.vue'

export default {
  components: {
    ErrorMessage,
    LoadingIndicator,
  },

  props: {
    state: {
      type: String,
      required: true,
    },
  },
}
</script>

<template>
  <div
    class="overlay fixed z-30 inset-0 flex justify-center bg-blur"
  >
    <div
      class="absolute inset-0 bg-gray-900 opacity-90"
    />

    <div
      class="relative m-2 sm:m-8 flex-auto max-w-3xl max-h-screen box flex items-center justify-center"
    >
      <ErrorMessage
        v-if="state === 'error'"
        error="Can't load Search Overlay component"
        @click.native="$emit('close')"
      />
      <LoadingIndicator v-else-if="state === 'loading'" />
    </div>
  </div>
</template>
