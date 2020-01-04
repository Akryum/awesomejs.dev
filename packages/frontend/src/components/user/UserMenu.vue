<script>
import { useCurrentUser } from './useCurrentUser'

export default {
  setup () {
    const { currentUser, loading, isAdmin } = useCurrentUser()

    return {
      currentUser,
      loading,
      isAdmin,
      baseUrl: process.env.VUE_APP_API_BASE,
    }
  },
}
</script>

<template>
  <div
    v-if="loading"
    class="w-10 h-10 rounded-full bg-gray-700 border-2 border-gray-700"
  />
  <div v-else>
    <div
      v-if="currentUser"
      class="w-10 h-10 flex items-center justify-center"
    >
      <BasePopper
        theme="yellow-arrow"
        placement="bottom-end"
      >
        <BaseButton>
          <img
            :src="currentUser.avatar || require('@/assets/user.svg')"
            alt="User"
            class="avatar max-w-full max-h-full rounded-full bg-gray-700 border-2 border-gray-700 hover:border-gray-600"
            :class="{
              'border-red-700 hover:border-red-600': currentUser.admin,
            }"
          >
        </BaseButton>

        <template #popper>
          <div class="flex flex-col items-stretch pb-4">
            <div class="px-6 py-3 mb-4 text-yellow-500 bg-yellow-900 rounded-t">
              <i class="material-icons text-lg mr-1">account_circle</i>
              {{ currentUser.nickname }}
            </div>

            <BaseButton
              v-if="isAdmin"
              v-close-popper
              :to="{ name: 'admin' }"
              icon-left="lock"
              align="left"
              class="px-6 py-2 text-red-300 hover:bg-red-800"
              square
            >
              Admin
            </BaseButton>

            <BaseButton
              v-close-popper
              :to="{ name: 'user-dashboard' }"
              icon-left="dashboard"
              align="left"
              class="px-6 py-2 hover:bg-gray-800"
              square
            >
              Dashboard
            </BaseButton>

            <BaseButton
              v-close-popper
              :to="{ name: 'user-bookmarks' }"
              icon-left="bookmark"
              align="left"
              class="px-6 py-2 hover:bg-gray-800"
              square
            >
              Bookmarks
            </BaseButton>

            <BaseButton
              :href="`${baseUrl}/auth/logout`"
              icon-left="power_settings_new"
              align="left"
              class="px-6 py-2 hover:bg-gray-800"
              square
            >
              Logout
            </BaseButton>
          </div>
        </template>
      </BasePopper>
    </div>
    <div v-else>
      <BaseButton
        :to="{ name: 'login' }"
        icon-left="face"
        class="px-4 py-2 bg-gray-800 text-gray-200 hover:bg-gray-700"
      >
        Sign in
      </BaseButton>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.v-popper--open {
  .avatar {
    @apply border-yellow-800;
  }
}
</style>
