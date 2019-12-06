<script>
import { useQuery, useResult } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { computed, ref, watch } from '@vue/composition-api'
import { isSpecialTag } from '@/util/tags'

import LoadingIndicator from '../LoadingIndicator.vue'
import PackageTag from '../pkg/PackageTag.vue'

export default {
  components: {
    LoadingIndicator,
    PackageTag,
  },

  props: {
    projectTypeId: {
      type: String,
      required: true,
    },

    selectedTags: {
      type: Array,
      default: () => [],
    },
  },

  setup (props) {
    const isOpen = ref(false)

    const { result, loading } = useQuery(gql`
      query ProjectTypeAllTags ($id: ID!) {
        projectType (id: $id) {
          id
          tags {
            id
            count
          }
        }
      }
    `, () => ({
      id: props.projectTypeId,
    }), () => ({
      enabled: !!isOpen.value,
    }))
    const tags = useResult(result, [], data => data.projectType.tags)
    const sortedTags = computed(() => tags.value.sort((a, b) => {
      if (isSpecialTag(a.id)) return -1
      if (isSpecialTag(b.id)) return 1
      return 0
    }))

    const searchText = ref('')
    const filteredTags = computed(() => {
      if (searchText.value) {
        const reg = new RegExp(searchText.value.trim().replace(/\s+/g, '|'), 'i')
        return sortedTags.value.filter(t => t.id.match(reg))
      } else {
        return sortedTags.value
      }
    })

    const searchInput = ref('')
    watch(isOpen, value => {
      if (value) {
        setTimeout(() => {
          searchInput.value.focus()
        }, 150)
      }
    })

    return {
      isOpen,
      filteredTags,
      loading,
      searchText,
      searchInput,
    }
  },
}
</script>

<template>
  <VDropdown
    placement="bottom-end"
    class="h-6"
    @update:open="value => isOpen = value"
  >
    <BaseButton v-tooltip="'See all tags'">
      <PackageTag tag="...">
        <i class="material-icons">more_horiz</i>
      </PackageTag>
    </BaseButton>

    <template #popper>
      <div>
        <input
          ref="searchInput"
          v-model="searchText"
          placeholder="Search..."
          maxlength="200"
          class="bg-black px-4 py-2 rounded w-full mb-2"
        >

        <div class="scroller w-64 flex flex-col items-stretch overflow-y-scroll">
          <LoadingIndicator
            v-if="loading"
            class="flex-1"
          />
          <template v-else>
            <BaseButton
              v-for="tag of filteredTags"
              :key="tag.id"
              class="px-4 py-2 text-gray-500 bg-gray-800 hover:bg-gray-700 rounded flex-none mb-2"
              :class="{
                'text-purple-300 bg-purple-800 hover:bg-purple-700': selectedTags.includes(tag.id),
              }"
              @click="$emit('select', tag.id)"
            >
              <div class="flex items-start w-full">
                <span class="flex-1 text-left truncate mr-2">{{ tag.id }}</span>
                <span class="opacity-50">{{ tag.count }}</span>
              </div>
            </BaseButton>
          </template>
        </div>
      </div>
    </template>
  </VDropdown>
</template>

<style lang="postcss" scoped>
.scroller {
  min-height: 200px;
  max-height: 400px;
}
</style>
