<template>
  <div class="flex flex-wrap">
    <i class="material-icons text-gray-600 mr-2">filter_list</i>
    <div
      v-for="tag of pkg.info.tags || []"
      :key="tag"
      class="mr-2 px-2 text-gray-500 bg-gray-800 rounded mb-2 flex-none xl:mb-0"
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

<script>
export default {
  props: {
    pkg: {
      type: Object,
      required: true,
    },
  },
}
</script>
