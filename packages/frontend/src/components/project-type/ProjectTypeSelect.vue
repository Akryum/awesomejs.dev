<script>
import ProjectTypesItem from './ProjectTypesItem.vue'
import PopupModal from '../PopupModal.vue'

import gql from 'graphql-tag'
import { ref, computed } from '@vue/composition-api'
import { useQuery, useResult } from '@vue/apollo-composable'
import { projectTypeFragment } from './fragments'

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

  setup (props, { emit }) {
    const open = ref(false)

    // Project types
    const { result } = useQuery(gql`
      query ProjectTypes {
        projectTypes {
          ...projectType
        }
      }
      ${projectTypeFragment}
    `)
    const projectTypes = useResult(result, [])

    // Search
    const searchText = ref('')
    const filteredProjectTypes = computed(() => {
      if (searchText.value) {
        const reg = new RegExp(searchText.value.trim(), 'i')
        return projectTypes.value.filter(p => reg.test(p.name))
      }
      return projectTypes.value
    })

    // Current
    const currentProjectType = computed(() => projectTypes.value.find(
      p => p.id === props.projectTypeId || p.slug === props.projectTypeSlug
    ))

    // Select
    function select (selectedProjectType) {
      if (selectedProjectType === currentProjectType.value) {
        emit('update', null)
        emit('update:projectTypeSlug', null)
      } else {
        emit('update', selectedProjectType.id)
        emit('update:projectTypeSlug', selectedProjectType.slug)
      }
      this.open = false
    }

    return {
      open,

      currentProjectType,

      searchText,
      filteredProjectTypes,

      select,
    }
  },
}
</script>

<template>
  <div>
    <BaseButton
      class="inline-block w-full"
      :class="buttonClass"
      @click="open = true"
    >
      <span v-if="!currentProjectType">
        {{ placeholder }}
      </span>
      <span
        v-else
        class="flex items-center w-full"
      >
        <img
          :src="currentProjectType.logo"
          :alt="`${currentProjectType.name} logo`"
          class="w-6 h-6 mr-4"
        >
        <span class="flex-1 truncate">
          {{ currentProjectType.name }}
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
          @keyup.enter="!$responsive.small && filteredProjectTypes.length && select(filteredProjectTypes[0])"
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
            :selected="p === currentProjectType"
          />
        </BaseButton>
      </div>

      <div class="h-32 sm:hidden" />
    </PopupModal>
  </div>
</template>
