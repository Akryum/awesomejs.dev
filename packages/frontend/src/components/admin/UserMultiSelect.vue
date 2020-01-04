<script>
import MultiSelect from 'vue-multiselect'
import gql from 'graphql-tag'
import { computed } from '@vue/composition-api'
import { useQuery, useResult } from '@vue/apollo-composable'

export default {
  components: {
    MultiSelect,
  },

  model: {
    prop: 'userIds',
    event: 'update',
  },

  props: {
    userIds: {
      type: Array,
      required: true,
    },
  },

  setup (props, { emit }) {
    // Project types
    const { result } = useQuery(gql`
      query ProjectTypes {
        allUsers {
          id
          nickname
          email
        }
      }
    `)
    const users = useResult(result, [])

    const model = computed({
      get: () => users.value.filter(u => props.userIds.includes(u.id)),
      set: (value) => {
        emit('update', value.map(u => u.id))
      },
    })

    return {
      users,
      model,
    }
  },
}
</script>

<template>
  <MultiSelect
    v-model="model"
    :options="users"
    :close-on-select="false"
    label="nickname"
    track-by="id"
    placeholder="Select users..."
    multiple
  >
    <template #option="{ option }">
      <div class="flex items-baseline">
        <div class="mr-4">
          {{ option.nickname }}
        </div>
        <div class="text-gray-500">
          {{ option.email }}
        </div>
      </div>
    </template>
  </MultiSelect>
</template>
