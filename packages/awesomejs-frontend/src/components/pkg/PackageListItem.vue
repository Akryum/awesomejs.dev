<template>
  <div
    class="flex items-center bg-gray-800 rounded p-4"
  >
    <div class="flex-1">
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

    <PackageStars
      :count="pkg.stars"
    />
  </div>
</template>

<script>
import PackageStars from './PackageStars.vue'

export default {
  components: {
    PackageStars,
  },

  props: {
    pkg: {
      type: Object,
      required: true,
    },
  },
}
</script>
