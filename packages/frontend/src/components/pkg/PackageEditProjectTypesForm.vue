<script>
import { ref, watch } from '@vue/composition-api'

import ErrorMessage from '../ErrorMessage.vue'
import ProjectTypeMultiSelect from '../project-type/ProjectTypeMultiSelect.vue'

export default {
  components: {
    ErrorMessage,
    ProjectTypeMultiSelect,
  },

  props: {
    pkg: {
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
        projectTypeIds: props.pkg.projectTypes.map(pt => pt.id),
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
    <div class="lg:flex items-center mt-4">
      <label
        for="github-owner"
        class="flex-none lg:mr-8 lg:w-40 text-gray-500"
      >
        Project types:
      </label>
      <ProjectTypeMultiSelect
        v-model="formData.projectTypeIds"
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
        Save project types
      </BaseButton>
    </div>

    <ErrorMessage
      :error="error"
      class="error-box mt-8"
    />
  </form>
</template>
