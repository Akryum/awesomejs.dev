<script>
export default {
  props: {
    projectType: {
      type: Object,
      required: true,
    },

    selected: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<template>
  <div
    class="
    flex flex-col items-center justify-center p-2 bg-gray-800 rounded
    w-24 h-24 lg:w-32 lg:h-32 cursor-pointer relative
    hover:bg-gray-700
    "
    :class="{
      'text-purple-200 bg-purple-800 hover:bg-purple-700': selected,
    }"
  >
    <div
      class="w-8 lg:w-16 flex items-center justify-center flex-1"
    >
      <img
        :src="projectType.logo"
        :alt="`${projectType.name} logo`"
        class="max-w-full max-h-full rounded"
      >
    </div>

    <div class="truncate max-w-full">
      {{ projectType.name }}
    </div>

    <div
      v-if="projectType.bookmarked"
      class="absolute top-0 right-0 pt-1 pr-2"
    >
      <i
        class="material-icons text-lg text-gray-600"
      >bookmark</i>
    </div>
  </div>
</template>
