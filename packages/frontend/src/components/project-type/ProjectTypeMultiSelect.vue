<script>
import MultiSelect from 'vue-multiselect'
import gql from 'graphql-tag'
import { computed } from '@vue/composition-api'
import { useQuery, useResult } from '@vue/apollo-composable'
import { projectTypeFragment } from './fragments'

export default {
  components: {
    MultiSelect,
  },

  model: {
    prop: 'projectTypeIds',
    event: 'update',
  },

  props: {
    projectTypeIds: {
      type: Array,
      required: true,
    },
  },

  setup (props, { emit }) {
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

    const model = computed({
      get: () => projectTypes.value.filter(pt => props.projectTypeIds.includes(pt.id)),
      set: (value) => {
        emit('update', value.map(pt => pt.id))
      },
    })

    return {
      projectTypes,
      model,
    }
  },
}
</script>

<template>
  <MultiSelect
    v-model="model"
    :options="projectTypes"
    :close-on-select="false"
    label="name"
    track-by="id"
    placeholder="Select project types..."
    multiple
  >
    <template #option="{ option }">
      <div class="flex items-center">
        <img
          :src="option.logo"
          alt="logo"
          class="w-8 h-18 mr-4"
        >

        <div>
          {{ option.name }}
        </div>
      </div>
    </template>
  </MultiSelect>
</template>
