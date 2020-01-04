<script>
import gql from 'graphql-tag'
import { useMutation, useQuery, useResult } from '@vue/apollo-composable'
import { pkgProposalFragment } from './fragments'

import LoadingIndicator from '../LoadingIndicator.vue'
import PackageEditForm from './PackageEditForm.vue'
import PackageEditProjectTypesForm from './PackageEditProjectTypesForm.vue'

export default {
  components: {
    LoadingIndicator,
    PackageEditForm,
    PackageEditProjectTypesForm,
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
          projectTypes {
            id
          }
        }
      }
    `, () => ({
      id: props.pkg.id,
    }))
    const pkgEditInfo = useResult(result, { dataSources: [] })

    // Package info

    const { mutate, loading: submitting, error } = useMutation(gql`
      mutation EditPackageProposalInfo ($input: EditPackageProposalInfoInput!) {
        editPackageProposalInfo (input: $input) {
          ...pkgProposal
          dataSources {
            type
            data
          }
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

    // Project types

    const {
      mutate: mutateProjectTypes,
      loading: submittingProjectTypes,
      error: projectTypesError,
    } = useMutation(gql`
      mutation EditPackageProposalInfo ($input: EditPackageProjectTypesInput!) {
        editPackageProposalProjectTypes (input: $input) {
          id
          projectTypes {
            id
          }
        }
      }
    `)

    async function editProjectTypes (data) {
      await mutateProjectTypes({
        input: {
          packageId: props.pkg.id,
          ...data,
        },
      })
    }

    return {
      loading,
      pkgEditInfo,

      editProposal,
      submitting,
      error,

      editProjectTypes,
      submittingProjectTypes,
      projectTypesError,
    }
  },
}
</script>

<template>
  <LoadingIndicator
    v-if="loading"
    class="mt-8"
  />

  <div
    v-else
    class="pb-64"
  >
    <PackageEditForm
      :pkg="pkgEditInfo"
      :submitting="submitting"
      :error="error"
      @submit="editProposal"
    />

    <hr class="border-gray-800 my-8 max-w-3xl">

    <PackageEditProjectTypesForm
      :pkg="pkgEditInfo"
      :submitting="submittingProjectTypes"
      :error="projectTypesError"
      @submit="editProjectTypes"
    />
  </div>
</template>
