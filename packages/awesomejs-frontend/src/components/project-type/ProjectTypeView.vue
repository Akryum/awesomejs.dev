<template>
  <div v-if="projectType">
    <PageTitle>
      Awesome {{ projectType.name }} packages
    </PageTitle>

    <div class="flex mt-8">
      <PackageList
        :project-type-slug="projectType.slug"
      />
      <router-view />
    </div>
  </div>
</template>

<script>
import PageTitle from '../PageTitle.vue'
import PackageList from '../pkg/PackageList.vue'
import gql from 'graphql-tag'
import { projectType } from './fragments'

export default {
  components: {
    PageTitle,
    PackageList,
  },

  props: {
    projectTypeSlug: {
      type: String,
      required: true,
    },
  },

  apollo: {
    projectType: {
      query: gql`
        query ProjectType ($slug: String!) {
          projectType (slug: $slug) {
            ...projectType
          }
        }
        ${projectType}
      `,
      variables () {
        return {
          slug: this.projectTypeSlug,
        }
      },
    },
  },
}
</script>
