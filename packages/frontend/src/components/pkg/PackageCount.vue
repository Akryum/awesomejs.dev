<template>
  <div class="flex text-purple-500">
    <div class="mr-1 sm:mr-2">
      {{ formatted }}
    </div>
    <i class="material-icons">{{ icon }}</i>
  </div>
</template>

<script>
import millify from 'millify'

export default {
  props: {
    count: {
      type: [Number, String],
      required: true,
    },

    icon: {
      type: String,
      default: 'star',
    },
  },

  computed: {
    formatted () {
      return millify(parseInt(this.count) || 0, {
        precision: 1,
      })
    },
  },
}
</script>
