<script>
import { ref, watch } from '@vue/composition-api'

import ErrorMessage from '../ErrorMessage.vue'
import LoadingIndicator from '../LoadingIndicator.vue'
import PackageDownloadsCount from './PackageDownloadsCount.vue'
import PackageGeneralInfo from './PackageGeneralInfo.vue'

export default {
  components: {
    ErrorMessage,
    LoadingIndicator,
    PackageDownloadsCount,
    PackageGeneralInfo,
  },

  props: {
    pkg: {
      type: Object,
      default: null,
    },

    loading: {
      type: Boolean,
      default: false,
    },

    error: {
      type: String,
      default: null,
    },
  },

  setup (props, { root }) {
    const scrollMarker = ref()
    watch(() => root.$route, () => {
      if (scrollMarker.value && scrollMarker.value.getBoundingClientRect().y < 0) {
        scrollMarker.value.scrollIntoView()
      }
    })

    return {
      scrollMarker,
    }
  },
}
</script>

<template>
  <div>
    <template v-if="loading">
      <!-- General info -->
      <div
        class="flex items-center pb-4 lg:py-4"
      >
        <div
          v-if="!$responsive.sm"
          class="mr-6 w-10 h-10 bg-gray-600 rounded"
        />

        <div class="flex-1 w-0 mr-6 overflow-hidden">
          <div class="flex my-2">
            <span class="w-24 h-3 bg-gray-100 rounded opacity-50 inline-block mr-3" />
            <span class="w-16 h-3 bg-gray-600 rounded opacity-50 inline-block" />
          </div>

          <div class="w-40 h-3 my-2 bg-gray-500 rounded opacity-50" />
        </div>

        <div class="w-32 h-3 bg-purple-500 rounded opacity-50" />
      </div>

      <div class="mb-4">
        <div class="bg-gray-800 px-8 py-4 w-48 rounded text-transparent">
          Button
        </div>
      </div>

      <div ref="scrollMarker" />

      <div class="overflow-x-auto flex pb-4 lg:sticky lg:top-0 lg:bg-gray-900 lg:z-10">
        <slot name="tabs" />
      </div>

      <LoadingIndicator class="my-16" />
    </template>
    <template v-else>
      <PackageGeneralInfo
        :pkg="pkg"
      >
        <PackageDownloadsCount
          :pkg="pkg"
          class="mr-4"
        />
      </PackageGeneralInfo>

      <div class="mb-4 flex overflow-x-auto">
        <slot name="actions" />
      </div>

      <div ref="scrollMarker" />

      <div class="overflow-x-auto flex pb-4 lg:sticky lg:top-0 lg:bg-gray-900 lg:z-10">
        <slot name="tabs" />
      </div>

      <ErrorMessage
        v-if="error"
        :error="error"
        class="error-box my-4"
      />

      <div>
        <router-view :pkg="pkg" />
      </div>
    </template>
  </div>
</template>
