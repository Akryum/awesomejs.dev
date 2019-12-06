<script>
import millify from 'millify'
import { computed } from '@vue/composition-api'

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

    color: {
      type: String,
      default: 'purple',
    },
  },

  setup (props) {
    return {
      formatted: computed(() => millify(parseInt(props.count) || 0, {
        precision: 1,
      })),
    }
  },
}
</script>

<template>
  <div
    class="flex"
    :class="`text-${color}-500`"
  >
    <div class="mr-1 sm:mr-2">
      {{ formatted }}
    </div>
    <i class="material-icons">{{ icon }}</i>
  </div>
</template>
