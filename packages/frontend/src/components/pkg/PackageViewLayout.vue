<script>
import { ref, watch } from '@vue/composition-api'

import ErrorMessage from '../ErrorMessage.vue'
import LoadingIndicator from '../LoadingIndicator.vue'
import PackageGeneralInfo from './PackageGeneralInfo.vue'

export default {
  components: {
    ErrorMessage,
    LoadingIndicator,
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
      if (scrollMarker.value) {
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
    <LoadingIndicator
      v-if="loading"
      class="p-8"
    />
    <template v-else>
      <PackageGeneralInfo
        :pkg="pkg"
      />

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
