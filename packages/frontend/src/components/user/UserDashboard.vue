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
      <PageTitle class="justify-center mb-4 lg:pl-4">
        Hello {{ currentUser.nickname }}! 👋️
      </PageTitle>

      <div class="overflow-x-auto flex pb-4 lg:pb-0">
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
