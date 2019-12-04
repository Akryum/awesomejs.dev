<script>
import { useAppUpdate } from '@/util/service-worker'
const ToastNotification = () => import(
  /* webpackChunkName: "ToastNotification.vue" */
  '../ToastNotification.vue'
)

export default {
  components: {
    ToastNotification,
  },

  setup () {
    const {
      updateAvailable,
      applyUpdate,
    } = useAppUpdate()

    return {
      updateAvailable,
      applyUpdate,
    }
  },
}
</script>

<template>
  <ToastNotification
    v-if="updateAvailable"
  >
    <i class="material-icons text-xl">cached</i>
    A new version of the application is available.

    <template #actions>
      <BaseButton
        class="px-4 py-2 hover:bg-gray-700"
        @click="applyUpdate"
      >
        Refresh
      </BaseButton>

      <BaseButton
        class="px-4 py-2 hover:bg-gray-700"
        @click="updateAvailable = false"
      >
        Dismiss
      </BaseButton>
    </template>
  </ToastNotification>
</template>
