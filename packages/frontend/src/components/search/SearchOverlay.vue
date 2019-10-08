<template>
  <FocusLock>
    <div
      class="overlay fixed z-30 inset-0 flex justify-center bg-blur"
    >
      <div
        class="absolute inset-0 bg-gray-900 opacity-75"
        @click="close()"
      />

      <div
        class="relative m-8 flex-auto max-w-xl max-h-screen box flex flex-col items-center"
      >
        <BaseButton
          icon-left="close"
          class="px-4 py-1 text-gray-600 hover:text-gray-500"
          @click="close()"
        >
          Close
        </BaseButton>

        <input
          v-model="searchText"
          v-focus.lazy="true"
          placeholder="Search..."
          maxlength="80"
          class="mt-8 bg-black px-8 py-4 rounded w-full"
        >

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
            class="mt-4"
          />
        </div>

        <EmptyMessage
          v-else
        >
          No results
        </EmptyMessage>
      </div>
    </div>
  </FocusLock>
</template>

<script>
import EmptyMessage from '../EmptyMessage.vue'
import FocusLock from 'vue-focus-lock'
import LoadingIndicator from '../LoadingIndicator.vue'
import PackageListItem from '../pkg/PackageListItem.vue'
import { useSearch } from './use-search'

export default {
  components: {
    EmptyMessage,
    FocusLock,
    LoadingIndicator,
    PackageListItem,
  },

  setup (props, { emit }) {
    function close () {
      emit('close')
    }

    const {
      searchText,
      result,
    } = useSearch('packages')

    return {
      close,
      searchText,
      result,
    }
  },

  watch: {
    '$route' () {
      this.close()
    },
  },
}
</script>
