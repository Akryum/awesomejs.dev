<template>
  <FocusTrap active>
    <div
      class="overlay fixed z-30 inset-0 flex justify-center bg-blur"
      @keyup.esc="close()"
    >
      <div
        class="absolute inset-0 bg-gray-900 opacity-90"
        @click="close()"
      />

      <div
        class="relative m-2 sm:m-8 flex-auto max-w-3xl max-h-screen box flex flex-col items-center"
      >
        <BaseButton
          icon-left="close"
          class="px-4 py-1 text-gray-600 hover:text-gray-500"
          @click="close()"
        >
          Close
        </BaseButton>

        <div class="flex w-full mt-2 sm:mt-8 mb-4">
          <input
            ref="input"
            v-model="searchText"
            placeholder="Search..."
            maxlength="80"
            class="bg-black px-8 py-4 rounded w-full flex-1 mr-4"
          >

          <ProjectTypeSelect
            :project-type-slug.sync="projectTypeSlug"
            placeholder="Any Project type"
            class="flex-none"
            button-class="bg-black hover:bg-purple-900 px-4 py-4"
          />
        </div>

        <LoadingIndicator
          v-if="!result"
          class="p-8"
        />

        <div
          v-else-if="result.hits.length"
          class="w-full flex-1 overflow-auto"
        >
          <PackageListItem
            v-for="hit of result.hits"
            :key="hit.id"
            :pkg="hit"
            :to="{
              name: 'package',
              params: {
                projectTypeSlug: hit.projectType.slug,
                packageId: hit.id,
              },
            }"
            class="mt-4 first:mt-0"
          />
        </div>

        <EmptyMessage
          v-else
        >
          No results
        </EmptyMessage>
      </div>
    </div>
  </FocusTrap>
</template>

<script>
import EmptyMessage from '../EmptyMessage.vue'
import LoadingIndicator from '../LoadingIndicator.vue'
import PackageListItem from '../pkg/PackageListItem.vue'
import ProjectTypeSelect from '../project-type/ProjectTypeSelect.vue'
import { FocusTrap } from 'focus-trap-vue'
import { useSearch } from '@/util/algolia'
import { ref, computed, watch } from '@vue/composition-api'

export default {
  components: {
    EmptyMessage,
    FocusTrap,
    LoadingIndicator,
    PackageListItem,
    ProjectTypeSelect,
  },

  setup (props, { emit }) {
    function close () {
      emit('close')
    }

    const input = ref(null)

    function focusInput () {
      if (input.value) {
        input.value.focus()
      }
    }

    const projectTypeSlug = ref(null)

    watch(projectTypeSlug, () => focusInput())

    const searchParams = computed(() => ({
      facetFilters: [
        ...projectTypeSlug.value ? [`projectType.slug:${projectTypeSlug.value}`] : [],
      ],
    }))

    const { searchText, result } = useSearch('packages', searchParams)

    return {
      close,
      input,
      focusInput,
      searchText,
      result,
      projectTypeSlug,
    }
  },

  watch: {
    '$route' () {
      this.close()
    },
  },

  created () {
    this.onOpen()
    alert('hello')
  },

  activated () {
    this.onOpen()
  },

  methods: {
    onOpen () {
      this.projectTypeSlug = this.$route.params.projectTypeSlug
      this.focusInput()
    },
  },
}
</script>
