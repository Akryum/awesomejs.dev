<script>
import { computed } from '@vue/composition-api'

export default {
  props: {
    pkg: {
      type: Object,
      required: true,
    },
  },

  setup (props) {
    const sortedTags = computed(() => (props.pkg.info.tags || []).sort((a, b) => {
      if (a === 'official') return -1
      if (b === 'official') return 1
      return a.localeCompare(b)
    }))

    return {
      sortedTags,
    }
  },
}
</script>

<template>
  <div class="flex flex-wrap">
    <i class="material-icons text-gray-600 mr-2">filter_list</i>
    <div
      v-for="tag of sortedTags"
      :key="tag"
      class="mr-2 px-2 text-gray-500 bg-gray-800 rounded mb-2 flex-none xl:mb-0"
      :class="{
        'text-orange-400 bg-yellow-900': tag === 'official',
      }"
    >
      {{ tag }}
    </div>
    <div
      v-if="!pkg.info.tags.length"
      class="text-gray-700"
    >
      No tags
    </div>
  </div>
</template>
