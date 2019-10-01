<template>
  <div>
    <PackageListItem
      v-for="pkg of packages"
      :key="pkg.id"
      :pkg="pkg"
    />
  </div>
</template>

<script>
import gql from 'graphql-tag'
import { pkg } from './fragments'
import PackageListItem from './PackageListItem.vue'

export default {
  components: {
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
