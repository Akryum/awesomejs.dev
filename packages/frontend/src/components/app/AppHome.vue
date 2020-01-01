<script>
import PageTitle from '../PageTitle.vue'
import ProjectTypes from '../project-type/ProjectTypes.vue'
import { STORE_ROUTE_BEFORE_REDIRECT } from '@/util/router'

export default {
  components: {
    PageTitle,
    ProjectTypes,
  },

  setup (props, { root }) {
    const routeBeforeRedirect = localStorage.getItem(STORE_ROUTE_BEFORE_REDIRECT)
    if (routeBeforeRedirect) {
      localStorage.removeItem(STORE_ROUTE_BEFORE_REDIRECT)
      root.$router.push(routeBeforeRedirect)
    }
  },
}
</script>

<template>
  <div>
    <PageTitle>
      Select your project type
    </PageTitle>

    <ProjectTypes />
  </div>
</template>
