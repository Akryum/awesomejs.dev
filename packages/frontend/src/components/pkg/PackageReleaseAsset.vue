<script>
import { computed } from '@vue/composition-api'
import millify from 'millify'

export default {
  props: {
    asset: {
      type: Object,
      required: true,
    },
  },

  setup (props) {
    const formattedSize = computed(() => `${millify(props.asset.size)}B`)

    return {
      formattedSize,
    }
  },
}
</script>

<template>
  <div class="flex items-center">
    <BaseButton
      :href="asset.downloadUrl"
      target="_blank"
      class="hover:text-purple-500"
    >
      <i class="material-icons mr-2">cloud_download</i>
      {{ asset.name }}
    </BaseButton>
    <span class="ml-2 text-gray-600">
      {{ formattedSize }}
    </span>
  </div>
</template>
