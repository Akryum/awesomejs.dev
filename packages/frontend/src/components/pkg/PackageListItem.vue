<template>
  <router-link
    :to="{
      name: 'package',
      params: { packageId: pkg.id },
    }"
    class="flex items-center bg-gray-800 rounded px-6 py-4 hover:bg-gray-700"
  >
    <PackageLogo
      :pkg="pkg"
      class="mr-6"
    />

    <div class="flex-1 w-0 mr-6 overflow-hidden">
      <div class="w-full truncate text-gray-600">
        <span class="text-gray-100">
          {{ pkg.name }}
        </span>

        <span>
          by {{ pkg.maintainers.map(m => m.name).join(', ') }}
        </span>
      </div>

      <div class="w-full truncate text-gray-500">
        <span>
          {{ pkg.description }}
        </span>
      </div>
    </div>

    <PackageStars
      :count="pkg.stars"
      class="stars"
    />
  </router-link>
</template>

<script>
import PackageLogo from './PackageLogo.vue'
import PackageStars from './PackageStars.vue'

export default {
  components: {
    PackageLogo,
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

<style lang="postcss" scoped>
.router-link-active {
  @apply bg-purple-900;

  &:hover {
    @apply bg-purple-800;
  }

  .text-gray-100 {
    @apply text-purple-100;
  }

  .text-gray-600 {
    @apply text-purple-600;
  }

  .text-gray-500 {
    @apply text-purple-500;
  }

  .stars {
    @apply text-purple-400;
  }
}
</style>
