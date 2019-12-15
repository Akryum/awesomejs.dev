<script>
import { DateTime } from 'luxon'
import { computed } from '@vue/composition-api'

import PackageReleaseAsset from './PackageReleaseAsset.vue'

export default {
  components: {
    PackageReleaseAsset,
  },

  props: {
    release: {
      type: Object,
      required: true,
    },
  },

  setup (props) {
    const dateTime = computed(() => DateTime.fromMillis(props.release.date))
    const fromNow = computed(() => dateTime.value.toRelative())
    const humanDate = computed(() => dateTime.value.toLocaleString(DateTime.DATETIME_FULL))

    return {
      fromNow,
      humanDate,
    }
  },
}
</script>

<template>
  <div class="p-6 mb-8 border-2 border-gray-800 rounded">
    <div class="text-gray-400">
      <span v-tooltip="humanDate">
        <i class="material-icons text-lg text-gray-500">access_time</i>
        <span class="text-sm ml-1">{{ fromNow }}</span>
      </span>
    </div>

    <div class="flex items-baseline">
      <div class="text-3xl text-purple-300">
        {{ release.title }}
      </div>
      <div class="text-gray-600 ml-2">
        <i class="material-icons text-base">local_offer</i>
        {{ release.tagName }}
      </div>

      <div
        v-if="release.prerelease"
        class="ml-2 text-orange-500 border border-yellow-900 rounded px-2"
      >
        prerelease
      </div>
    </div>

    <div
      v-if="release.assets.length"
      class="my-8"
    >
      <PackageReleaseAsset
        v-for="(asset, index) of release.assets"
        :key="index"
        :asset="asset"
        class="mb-4"
      />
    </div>

    <div
      v-if="release.description"
      class="markdown mt-4"
      v-html="release.description"
    />
  </div>
</template>
