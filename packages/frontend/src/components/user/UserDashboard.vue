<template>
  <LoadingIndicator
    v-if="$apollo.loading"
    class="py-8"
  />
  <div v-else>
    <PageTitle>
      Hello {{ user.nickname }}! 👋️

      <a
        :href="`${baseUrl}/auth/logout`"
        class="ml-8 text-base text-gray-600 hover:text-gray-500"
      >
        Logout
      </a>
    </PageTitle>

    <div class="flex mt-2">
      <RouteTab
        :to="{ name: 'user-dashboard' }"
        exact
      >
        Dashboard
      </RouteTab>

      <RouteTab
        :to="{ name: 'user-bookmarks' }"
      >
        Bookmarks
      </RouteTab>
    </div>

    <router-view :user="user" />
  </div>
</template>

<script>
import gql from 'graphql-tag'
import { user } from './fragments'

import LoadingIndicator from '../LoadingIndicator.vue'
import PageTitle from '../PageTitle.vue'
import RouteTab from '../RouteTab'

export default {
  components: {
    LoadingIndicator,
    PageTitle,
    RouteTab,
  },

  apollo: {
    user: gql`
      query CurrentUser {
        user: currentUser {
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
