<script>
import { computed } from '@vue/composition-api'

export default {
  setup ({ root }) {
    const routeAdd = computed(() => ({
      name: 'add-project',
    }))

    return {
      routeAdd,
    }
  },
}
</script>

<template>
  <div>
    <BaseButton
      v-tooltip="'Suggest a new project'"
      :to="routeAdd"
      icon-left="add"
      class="px-4 py-2 bg-purple-900 text-purple-200 hover:bg-purple-800 rounded"
    >
      Project
    </BaseButton>
  </div>
</template>
