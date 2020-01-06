<script>
import LoadingIndicator from '../LoadingIndicator.vue'
import PackageEditForm from './PackageEditForm.vue'
import PackageEditProjectTypesForm from './PackageEditProjectTypesForm.vue'

import gql from 'graphql-tag'
import { useMutation, useQuery, useResult } from '@vue/apollo-composable'
import { pkgFragment } from './fragments'
import omit from 'lodash/omit'
import { useTags } from '@/util/tags'

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
        package (id: $id) {
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
      mutation EditPackageInfo ($input: EditPackageInfoInput!) {
        editPackageInfo (input: $input) {
          ...pkg
          dataSources {
            type
            data
          }
        }
      }
      ${pkgFragment}
    `)

    async function editPackage (data) {
      await mutate({
        input: {
          common: {
            id: props.pkg.id,
            ...data,
          },
        },
      })
    }

    // Official

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
          common: {
            id: props.pkg.id,
            info: {
              ...omit(props.pkg.info, ['__typename']),
              tags,
            },
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
      mutation EditPackageInfo ($input: EditPackageProjectTypesInput!) {
        editPackageProjectTypes (input: $input) {
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

      editPackage,
      submitting,
      error,

      isOfficial,
      toggleOfficial,

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
      @submit="editPackage"
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

    <hr class="border-gray-800 my-8 max-w-3xl">

    <PackageEditProjectTypesForm
      :pkg="pkgEditInfo"
      :submitting="submittingProjectTypes"
      :error="projectTypesError"
      @submit="editProjectTypes"
    />
  </div>
</template>
