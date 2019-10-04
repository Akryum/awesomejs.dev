<template>
  <div
    class="
    flex flex-col items-center justify-center p-2 bg-gray-800 rounded
    w-32 h-32 cursor-pointer
    hover:bg-gray-700
    "
  >
    <div
      class="w-16 flex items-center justify-center flex-1"
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
  </div>
</template>

<script>
export default {
  props: {
    projectType: {
      type: Object,
      required: true,
    },
  },
}
</script>
