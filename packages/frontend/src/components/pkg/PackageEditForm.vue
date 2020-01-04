<script>
import { ref, watch } from '@vue/composition-api'
import omit from 'lodash/omit'
import { useAvailableTags } from '@/util/tags'

import ErrorMessage from '../ErrorMessage.vue'
import MultiSelect from 'vue-multiselect'

export default {
  components: {
    ErrorMessage,
    MultiSelect,
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

    function findDataSource (type) {
      const dataSource = props.pkg.dataSources.find(d => d.type === type)
      return dataSource ? dataSource.data : {}
    }

    function reset () {
      formData.value = {
        info: {
          ...omit(props.pkg.info, ['__typename']),
        },
        dataSources: {
          github: {
            owner: '',
            repo: '',
            ...omit(findDataSource('github'), ['__typename']),
          },
          npm: {
            name: '',
            ...omit(findDataSource('npm'), ['__typename']),
          },
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
        dataSources: {},
      }

      // Github
      if (formData.value.dataSources.github.owner && formData.value.dataSources.github.repo) {
        result.dataSources.github = formData.value.dataSources.github
      }

      // NPM
      if (formData.value.dataSources.npm.name) {
        result.dataSources.npm = formData.value.dataSources.npm
      }

      emit('submit', result)
    }

    // Auto split Github
    const repoInput = ref()
    watch(() => formData.value.dataSources.github.owner, value => {
      if (value.includes('/')) {
        const [owner, repo] = value.split('/')
        Object.assign(formData.value.dataSources.github, {
          owner,
          repo,
        })
        repoInput.value.focus()
      }
    })

    // Available tags
    const { availableTags } = useAvailableTags(
      () => props.pkg.projectTypes[0].id,
      () => formData.value.info ? formData.value.info.tags : [],
    )

    return {
      formData,
      submit,
      repoInput,
      availableTags,
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
        for="github-owner"
        class="flex-none lg:mr-8 lg:w-40 text-gray-500"
      >
        GitHub DataSource:
      </label>

      <input
        id="github-owner"
        v-model="formData.dataSources.github.owner"
        placeholder="GitHub owner name"
        maxlength="200"
        class="mt-2 lg:mt-0 bg-black px-8 py-4 rounded w-full"
      >

      <input
        ref="repoInput"
        v-model="formData.dataSources.github.repo"
        :required="!!formData.dataSources.github.owner"
        placeholder="GitHub repository name"
        maxlength="200"
        class="mt-4 lg:mt-0 lg:ml-8 bg-black px-8 py-4 rounded w-full"
      >
    </div>

    <div class="lg:flex items-baseline mt-8">
      <label
        for="npm-name"
        class="flex-none lg:mr-8 lg:w-40 text-gray-500"
      >
        NPM DataSource:
      </label>

      <input
        id="npm-name"
        v-model="formData.dataSources.npm.name"
        placeholder="Package name on registry"
        maxlength="200"
        class="mt-2 lg:mt-0 bg-black px-8 py-4 rounded w-full"
      >
    </div>

    <div class="lg:flex items-center mt-8">
      <label
        for="tags"
        class="flex-none lg:mr-8 lg:w-40 text-gray-500"
      >
        Tags:
      </label>

      <MultiSelect
        id="tags"
        v-model="formData.info.tags"
        :options="availableTags"
        :close-on-select="false"
        multiple
        taggable
        placeholder="Enter tags"
        @tag="tag => formData.info.tags.push(tag)"
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
        Save package
      </BaseButton>
    </div>

    <ErrorMessage
      :error="error"
      class="error-box mt-8"
    />
  </form>
</template>
