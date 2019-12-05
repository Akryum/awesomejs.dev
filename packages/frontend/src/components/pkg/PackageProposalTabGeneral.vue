<script>
import { gql } from 'apollo-server-core'

import ErrorMessage from '../ErrorMessage.vue'
import PackageLinks from './PackageLinks.vue'
import PackageTags from './PackageTags.vue'
const PackageReadme = () => import(
  /* webpackChunkName: "PackageReadme.vue" */
  './PackageReadme.vue'
)

export default {
  components: {
    ErrorMessage,
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
  <div>
    <PackageLinks
      :pkg="pkg"
      class="my-4"
    />

    <PackageTags
      :pkg="pkg"
    />

    <ErrorMessage
      v-if="!pkg.repo"
      error="No GitHub repository found"
      class="error-box mt-8"
    />

    <PackageReadme
      v-else
      :package-id="pkg.id"
      :query="readmeQuery"
    />
  </div>
</template>
