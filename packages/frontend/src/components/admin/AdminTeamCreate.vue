<script>
import { ref } from '@vue/composition-api'
import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { teamFragment } from './fragments'
import { useRouter } from '@/util/router'

import AdminTeamEditForm from './AdminTeamEditForm.vue'
import { QUERY_TEAMS } from './AdminTeams.vue'

export default {
  components: {
    AdminTeamEditForm,
  },

  setup (props) {
    const team = ref({
      name: '',
      projectTypes: [],
      users: [],
    })

    const { mutate, loading: submitting, error, onDone } = useMutation(gql`
      mutation CreateTeam ($input: CreateTeamInput!) {
        createTeam (input: $input) {
          ...team
        }
      }
      ${teamFragment}
    `, {
      update: (cache, { data: { createTeam } }) => {
        const data = cache.readQuery({ query: QUERY_TEAMS })
        data.allTeams.push(createTeam)
        cache.writeQuery({ query: QUERY_TEAMS, data })
      },
    })

    // Redirect after create
    const router = useRouter()
    onDone((result) => {
      router.push({
        name: 'admin-team-view',
        params: {
          teamId: result.data.createTeam.id,
        },
      })
    })

    async function createTeam (data) {
      await mutate({
        input: {
          ...data,
        },
      })
    }

    return {
      team,
      createTeam,
      submitting,
      error,
    }
  },
}
</script>

<template>
  <div
    class="pb-32"
  >
    <h2 class="text-xl text-gray-600 mb-8">
      Create team
    </h2>

    <AdminTeamEditForm
      :team="team"
      :submitting="submitting"
      :error="error"
      @submit="createTeam"
    />
  </div>
</template>
