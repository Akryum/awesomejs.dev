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

<script>
import gql from 'graphql-tag'
export default {
  props: {
    projectType: {
      type: Object,
      required: true,
    },
  },

  methods: {
    async toggle () {
      await this.$apollo.mutate({
        mutation: gql`
          mutation ToggleProjectTypeBookmark ($input: ToggleProjectTypeBookmarkInput!) {
            toggleProjectTypeBookmark (input: $input) {
              id
              bookmarked
            }
          }
        `,
        variables: {
          input: {
            projectTypeId: this.projectType.id,
          },
        },
        optimisticResponse: {
          __typename: 'Mutation',
          toggleProjectTypeBookmark: {
            __typename: 'ProjectType',
            id: this.projectType.id,
            bookmarked: !this.projectType.bookmarked,
          },
        },
      })
    },
  },
}
</script>
