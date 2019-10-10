<template>
  <router-link
    v-bind="$attrs"
    class="package-list-item button-like flex items-center bg-gray-800 rounded p-2 sm:px-6 sm:py-4 hover:bg-gray-700 leading-snug sm:leading-normal"
  >
    <PackageLogo
      :pkg="pkg"
      class="mr-2 sm:mr-6"
    />

    <div class="flex-1 w-0 mr-2 sm:mr-6 overflow-hidden">
      <div class="w-full truncate text-gray-600">
        <span class="text-gray-100">
          {{ pkg.name }}
        </span>

        <span v-if="pkg.maintainers">
          by {{ pkg.maintainers.map(m => m.name).join(', ') }}
        </span>
      </div>

      <div class="w-full truncate text-gray-500">
        <span v-if="pkg.description">
          {{ parseEmoji(pkg.description) }}
        </span>
        <span v-else>No description</span>
      </div>
    </div>

    <PackageCount
      v-if="pkg.upvotes != null"
      :count="pkg.upvotes"
      icon="thumb_up"
      class="package-count"
    />
    <PackageCount
      v-else-if="pkg.stars != null"
      :count="pkg.stars"
      class="package-count"
    />

    <slot />
  </router-link>
</template>

<script>
import PackageLogo from './PackageLogo.vue'
import PackageCount from './PackageCount.vue'
import { parseEmoji } from '@/util/emoji'

export default {
  components: {
    PackageLogo,
    PackageCount,
  },

  inheritAttrs: false,

  props: {
    pkg: {
      type: Object,
      required: true,
    },
  },

  methods: {
    parseEmoji,
  },
}
</script>

<style lang="postcss" scoped>
.package-list-item.router-link-active {
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

  .package-count {
    @apply text-purple-400;
  }
}
</style>
