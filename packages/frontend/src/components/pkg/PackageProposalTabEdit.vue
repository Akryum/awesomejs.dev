<script>
import PackageEditForm from './PackageEditForm.vue'

import gql from 'graphql-tag'
import { useMutation, useQuery, useResult } from '@vue/apollo-composable'
import { pkgProposalFragment } from './fragments'

export default {
  components: {
    PackageEditForm,
  },

  props: {
    pkg: {
      type: Object,
      required: true,
    },
  },

  setup (props) {
    const { result, loading } = useQuery(gql`
      query PackageEditInfo ($id: ID!) {
        packageProposal (id: $id) {
          id
          info {
            tags
          }
          dataSources {
            type
            data
          }
        }
      }
    `, () => ({
      id: props.pkg.id,
    }))
    const pkgEditInfo = useResult(result, { dataSources: [] })

    const { mutate, loading: submitting, error } = useMutation(gql`
      mutation EditPackageProposalInfo ($input: EditPackageProposalInfoInput!) {
        editPackageProposalInfo (input: $input) {
          ...pkgProposal
        }
      }
      ${pkgProposalFragment}
    `)

    async function editProposal (data) {
      await mutate({
        input: {
          common: {
            id: props.pkg.id,
            ...data,
          },
        },
      })
    }

    return {
      loading,
      pkgEditInfo,

      editProposal,
      submitting,
      error,
    }
  },
}
</script>

<template>
  <LoadingIndicator
    v-if="loading"
    class="mt-8"
  />

  <PackageEditForm
    v-else
    :pkg="pkgEditInfo"
    :submitting="submitting"
    :error="error"
    @submit="editProposal"
  />
</template>
