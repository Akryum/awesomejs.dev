<template>
  <div v-if="!$apollo.loading">
    <div
      v-if="currentUser"
      class="w-10 h-10 flex items-center justify-center"
    >
      <VDropdown
        placement="bottom-end"
        class="h-10"
      >
        <BaseButton>
          <img
            :src="currentUser.avatar || require('@/assets/user.svg')"
            alt="User"
            class="max-w-full max-h-full rounded-full bg-gray-700 border-2 border-gray-700"
          >
        </BaseButton>

        <template #popper>
          <div class="flex flex-col items-stretch">
            <BaseButton
              v-close-popper
              :to="{ name: 'user-dashboard' }"
              icon-left="dashboard"
              align="left"
              class="px-3 py-2 hover:bg-gray-700"
            >
              Dashboard
            </BaseButton>

            <BaseButton
              v-close-popper
              :to="{ name: 'user-bookmarks' }"
              icon-left="bookmark"
              align="left"
              class="px-3 py-2 hover:bg-gray-700"
            >
              Bookmarks
            </BaseButton>

            <BaseButton
              :href="`${baseUrl}/auth/logout`"
              icon-left="power_settings_new"
              align="left"
              class="px-3 py-2 hover:bg-gray-700"
            >
              Logout
            </BaseButton>
          </div>
        </template>
      </VDropdown>
    </div>
    <div v-else>
      <BaseButton
        :to="{ name: 'login' }"
        icon-left="face"
        class="px-4 py-1 bg-purple-800 hover:bg-purple-700"
      >
        Sign in
      </BaseButton>
    </div>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import { user } from './fragments'

export default {
  apollo: {
    currentUser: gql`
      query CurrentUser {
        currentUser {
          ...user
        }
      }
      ${user}
    `,
  },

  created () {
    this.baseUrl = process.env.VUE_APP_API_BASE
  },
}
</script>
