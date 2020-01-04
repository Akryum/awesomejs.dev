<script>
import { useQuery, useResult, useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'

import AdminTeamEditForm from './AdminTeamEditForm.vue'
import LoadingIndicator from '../LoadingIndicator.vue'

const teamFragment = gql`
fragment team on Team {
  id
  name
  projectTypes {
    id
    name
  }
  users {
    id
    nickname
    email
  }
}
`

export default {
  components: {
    AdminTeamEditForm,
    LoadingIndicator,
  },

  props: {
    teamId: {
      type: String,
      required: true,
    },
  },

  setup (props) {
    const { result, loading } = useQuery(gql`
      query GetTeam ($id: ID!) {
        team (id: $id) {
          ...team
        }
      }
      ${teamFragment}
    `, () => ({
      id: props.teamId,
    }))
    const team = useResult(result)

    const { mutate, loading: submitting, error } = useMutation(gql`
      mutation EditTeam ($input: EditTeamInput!) {
        editTeam (input: $input) {
          ...team
        }
      }
      ${teamFragment}
    `)

    async function editTeam (data) {
      await mutate({
        input: {
          id: props.teamId,
          ...data,
        },
      })
    }

    return {
      team,
      loading,

      editTeam,
      submitting,
      error,
    }
  },
}
</script>

<template>
  <LoadingIndicator v-if="loading" />

  <div
    v-else
    class="pb-32"
  >
    <h2 class="text-xl text-gray-600 mb-8">
      Selected team
    </h2>

    <AdminTeamEditForm
      :team="team"
      :submitting="submitting"
      :error="error"
      @submit="editTeam"
    />
  </div>
</template>
