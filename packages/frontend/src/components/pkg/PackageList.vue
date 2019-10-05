<template>
  <div>
    <LoadingIndicator
      v-if="$apollo.loading"
      class="py-8"
    />
    <template v-else-if="packages.length">
      <PackageListItem
        v-for="pkg of packages"
        :key="pkg.id"
        :to="{
          name: 'package',
          params: { packageId: pkg.id },
        }"
        :pkg="pkg"
        class="mb-6"
      />
    </template>
    <EmptyMessage v-else>
      No package yet

      <template #cta>
        <PackageAddButton
          class="bg-gray-800 hover:bg-gray-700"
        />
      </template>
    </EmptyMessage>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import { pkg } from './fragments'
import EmptyMessage from '../EmptyMessage.vue'
import PackageAddButton from './PackageAddButton.vue'
import PackageListItem from './PackageListItem.vue'
import LoadingIndicator from '../LoadingIndicator.vue'

export default {
  components: {
    EmptyMessage,
    PackageAddButton,
    PackageListItem,
    LoadingIndicator,
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
