<template>
  <div v-if="projectType">
    <PageTitle
      v-if="!$responsive.md || !packageId"
      :back-to="{ name: 'home' }"
      class="mb-8"
    >
      Awesome {{ projectType.name }} packages
    </PageTitle>

    <div class="flex">
      <div
        v-if="!$responsive.md || !packageId"
        class="w-full lg:w-1/3 lg:pb-64"
      >
        <ProjectTypePackageProposalsButton
          :project-type-id="projectType.id"
          class="w-full mb-6"
        />

        <PackageList
          :project-type-slug="projectType.slug"
        />
      </div>

      <div
        v-if="!$responsive.md || packageId"
        class="w-full lg:w-2/3 lg:pl-16 lg:sticky lg:top-0 lg:max-h-screen lg:overflow-auto"
      >
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import PageTitle from '../PageTitle.vue'
import PackageList from '../pkg/PackageList.vue'
import ProjectTypePackageProposalsButton from './ProjectTypePackageProposalsButton.vue'
import gql from 'graphql-tag'
import { projectType } from './fragments'

export default {
  components: {
    PageTitle,
    PackageList,
    ProjectTypePackageProposalsButton,
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
          projectType: projectTypeBySlug (slug: $slug) {
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
