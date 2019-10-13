<template>
  <div>
    <UserCheckSignedIn />

    <LoadingIndicator
      v-if="$apollo.loading"
      class="py-8"
    />

    <div v-else-if="user">
      <PageTitle>
        Hello {{ user.nickname }}! 👋️
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
  </div>
</template>

<script>
import gql from 'graphql-tag'
import { user } from './fragments'

import LoadingIndicator from '../LoadingIndicator.vue'
import UserCheckSignedIn from './UserCheckSignedIn.vue'
import PageTitle from '../PageTitle.vue'
import RouteTab from '../RouteTab'

export default {
  components: {
    LoadingIndicator,
    UserCheckSignedIn,
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

  metaInfo: {
    title: 'My Dashboard',
  },
}
</script>
