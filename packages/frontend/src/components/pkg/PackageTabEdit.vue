<script>
import LoadingIndicator from '../LoadingIndicator.vue'
import PackageEditForm from './PackageEditForm.vue'

import gql from 'graphql-tag'
import { useMutation, useQuery, useResult } from '@vue/apollo-composable'
import { pkgFragment } from './fragments'
import omit from 'lodash/omit'
import { useTags } from '@/util/tags'

export default {
  components: {
    LoadingIndicator,
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
        package (id: $id) {
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
          common: {
            id: props.pkg.id,
            ...data,
          },
        },
      })
    }

    const { isOfficial } = useTags(() => props.pkg)
    async function toggleOfficial () {
      const tags = props.pkg.info.tags.slice()
      if (tags.includes('official')) {
        tags.splice(tags.indexOf('official'), 1)
      } else {
        tags.push('official')
      }

      await mutate({
        input: {
          packageId: props.pkg.id,
          info: {
            ...omit(props.pkg.info, ['__typename']),
            tags,
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

      isOfficial,
      toggleOfficial,
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
  >
    <template #actions>
      <BaseButton
        :disabled="submitting"
        class="text-orange-400 bg-yellow-900 hover:bg-yellow-800 px-8 py-4 mr-4"
        :icon-left="isOfficial ? 'check_box' : 'check_box_outline_blank'"
        @click="toggleOfficial()"
      >
        Official
      </BaseButton>
    </template>
  </PackageEditForm>
</template>
