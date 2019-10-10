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

    <FocusTrap :active="open">
      <transition name="zoom">
        <div
          v-if="open"
          class="overlay fixed z-10 inset-0 flex flex-col items-center justify-start bg-blur p-4 sm:p-24 "
          @keyup.esc="open = false"
        >
          <div
            class="absolute inset-0 bg-gray-900 opacity-90"
            @click="open = false"
          />

          <div
            class="zoomable relative bg-gray-800 shadow-lg rounded p-4 sm:p-8 sm:pt-4 flex-1 w-full max-w-6xl max-h-screen overflow-auto box"
          >
            <div class="flex items-center mb-2 sm:mb-4 lg:mb-0">
              <div class="text-gray-600 flex-1 truncate">
                Select a project type
              </div>

              <BaseButton
                icon-left="close"
                class="px-4 -mr-4 py-1 text-gray-600 hover:text-gray-500"
                @click="open = false"
              >
                Close
              </BaseButton>
            </div>

            <div class="flex justify-center mb-8">
              <input
                ref="input"
                v-model="searchText"
                v-focus.lazy="true"
                placeholder="Search..."
                class="bg-gray-900 px-4 py-2 rounded w-full sm:w-64"
                @keyup.enter="filteredProjectTypes.length && select(filteredProjectTypes[0])"
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
          </div>
        </div>
      </transition>
    </FocusTrap>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import { projectType } from './fragments'
import ProjectTypesItem from './ProjectTypesItem.vue'
import { FocusTrap } from 'focus-trap-vue'

export default {
  components: {
    FocusTrap,
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
