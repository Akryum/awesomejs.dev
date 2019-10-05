<template>
  <div v-if="projectType">
    <PageTitle
      v-if="!$responsive.md || !packageId"
      class="mb-8"
    >
      Awesome {{ projectType.name }} packages
    </PageTitle>

    <div class="flex">
      <PackageList
        v-if="!$responsive.md || !packageId"
        :project-type-slug="projectType.slug"
        class="w-full lg:w-1/3"
      />
      <div
        v-if="!$responsive.md || packageId"
        class="w-full lg:w-2/3 lg:pl-16 lg:sticky lg:top-0 lg:h-screen lg:overflow-auto"
      >
        <router-view />
      </div>
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

    packageId: {
      type: String,
      default: null,
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
