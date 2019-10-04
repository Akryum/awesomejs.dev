<template>
  <BaseButton
    class="bg-gray-800 hover:bg-gray-700 px-8 py-4"
    :icon-left="pkg.bookmarked ? 'bookmark' : 'bookmark_border'"
    @click="toggle()"
  >
    {{ pkg.bookmarked ? 'Bookmarked' : 'Bookmark' }}
  </BaseButton>
</template>

<script>
import gql from 'graphql-tag'
import { checkUnauthorized } from '@/util/error'

export default {
  props: {
    packageId: {
      type: String,
      required: true,
    },
  },

  data () {
    return {
      pkg: {},
    }
  },

  apollo: {
    pkg: {
      query: gql`
        query PackageBookmarked ($id: ID!) {
          pkg: package(id: $id) {
            id
            bookmarked
          }
        }
      `,
      variables () {
        return {
          id: this.packageId,
        }
      },
    },
  },

  methods: {
    async toggle () {
      try {
        await this.$apollo.mutate({
          mutation: gql`
            mutation TogglePackageBookmark ($input: TogglePackageBookmarkInput!) {
              togglePackageBookmark (input: $input) {
                id
                bookmarked
              }
            }
          `,
          variables: {
            input: {
              packageId: this.packageId,
            },
          },
        })
      } catch (e) {
        console.error(e)
        checkUnauthorized.bind(this)(e)
      }
    },
  },
}
</script>
