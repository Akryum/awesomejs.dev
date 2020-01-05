<script>
import gql from 'graphql-tag'
import { useQuery, useResult } from '@vue/apollo-composable'
import { pkgProposalFragment } from './fragments'
import { computed } from '@vue/composition-api'

import PackageViewLayout from './PackageViewLayout.vue'
import PackageProposalUpvoteButton from './PackageProposalUpvoteButton.vue'
import PackageProposalApproveButton from './PackageProposalApproveButton.vue'
import PackageReleaseCount from './PackageReleaseCount.vue'
import RouteTab from '../RouteTab.vue'

export default {
  components: {
    PackageViewLayout,
    PackageProposalApproveButton,
    PackageProposalUpvoteButton,
    PackageReleaseCount,
    RouteTab,
  },

  props: {
    packageId: {
      type: String,
      required: true,
    },

    projectTypeId: {
      type: String,
      required: true,
    },
  },

  setup (props, { root }) {
    const { result, loading } = useQuery(gql`
      query PackageProposal ($id: ID!) {
        pkg: packageProposal (id: $id) {
          ...pkgProposal
          projectTypes {
            id
            inTeam
          }
          insight {
            npm {
              lastMonthDownloads: downloads (range: month)
            }
          }
        }
      }
      ${pkgProposalFragment}
    `, () => ({
      id: props.packageId,
    }))
    const pkg = useResult(result)
    const inTeam = computed(() => {
      if (pkg.value) {
        return pkg.value.projectTypes.some(pt => pt.inTeam)
      }
    })

    return {
      pkg,
      loading,
      inTeam,
    }
  },

  metaInfo () {
    if (!this.pkg) return

    return {
      title: `[Proposal] ${this.pkg.name}`,
    }
  },
}
</script>

<template>
  <PackageViewLayout
    :pkg="pkg"
    :loading="loading"
    :error="pkg && !pkg.repo ? 'No GitHub repository found' : null"
  >
    <template #actions>
      <PackageProposalApproveButton
        v-if="inTeam"
        :project-type-id="projectTypeId"
        :proposal="pkg"
        class="px-8 py-4"
      />

      <PackageProposalUpvoteButton
        :pkg="pkg"
        class="ml-4"
      />
    </template>

    <template #tabs>
      <RouteTab
        :to="{ name: 'package-proposal' }"
        class="flex-none"
        exact
      >
        General
      </RouteTab>

      <RouteTab
        :to="{ name: 'package-proposal-releases' }"
        class="flex-none"
      >
        Releases
        <PackageReleaseCount
          :pkg="pkg"
        />
      </RouteTab>

      <RouteTab
        :to="{ name: 'package-proposal-insight' }"
        class="flex-none"
      >
        Insight
      </RouteTab>

      <RouteTab
        :to="{ name: 'package-proposal-data-sources' }"
        class="flex-none"
      >
        Data sources
      </RouteTab>

      <RouteTab
        v-if="inTeam"
        :to="{ name: 'package-proposal-edit' }"
        class="flex-none"
      >
        Edit
      </RouteTab>
    </template>
  </PackageViewLayout>
</template>
