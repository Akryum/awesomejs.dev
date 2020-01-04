<script>
import { useCurrentUser } from '../user/useCurrentUser'

import ErrorMessage from '../ErrorMessage.vue'
import PageTitle from '../PageTitle.vue'
import RouteTab from '../RouteTab.vue'
import UserCheckSignedIn from '../user/UserCheckSignedIn.vue'

export default {
  components: {
    ErrorMessage,
    PageTitle,
    RouteTab,
    UserCheckSignedIn,
  },

  setup () {
    return {
      isAdmin: useCurrentUser().isAdmin,
    }
  },
}
</script>

<template>
  <div>
    <UserCheckSignedIn />

    <ErrorMessage
      v-if="!isAdmin"
      error="Restricted area"
      class="error-box"
    />

    <template v-else>
      <PageTitle class="justify-center mb-4 lg:pl-4">
        <i class="material-icons text-3xl mr-2 text-red-700">lock</i>
        <span>Admin Restricted Area</span>
      </PageTitle>

      <div class="overflow-x-auto flex pb-4 lg:pb-0">
        <RouteTab
          :to="{ name: 'admin' }"
          icon-left="home"
          class="flex-none"
          exact
        >
          Home
        </RouteTab>

        <RouteTab
          :to="{ name: 'admin-teams' }"
          icon-left="supervisor_account"
          class="flex-none"
        >
          Teams
        </RouteTab>
      </div>

      <router-view />
    </template>
  </div>
</template>
