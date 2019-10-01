<template>
  <div>
    <LoadingIndicator
      v-if="$apollo.loading"
      class="py-8"
    />
    <template v-else>
      <PackageListItem
        v-for="pkg of packages"
        :key="pkg.id"
        :pkg="pkg"
        class="mb-6"
      />
    </template>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import { pkg } from './fragments'
import LoadingIndicator from '../LoadingIndicator.vue'
import PackageListItem from './PackageListItem.vue'

export default {
  components: {
    LoadingIndicator,
    PackageListItem,
  },

  props: {
    projectTypeSlug: {
      type: String,
      required: true,
    },
  },

  data () {
    return {
      packages: [],
    }
  },

  apollo: {
    packages: {
      query: gql`
        query ProjectTypePackages ($slug: String!) {
          projectType (slug: $slug) {
            id
            packages {
              ...pkg
            }
          }
        }
        ${pkg}
      `,
      variables () {
        return {
          slug: this.projectTypeSlug,
        }
      },
      update: data => data.projectType.packages,
    },
  },
}
</script>
