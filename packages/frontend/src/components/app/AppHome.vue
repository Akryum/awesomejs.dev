<script>
import PageTitle from '../PageTitle.vue'
import ProjectTypes from '../project-type/ProjectTypes.vue'

export default {
  components: {
    PageTitle,
    ProjectTypes,
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
