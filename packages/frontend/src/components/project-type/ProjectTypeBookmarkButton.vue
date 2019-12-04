<script>
import gql from 'graphql-tag'
import { useMutation } from '@vue/apollo-composable'

export default {
  props: {
    projectType: {
      type: Object,
      required: true,
    },
  },

  setup (props) {
    const { mutate: toggle } = useMutation(gql`
      mutation ToggleProjectTypeBookmark ($input: ToggleProjectTypeBookmarkInput!) {
        toggleProjectTypeBookmark (input: $input) {
          id
          bookmarked
        }
      }
    `, () => ({
      variables: {
        input: {
          projectTypeId: props.projectType.id,
        },
      },
      optimisticResponse: {
        __typename: 'Mutation',
        toggleProjectTypeBookmark: {
          __typename: 'ProjectType',
          id: props.projectType.id,
          bookmarked: !props.projectType.bookmarked,
        },
      },
    }))

    return {
      toggle,
    }
  },
}
</script>

<template>
  <BaseButton
    v-tooltip="projectType.bookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'"
    class="p-1 text-gray-600 hover:text-gray-500 text-xl lg:text-2xl"
    @click="toggle()"
  >
    <i class="material-icons">
      {{ projectType.bookmarked ? 'bookmark' : 'bookmark_border' }}
    </i>
  </BaseButton>
</template>
