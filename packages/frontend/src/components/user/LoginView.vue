<template>
  <div class="flex flex-col items-center">
    <h1 class="text-3xl text-gray-500 mt-20 mb-4">
      <i class="material-icons text-4xl text-purple-700 mr-2">thumb_up</i>
      Join our community now!
    </h1>
    <div class="mb-8">
      <router-link
        :to="{ name: 'about-privacy' }"
        class="text-purple-400 hover:text-purple-300"
      >
        Privacy &amp; Cookies
      </router-link>
    </div>
    <div class="mt-4">
      <BaseButton
        :href="`${baseUrl}/auth/github`"
        :loading="loading === 'github'"
        :disabled="!!loading"
        class="bg-gray-800 hover:bg-gray-700 w-64 py-4"
        @click="loading = 'github'"
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
import { ref } from '@vue/composition-api'

export default {
  setup () {
    const loading = ref(null)

    return {
      loading,
      baseUrl: process.env.VUE_APP_API_BASE,
    }
  },

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

  metaInfo: {
    title: 'Login',
  },
}
</script>
