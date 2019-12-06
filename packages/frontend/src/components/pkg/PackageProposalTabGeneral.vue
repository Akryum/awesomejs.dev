<script>
import gql from 'graphql-tag'

import PackageLinks from './PackageLinks.vue'
import PackageTags from './PackageTags.vue'
const PackageReadme = () => import(
  /* webpackChunkName: "PackageReadme.vue" */
  './PackageReadme.vue'
)

export default {
  components: {
    PackageLinks,
    PackageReadme,
    PackageTags,
  },

  props: {
    pkg: {
      type: Object,
      required: true,
    },
  },

  setup () {
    const readmeQuery = gql`
      query PackageProposalReadme ($id: ID!) {
        pkg: packageProposal (id: $id) {
          id
          readme
        }
      }
    `

    return {
      readmeQuery,
    }
  },
}
</script>

<template>
  <div class="mt-4">
    <PackageLinks
      :pkg="pkg"
      class="mb-4"
    />

    <PackageTags
      :pkg="pkg"
    />

    <PackageReadme
      v-if="pkg.repo"
      :package-id="pkg.id"
      :query="readmeQuery"
    />
  </div>
</template>
