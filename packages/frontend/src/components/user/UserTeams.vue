<script>
import { useQuery, useResult } from '@vue/apollo-composable'
import gql from 'graphql-tag'

export default {
  setup (props) {
    const { result } = useQuery(gql`
      query UserTeams {
        currentUser {
          id
          teams {
            id
            name
          }
        }
      }
    `)
    const teams = useResult(result, [], data => data.currentUser.teams)

    return {
      teams,
    }
  },
}
</script>

<template>
  <div
    v-if="teams.length"
    class="my-4 flex items-center p-4 border-orange-900 border-2 rounded"
  >
    <div>Your teams:</div>
    <div
      v-for="team of teams"
      :key="team.id"
      class="ml-4 rounded text-orange-300 bg-orange-700 flex items-center px-4 py-2"
    >
      <i class="material-icons mr-2">supervisor_account</i>
      {{ team.name }}
    </div>
  </div>
</template>
