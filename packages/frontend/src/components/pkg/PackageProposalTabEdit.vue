<script>
import PackageEditForm from './PackageEditForm.vue'

import gql from 'graphql-tag'
import { useMutation } from '@vue/apollo-composable'
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
          proposalId: props.pkg.id,
          ...data,
        },
      })
    }

    return {
      editProposal,
      submitting,
      error,
    }
  },
}
</script>

<template>
  <PackageEditForm
    :pkg="pkg"
    :submitting="submitting"
    :error="error"
    @submit="editProposal"
  />
</template>
