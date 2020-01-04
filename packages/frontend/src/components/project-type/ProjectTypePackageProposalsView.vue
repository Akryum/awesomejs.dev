<script>
import gql from 'graphql-tag'
import { useQuery, useResult } from '@vue/apollo-composable'
import { projectTypeFragment } from './fragments'
import { useCurrentUser } from '../user/useCurrentUser'

import PageTitle from '../PageTitle.vue'
import PackageProposalList from '../pkg/PackageProposalList.vue'

export default {
  components: {
    PageTitle,
    PackageProposalList,
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

  setup (props) {
    const { result } = useQuery(gql`
      query ProjectType ($slug: String!) {
        projectType: projectTypeBySlug (slug: $slug) {
          ...projectType
        }
      }
      ${projectTypeFragment}
    `, () => ({
      slug: props.projectTypeSlug,
    }))
    const projectType = useResult(result)

    // Admin
    const { isAdmin } = useCurrentUser()

    return {
      projectType,
      isAdmin,
    }
  },

  metaInfo () {
    if (!this.projectType) return

    return {
      title: `Awesome ${this.projectType.name} proposals`,
    }
  },
}
</script>

<template>
  <div v-if="projectType">
    <PageTitle
      v-if="!$responsive.lg || !packageId"
      :back-to="{
        name: 'project-type',
        params: {
          projectTypeSlug,
        },
      }"
      class="mb-8"
    >
      Proposed {{ projectType.name }} packages

      <template #after>
        <div
          v-if="!isAdmin && projectType.inTeam"
          v-tooltip="'You have moderation rights on this project type'"
          class="text-orange-300 bg-orange-700 p-1 rounded ml-4 text-sm leading-none"
        >
          <i class="material-icons text-base">supervisor_account</i>
          Team
        </div>
      </template>
    </PageTitle>

    <div class="flex">
      <div
        v-if="!$responsive.lg || !packageId"
        class="w-full lg:w-1/3 lg:pb-64 lg:mt-4 lg:sticky lg:top-4 lg:max-h-screen lg:overflow-y-auto"
        :class="{
          'scroll-parent': !$responsive.lg,
        }"
      >
        <PackageProposalList
          :project-type-id="projectType.id"
        />
      </div>

      <div
        v-if="!$responsive.lg || packageId"
        class="w-full lg:w-2/3 lg:pl-16"
      >
        <router-view
          :project-type-id="projectType.id"
        />
      </div>
    </div>
  </div>
</template>
