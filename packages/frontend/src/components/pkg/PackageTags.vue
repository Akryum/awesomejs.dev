<script>
import { computed } from '@vue/composition-api'
import { useTags } from '@/util/tags'
import { isSpecialTag } from '@awesomejs/shared-utils/tags'

import PackageTag from './PackageTag.vue'

export default {
  components: {
    PackageTag,
  },

  props: {
    pkg: {
      type: Object,
      required: true,
    },
  },

  setup (props) {
    const { tags } = useTags(() => props.pkg)
    const sortedTags = computed(() => tags.value.sort((a, b) => {
      if (isSpecialTag(a)) return -1
      if (isSpecialTag(b)) return 1
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
    <PackageTag
      v-for="tag of sortedTags"
      :key="tag"
      :tag="tag"
    />
    <div
      v-if="!pkg.info.tags.length"
      class="text-gray-700"
    >
      No tags
    </div>
  </div>
</template>
