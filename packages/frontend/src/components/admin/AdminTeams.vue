<script>
import { useQuery, useResult } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { teamFragment } from './fragments'

import LoadingIndicator from '../LoadingIndicator.vue'

export const QUERY_TEAMS = gql`
  query AllTeams {
    allTeams {
      ...team
    }
  }
  ${teamFragment}
`

export default {
  components: {
    LoadingIndicator,
  },

  props: {
    teamId: {
      type: String,
      default: null,
    },
  },

  setup () {
    const { result, loading } = useQuery(QUERY_TEAMS)
    const teams = useResult(result, [])

    return {
      teams,
      loading,
    }
  },
}
</script>

<template>
  <div class="flex mt-4">
    <div
      v-if="!$responsive.lg || !teamId"
      class="w-full lg:w-1/3 lg:pb-64 lg:mt-4 lg:sticky lg:top-4 lg:max-h-screen lg:overflow-y-auto"
      :class="{
        'scroll-parent': !$responsive.lg,
      }"
    >
      <BaseButton
        :to="{ name: 'admin-team-create' }"
        icon-left="add"
        align="left"
        class="link w-full bg-gray-800 text-purple-300 rounded px-6 py-4 hover:bg-gray-700"
      >
        Create team
      </BaseButton>

      <LoadingIndicator v-if="loading" />

      <template v-else>
        <BaseButton
          v-for="team of teams"
          :key="team.id"
          :to="{
            name: 'admin-team-view',
            params: {
              teamId: team.id,
            },
          }"
          icon-left="supervisor_account"
          align="left"
          class="link w-full mt-4 sm:mt-6 bg-gray-800 text-purple-300 rounded px-6 py-4 hover:bg-gray-700"
        >
          {{ team.name }}
        </BaseButton>
      </template>
    </div>

    <div
      v-if="!$responsive.lg || packageId"
      class="w-full lg:w-2/3 lg:pl-16"
    >
      <router-view />
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.link.router-link-active {
  @apply text-purple-200 bg-purple-800;

  &:hover {
    @apply bg-purple-700;
  }
}
</style>
