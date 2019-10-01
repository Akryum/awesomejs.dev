<template>
  <div class="flex text-purple-500">
    <div class="mr-1">
      {{ formatted }}
    </div>
    <i class="material-icons">star</i>
  </div>
</template>

<script>
import millify from 'millify'

export default {
  props: {
    count: {
      type: Number,
      required: true,
    },
  },

  computed: {
    formatted () {
      return millify(this.count, {
        precision: 1,
      })
    },
  },
}
</script>
