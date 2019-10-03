<template>
  <div class="flex flex-col items-center">
    <i class="material-icons text-6xl text-purple-700 mb-4">face</i>
    <h1 class="text-3xl text-gray-500">
      Welcome!
    </h1>
    <div class="text-gray-300">
      How do you want to sign in?
    </div>
    <div class="mt-16">
      <BaseButton
        :href="`${baseUrl}/auth/github`"
        class="bg-black hover:bg-gray-800 w-64 py-4"
      >
        <img
          src="~@/assets/github.png"
          alt="Github logo"
          class="w-6 h-6 mr-4"
        >
        Sign in with GitHub
      </BaseButton>
    </div>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import { user } from './fragments'

export default {
  apollo: {
    user: {
      query: gql`
        query CurrentUser {
          user: currentUser {
            ...user
          }
        }
        ${user}
      `,
      result () {
        if (this.user) {
          this.$router.replace({ name: 'home' })
        }
      },
    },
  },

  created () {
    this.baseUrl = process.env.VUE_APP_API_BASE
  },
}
</script>
