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

    <PopupModal
      v-if="open"
      @close="open = false"
    >
      <template #title>
        Select project type
      </template>

      <div class="flex justify-center mb-8">
        <input
          ref="input"
          v-model="searchText"
          v-focus.lazy="true"
          placeholder="Search..."
          class="bg-gray-900 px-4 py-2 rounded w-full sm:w-64"
          @keyup.enter="!$reponsive.small && filteredProjectTypes.length && select(filteredProjectTypes[0])"
        >
      </div>

      <div class="project-types-grid">
        <BaseButton
          v-for="p of filteredProjectTypes"
          :key="p.id"
          @click="select(p)"
        >
          <ProjectTypesItem
            :project-type="p"
            :selected="p === projectType"
          />
        </BaseButton>
      </div>

      <div class="h-32 sm:hidden" />
    </PopupModal>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import { projectType } from './fragments'
import PopupModal from '../PopupModal.vue'
import ProjectTypesItem from './ProjectTypesItem.vue'

export default {
  components: {
    PopupModal,
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
      searchText: '',
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

    filteredProjectTypes () {
      if (this.searchText) {
        const reg = new RegExp(this.searchText.trim(), 'i')
        return this.projectTypes.filter(p => reg.test(p.name))
      }
      return this.projectTypes
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
