<script>
import PageTitle from '../PageTitle.vue'
import ProjectTypes from '../project-type/ProjectTypes.vue'
import { STORE_ROUTE_BEFORE_REDIRECT, useRouter } from '@/util/router'

export default {
  components: {
    PageTitle,
    ProjectTypes,
  },

  setup (props) {
    const router = useRouter()
    const routeBeforeRedirect = localStorage.getItem(STORE_ROUTE_BEFORE_REDIRECT)
    if (routeBeforeRedirect) {
      localStorage.removeItem(STORE_ROUTE_BEFORE_REDIRECT)
      router.push(routeBeforeRedirect)
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
