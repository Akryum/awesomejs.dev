<script>
import LoadingIndicator from '../LoadingIndicator.vue'
import UserCheckSignedIn from './UserCheckSignedIn.vue'
import PageTitle from '../PageTitle.vue'
import RouteTab from '../RouteTab'

import { useCurrentUser } from './useCurrentUser'

export default {
  components: {
    LoadingIndicator,
    UserCheckSignedIn,
    PageTitle,
    RouteTab,
  },

  setup () {
    const { currentUser, loading } = useCurrentUser()

    return {
      currentUser,
      loading,
    }
  },

  metaInfo: {
    title: 'My Dashboard',
  },
}
</script>

<template>
  <div>
    <UserCheckSignedIn />

    <LoadingIndicator
      v-if="loading"
      class="py-8"
    />

    <div v-else-if="currentUser">
      <PageTitle>
        Hello {{ currentUser.nickname }}! 👋️
      </PageTitle>

      <div class="overflow-x-auto flex">
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

      <router-view :user="currentUser" />
    </div>
  </div>
</template>
