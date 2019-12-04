<script>
import gql from 'graphql-tag'
import { useQuery, useResult, useMutation } from '@vue/apollo-composable'

export default {
  props: {
    packageId: {
      type: String,
      required: true,
    },
  },

  setup (props) {
    // Package
    const { result, loading } = useQuery(gql`
      query PackageBookmarked ($id: ID!) {
        pkg: package(id: $id) {
          id
          bookmarked
        }
      }
    `, () => ({
      id: props.packageId,
    }))
    const pkg = useResult(result, {})

    // Toggle
    const { mutate: toggle } = useMutation(gql`
      mutation TogglePackageBookmark ($input: TogglePackageBookmarkInput!) {
        togglePackageBookmark (input: $input) {
          id
          bookmarked
        }
      }
    `, () => ({
      variables: {
        input: {
          packageId: props.packageId,
        },
      },
      optimisticResponse: {
        __typename: 'Mutation',
        togglePackageBookmark: {
          __typename: 'Package',
          id: props.packageId,
          bookmarked: !pkg.value.bookmarked,
        },
      },
    }))

    return {
      pkg,
      loading,
      toggle,
    }
  },
}
</script>

<template>
  <BaseButton
    :disabled="loading"
    class="bg-gray-800 hover:bg-gray-700 px-8 py-4"
    :icon-left="pkg.bookmarked ? 'bookmark' : 'bookmark_border'"
    @click="toggle()"
  >
    {{ pkg.bookmarked ? 'Bookmarked' : 'Bookmark' }}
  </BaseButton>
</template>
