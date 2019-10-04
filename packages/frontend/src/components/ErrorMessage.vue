<template>
  <div
    v-if="error"
    class="text-red-500 mt-2"
  >
    <i class="material-icons text-lg mr-2">error</i>
    <span class="whitespace-pre">{{ message }}</span>
  </div>
</template>

<script>
export default {
  props: {
    error: {
      type: [String, Object, Error],
      default: null,
    },
  },

  computed: {
    message () {
      if (typeof this.error === 'string') {
        return this.error
      }
      if (this.error.graphQLErrors) {
        return this.error.graphQLErrors.map(e => e.message).join('\n')
      }
      return this.error.message
    },
  },
}
</script>
