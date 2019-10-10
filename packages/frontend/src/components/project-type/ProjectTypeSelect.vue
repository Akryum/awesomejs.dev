<template>
  <div>
    <BaseButton
      class="inline-block w-full"
      :class="buttonClass"
      @click="open = true"
    >
      <span v-if="!projectType">
        {{ placeholder }}
      </span>
      <span
        v-else
        class="flex items-center w-full"
      >
        <img
          :src="projectType.logo"
          :alt="`${projectType.name} logo`"
          class="w-6 h-6 mr-4"
        >
        <span class="flex-1 truncate">
          {{ projectType.name }}
        </span>
      </span>
    </BaseButton>

    <div
      v-if="open"
      class="overlay fixed z-10 inset-0 flex items-center justify-center"
    >
      <div
        class="absolute inset-0 bg-black opacity-50"
        @click="open = false"
      />

      <div
        class="relative bg-gray-800 rounded p-8 m-8 flex-auto max-w-6xl max-h-screen overflow-auto box"
      >
        <div class="project-types-grid">
          <BaseButton
            v-for="p of projectTypes"
            :key="p.id"
            @click="select(p)"
          >
            <ProjectTypesItem
              :project-type="p"
              :selected="p === projectType"
            />
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import { projectType } from './fragments'
import ProjectTypesItem from './ProjectTypesItem.vue'

export default {
  components: {
    ProjectTypesItem,
  },

  model: {
    prop: 'projectTypeId',
    event: 'update',
  },

  props: {
    projectTypeId: {
      type: String,
      default: null,
    },

    projectTypeSlug: {
      type: String,
      default: null,
    },

    placeholder: {
      type: String,
      default: 'Select a project type...',
    },

    buttonClass: {
      type: [String, Array, Object],
      default: 'bg-gray-800 hover:bg-gray-700 px-8 py-4',
    },
  },

  data () {
    return {
      open: false,
      projectTypes: [],
    }
  },

  apollo: {
    projectTypes: gql`
      query ProjectTypes {
        projectTypes {
          ...projectType
        }
      }
      ${projectType}
    `,
  },

  computed: {
    projectType () {
      return (this.projectTypes || []).find(
        p => p.id === this.projectTypeId || p.slug === this.projectTypeSlug
      )
    },
  },

  methods: {
    select (projectType) {
      if (projectType === this.projectType) {
        this.$emit('update', null)
        this.$emit('update:projectTypeSlug', null)
      } else {
        this.$emit('update', projectType.id)
        this.$emit('update:projectTypeSlug', projectType.slug)
      }
      this.open = false
    },
  },
}
</script>
