<template>
  <div v-if="projectType">
    <PageTitle
      v-if="!$responsive.md || !packageId"
      :back-to="{ name: 'home' }"
      class="mb-4"
    >
      Awesome {{ projectType.name }} packages

      <template #after>
        <div
          v-if="tags.length"
          class="mt-4 xl:mt-0 flex flex-wrap justify-stretch -mr-2"
        >
          <i class="material-icons text-gray-600 mr-2 text-xl flex-none">filter_list</i>
          <BaseButton
            v-for="tag of tags"
            :key="tag"
            class="mr-2 px-2 text-gray-500 bg-gray-800 hover:bg-gray-700 mb-2 flex-auto xl:mb-0"
            :class="{
              'text-purple-300 bg-purple-800 hover:bg-purple-700': selectedTags.includes(tag),
            }"
            @click="toggleTag(tag)"
          >
            {{ tag }}
          </BaseButton>
        </div>
      </template>
    </PageTitle>

    <div class="flex">
      <div
        v-if="!$responsive.md || !packageId"
        class="w-full lg:w-1/3 lg:pb-64"
      >
        <ProjectTypePackageProposalsButton
          :project-type-id="projectType.id"
          class="w-full mb-4 sm:mb-6"
        />

        <PackageList
          :project-type-slug="projectType.slug"
          :tags="selectedTags"
        />
      </div>

      <div
        v-if="!$responsive.md || packageId"
        class="w-full lg:w-2/3 lg:pl-16 lg:sticky lg:top-0 lg:max-h-screen lg:overflow-y-auto"
      >
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import PageTitle from '../PageTitle.vue'
import PackageList from '../pkg/PackageList.vue'
import ProjectTypePackageProposalsButton from './ProjectTypePackageProposalsButton.vue'
import gql from 'graphql-tag'
import { projectType } from './fragments'

export default {
  components: {
    PageTitle,
    PackageList,
    ProjectTypePackageProposalsButton,
  },

  props: {
    projectTypeSlug: {
      type: String,
      required: true,
    },

    packageId: {
      type: String,
      default: null,
    },
  },

  data () {
    return {
      tags: [],
      selectedTags: [],
    }
  },

  apollo: {
    projectType: {
      query: gql`
        query ProjectType ($slug: String!) {
          projectType: projectTypeBySlug (slug: $slug) {
            ...projectType
          }
        }
        ${projectType}
      `,
      variables () {
        return {
          slug: this.projectTypeSlug,
        }
      },
    },

    tags: {
      query: gql`
        query ProjectTypeTags ($slug: String!) {
          projectTypeBySlug (slug: $slug) {
            id
            popularTags
          }
        }
      `,
      variables () {
        return {
          slug: this.projectTypeSlug,
        }
      },
      update: data => data.projectTypeBySlug.popularTags,
    },
  },

  methods: {
    toggleTag (tag) {
      const index = this.selectedTags.indexOf(tag)
      if (index === -1) {
        this.selectedTags.push(tag)
      } else {
        this.selectedTags.splice(index, 1)
      }
    },
  },
}
</script>
