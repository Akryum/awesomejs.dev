<script>
import { ref, watch } from '@vue/composition-api'

import ErrorMessage from '../ErrorMessage.vue'
import ProjectTypeMultiSelect from '../project-type/ProjectTypeMultiSelect.vue'
import UserMultiSelect from './UserMultiSelect.vue'

export default {
  components: {
    ErrorMessage,
    ProjectTypeMultiSelect,
    UserMultiSelect,
  },

  props: {
    team: {
      type: Object,
      required: true,
    },

    submitting: {
      type: Boolean,
      default: false,
    },

    error: {
      type: [String, Object, Error],
      default: null,
    },
  },

  setup (props, { emit }) {
    const formData = ref()

    function reset () {
      formData.value = {
        name: props.team.name,
        projectTypeIds: props.team.projectTypes.map(pt => pt.id),
        userIds: props.team.users.map(u => u.id),
      }
    }
    reset()
    // Auto reset after submit
    watch(() => props.submitting, value => {
      if (!value && !props.error) {
        reset()
      }
    }, {
      lazy: true,
    })

    function submit () {
      const result = {
        ...formData.value,
      }
      emit('submit', result)
    }

    return {
      formData,
      submit,
    }
  },
}
</script>

<template>
  <form
    class="max-w-3xl"
    @submit.prevent="submit()"
  >
    <div class="lg:flex items-baseline mt-4">
      <label
        for="team-name"
        class="flex-none lg:mr-8 lg:w-40 text-gray-500"
      >
        Name:
      </label>

      <input
        id="team-name"
        v-model="formData.name"
        placeholder="Team name"
        maxlength="200"
        class="mt-2 lg:mt-0 bg-black px-8 py-4 rounded w-full"
      >
    </div>

    <div class="lg:flex items-center mt-8">
      <label
        for="projectTypes"
        class="flex-none lg:mr-8 lg:w-40 text-gray-500"
      >
        Project types:
      </label>

      <ProjectTypeMultiSelect
        id="projectTypes"
        v-model="formData.projectTypeIds"
      />
    </div>

    <div class="lg:flex items-center mt-8">
      <label
        for="users"
        class="flex-none lg:mr-8 lg:w-40 text-gray-500"
      >
        Users:
      </label>

      <UserMultiSelect
        id="users"
        v-model="formData.userIds"
      />
    </div>

    <div class="mt-8 flex items-center justify-end">
      <slot name="actions" />

      <BaseButton
        :loading="submitting"
        type="submit"
        icon-left="save"
        class="bg-purple-800 hover:bg-purple-700 px-8 py-4"
      >
        Save team
      </BaseButton>
    </div>

    <ErrorMessage
      :error="error"
      class="error-box mt-8"
    />
  </form>
</template>
