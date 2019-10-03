<template>
  <div v-if="!$apollo.loading">
    <div
      v-if="currentUser"
      class="w-8 h-8 flex items-center justify-center"
    >
      <router-link
        :to="{ name: 'user-dashboard' }"
      >
        <img
          :src="currentUser.avatar || require('@/assets/user.svg')"
          alt="User"
          class="max-w-full max-h-full rounded-full bg-gray-700"
        >
      </router-link>
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
}
</script>
