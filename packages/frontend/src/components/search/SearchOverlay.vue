<script>
import EmptyMessage from '../EmptyMessage.vue'
import LoadingIndicator from '../LoadingIndicator.vue'
import PackageListItem from '../pkg/PackageListItem.vue'
import ProjectTypeSelect from '../project-type/ProjectTypeSelect.vue'

import { FocusTrap } from 'focus-trap-vue'
import { ref, computed, watch, onActivated } from '@vue/composition-api'
import { useSearch } from '@/util/algolia'
import { useLockScroll } from '@/util/lock-scroll'

export default {
  components: {
    EmptyMessage,
    FocusTrap,
    LoadingIndicator,
    PackageListItem,
    ProjectTypeSelect,
  },

  setup (props, { emit, root }) {
    // Close
    function close () {
      emit('close')
    }
    watch(() => root.$route, () => close(), {
      lazy: true,
    })

    // Input

    const input = ref(null)

    function focusInput () {
      if (input.value) {
        input.value.focus()
        input.value.select()
      }
    }

    // Project type filter
    const projectTypeSlug = ref(null)
    watch(projectTypeSlug, () => focusInput())

    // Algolia

    const searchParams = computed(() => ({
      facetFilters: [
        ...projectTypeSlug.value ? [`projectType.slug:${projectTypeSlug.value}`] : [],
      ],
    }))

    const { searchText, result } = useSearch('packages', searchParams)

    // Search results

    function getRoute (hit) {
      return {
        name: 'package',
        params: {
          projectTypeSlug: hit.projectType.slug,
          packageId: hit.id,
        },
      }
    }

    const list = ref(null)
    const focusIndex = ref(0)

    watch(result, () => {
      focusIndex.value = 0
    })

    function focusPrevious () {
      if (focusIndex.value > 0) {
        focusIndex.value--
        scrollToFocused()
      }
    }

    function focusNext () {
      if (focusIndex.value < result.value.hits.length - 1) {
        focusIndex.value++
        scrollToFocused()
      }
    }

    function scrollToFocused () {
      const el = list.value.querySelector('.focused')
      el.scrollIntoViewIfNeeded ? el.scrollIntoViewIfNeeded() : el.scrollIntoView()
    }

    function selectFocused () {
      if (focusIndex.value < result.value.hits.length) {
        root.$router.push(getRoute(result.value.hits[focusIndex.value]))
      }
    }

    useLockScroll()

    // Open overlay

    function onOpen () {
      projectTypeSlug.value = root.$route.params.projectTypeSlug
      focusInput()
    }

    onOpen()
    onActivated(onOpen)

    return {
      close,
      input,
      focusInput,
      searchText,
      result,
      getRoute,
      list,
      focusIndex,
      focusPrevious,
      focusNext,
      selectFocused,
      projectTypeSlug,
    }
  },
}
</script>

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
        class="relative m-2 sm:m-4 flex-auto max-w-3xl max-h-screen box flex flex-col items-center"
      >
        <div class="lg:fixed lg:top-0 lg:right-0 lg:p-4">
          <BaseButton
            icon-left="close"
            class="px-4 py-2 text-gray-600 hover:text-gray-500 hover:bg-gray-800"
            @click="close()"
          >
            Close
          </BaseButton>
        </div>

        <div class="flex items-center w-full mt-2 sm:mt-4 lg:mt-0 mb-4 bg-black rounded">
          <input
            ref="input"
            :value="searchText"
            placeholder="Search..."
            maxlength="80"
            class="bg-transparent w-0 px-4 lg:px-8 py-4 flex-1"
            @input="searchText = $event.currentTarget.value"
            @keydown.up="focusPrevious()"
            @keydown.down="focusNext()"
            @keyup.enter="selectFocused()"
          >

          <ProjectTypeSelect
            :project-type-slug.sync="projectTypeSlug"
            placeholder="Any Project type"
            class="flex-none mx-2"
            button-class="bg-gray-800 hover:bg-gray-700 px-4 py-2"
          />
        </div>

        <LoadingIndicator
          v-if="!result"
          class="p-8"
        />

        <div
          v-else-if="result.hits.length"
          ref="list"
          class="w-full flex-1 overflow-auto"
        >
          <PackageListItem
            v-for="(hit, index) of result.hits"
            :key="hit.id"
            :pkg="hit"
            :to="getRoute(hit)"
            class="mt-4 first:mt-0 border-l-2 border-transparent"
            :class="{
              'focused': focusIndex === index,
            }"
            @mouseover.native="focusIndex = index"
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

<style lang="postcss" scoped>
.focused {
  @apply bg-gray-700;

  &.router-link-active {
    @apply bg-purple-800;
  }
}
</style>
