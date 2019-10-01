<template>
  <div
    class="flex bg-gray-800 rounded p-4"
  >
    <div>
      <div class="flex">
        <div class="text-gray-100 mr-1">
          {{ pkg.name }}
        </div>

        <div class="text-gray-600">
          by {{ pkg.author.name }}
        </div>
      </div>

      <div class="flex">
        <div class="text-gray-500">
          {{ pkg.description }}
        </div>
      </div>
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
