<script>
import PackageEditForm from './PackageEditForm.vue'

import gql from 'graphql-tag'
import { useMutation } from '@vue/apollo-composable'
import { pkgFragment } from './fragments'

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
      mutation EditPackageInfo ($input: EditPackageInfoInput!) {
        editPackageInfo (input: $input) {
          ...pkg
        }
      }
      ${pkgFragment}
    `)

    async function editProposal (data) {
      await mutate({
        input: {
          packageId: props.pkg.id,
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
