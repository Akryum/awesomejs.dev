<script>
import { ref, watch } from '@vue/composition-api'
import omit from 'lodash/omit'

import ErrorMessage from '../ErrorMessage.vue'

export default {
  components: {
    ErrorMessage,
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
      type: [String, Object],
      default: null,
    },
  },

  setup (props, { emit }) {
    const formData = ref()

    function reset () {
      formData.value = {
        info: {
          ...omit(props.pkg.info, ['__typename']),
          tags: props.pkg.info.tags.join(', '),
        },
        github: {
          owner: '',
          repo: '',
          ...omit(props.pkg.github, ['__typename']),
        },
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
        info: formData.value.info,
      }

      // Tags
      result.info.tags = result.info.tags.split(',')

      // Github
      if (formData.value.github.owner && formData.value.github.repo) {
        result.github = formData.value.github
      }
      emit('submit', result)
    }

    // Auto split Github
    const repoInput = ref()
    watch(() => formData.value.github.owner, value => {
      if (value.includes('/')) {
        const [owner, repo] = value.split('/')
        Object.assign(formData.value.github, {
          owner,
          repo,
        })
        repoInput.value.focus()
      }
    })

    return {
      formData,
      submit,
      repoInput,
    }
  },
}
</script>

<template>
  <form
    class="max-w-3xl"
    @submit.prevent="submit()"
  >
    <div class="lg:flex items-baseline mt-8">
      <label
        for="github-owner"
        class="flex-none lg:mr-8 text-gray-500"
      >
        Override GitHub repo:
      </label>

      <input
        id="github-owner"
        v-model="formData.github.owner"
        placeholder="GitHub owner name"
        maxlength="200"
        class="mt-2 lg:mt-0 bg-black px-8 py-4 rounded w-full"
      >

      <input
        ref="repoInput"
        v-model="formData.github.repo"
        :required="!!formData.github.owner"
        placeholder="GitHub repository name"
        maxlength="200"
        class="mt-4 lg:mt-0 lg:ml-8 bg-black px-8 py-4 rounded w-full"
      >
    </div>

    <input
      v-model="formData.info.tags"
      placeholder="Enter a list of tags separated with commas"
      maxlength="200"
      class="mt-8 bg-black px-8 py-4 rounded w-full"
    >

    <div class="mt-8 flex items-center justify-end">
      <slot name="actions" />

      <BaseButton
        :loading="submitting"
        type="submit"
        icon-left="save"
        class="bg-purple-800 hover:bg-purple-700 px-8 py-4"
      >
        Save package
      </BaseButton>
    </div>

    <ErrorMessage
      :error="error"
      class="error-box mt-8"
    />
  </form>
</template>
