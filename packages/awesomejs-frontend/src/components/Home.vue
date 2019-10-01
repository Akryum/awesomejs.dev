<template>
  <div>
    <PageTitle>
      Select your project type
    </PageTitle>

    <ProjectTypes />
  </div>
</template>

<script>
import PageTitle from './PageTitle.vue'
import ProjectTypes from './ProjectTypes.vue'

export default {
  components: {
    PageTitle,
    ProjectTypes,
  },
}
</script>
