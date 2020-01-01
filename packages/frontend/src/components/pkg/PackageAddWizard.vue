<script>
import PageTitle from '../PageTitle.vue'
import ProjectTypeSelect from '../project-type/ProjectTypeSelect.vue'
import UserCheckSignedIn from '../user/UserCheckSignedIn.vue'
import PackageAdded from './PackageAdded.vue'
import ErrorMessage from '../ErrorMessage.vue'

import gql from 'graphql-tag'
import { ref, reactive, computed, watch } from '@vue/composition-api'
import { useQuery, useResult, useMutation } from '@vue/apollo-composable'
import { pkgProposalFragment } from './fragments'
import { useNpmSearch } from '@/util/algolia-npm'

export default {
  components: {
    PageTitle,
    ProjectTypeSelect,
    UserCheckSignedIn,
    PackageAdded,
    ErrorMessage,
  },

  setup (props, { root }) {
    // Form data
    const projectTypeId = ref(root.$route.query.projectTypeId || null)
    const formData = reactive({
      packageName: root.$route.query.packageName || '',
      tags: '',
    })

    watch(() => root.$route, value => {
      projectTypeId.value = value.query.projectTypeId || null
      formData.packageName = value.query.packageName || ''
      autoFillFromNpm()
    })

    // Check for existing proposals & packages
    const { result, loading } = useQuery(gql`
      query PackageProposalAndPackageByName ($name: String!) {
        proposal: packageProposalByName (name: $name) {
          id
        }

        pkg: packageByName (name: $name) {
          id
        }
      }
    `, () => ({
      name: formData.packageName,
    }), () => ({
      enabled: !!formData.packageName,
      debounce: 2000,
    }))
    const proposal = useResult(result, null, data => data.proposal)
    const pkg = useResult(result, null, data => data.pkg)
    const alreadyProposed = computed(() => formData.packageName && !loading.value && proposal.value)
    const alreadyExists = computed(() => formData.packageName && !loading.value && pkg.value)

    // Form validation
    const requiredFieldsValid = computed(() => projectTypeId.value != null && !!formData.packageName)
    const valid = computed(() => requiredFieldsValid.value && !alreadyProposed.value && !alreadyExists.value)

    // Added summary
    const added = ref(false)
    const addedProposal = ref(null)

    // Submit

    const { mutate, error, loading: submitting, onDone } = useMutation(gql`
      mutation ProposePackage ($input: ProposePackageInput!) {
        proposePackage (input: $input) {
          ...pkgProposal
          projectType {
            id
            name
            slug
          }
        }
      }
      ${pkgProposalFragment}
    `)

    async function submit () {
      if (!valid.value) {
        if (!requiredFieldsValid.value) {
          error.value = `Project type and package name are required`
        }
        return
      }
      await mutate({
        input: {
          projectTypeId: projectTypeId.value,
          packageName: formData.packageName,
          tags: formData.tags.trim().split(',').map(t => t.trim()).filter(t => t.length),
        },
      })
    }

    onDone(({ data }) => {
      addedProposal.value = data.proposePackage
      added.value = true
    })

    function addAnother () {
      formData.packageName = ''
      formData.tags = ''
      added.value = false
    }

    // NPM search
    const { searchText: npmSearchText, result: npmSearchResult } = useNpmSearch({
      hitsPerPage: 5,
    })

    watch(() => formData.packageName, value => {
      npmSearchText.value = value
    })

    function selectNpmSuggestion (result) {
      formData.packageName = result.name
      formData.tags = result.keywords.join(', ')
    }

    function autoFillFromNpm () {
      if (npmSearchResult && npmSearchResult.value) {
        const hit = npmSearchResult.value.hits.find(h => h.name === formData.packageName)
        if (hit && !formData.tags) {
          selectNpmSuggestion(hit)
        }
      }
    }

    watch(npmSearchResult, () => autoFillFromNpm())

    return {
      projectTypeId,
      formData,

      alreadyProposed,
      alreadyExists,

      submit,
      submitting,
      error,

      added,
      addedProposal,
      addAnother,

      npmSearchResult,
      selectNpmSuggestion,
    }
  },
}
</script>

<template>
  <div v-if="!added">
    <UserCheckSignedIn />

    <PageTitle>
      Add a package
    </PageTitle>

    <div class="mt-4 text-gray-600">
      <i class="material-icons text-lg mr-2">thumb_up</i>
      Contribute to the awesomeness by proposing a package!
    </div>

    <div class="mt-8 max-w-lg">
      <ProjectTypeSelect
        v-model="projectTypeId"
      />

      <input
        v-model="formData.packageName"
        v-focus.lazy="true"
        placeholder="Enter package name on npm"
        maxlength="80"
        class="mt-8 bg-black px-8 py-4 rounded w-full"
      >

      <div
        v-if="alreadyProposed || alreadyExists"
        class="text-orange-500 mt-2"
      >
        <i class="material-icons text-lg mr-2">error</i>
        <span v-if="alreadyExists">This package already exists in the app</span>
        <span v-if="alreadyProposed">This package is already proposed</span>
      </div>

      <div
        v-if="npmSearchResult && npmSearchResult.hits.length"
        class="flex flex-col"
      >
        <BaseButton
          v-for="result of npmSearchResult.hits"
          :key="result.id"
          class="bg-gray-800 hover:bg-gray-700 px-8 py-4 mt-4"
          @click="selectNpmSuggestion(result)"
        >
          <div class="w-full text-left flex">
            <div class="flex-none mr-4">
              {{ result.name }}
            </div>
            <div
              v-tooltip="result.description"
              class="text-gray-600 truncate"
            >
              {{ result.description }}
            </div>
          </div>
        </BaseButton>
      </div>

      <input
        v-model="formData.tags"
        placeholder="Enter a list of tags separated with commas"
        maxlength="200"
        class="mt-8 bg-black px-8 py-4 rounded w-full"
      >

      <div class="mt-8 flex items-center justify-end">
        <BaseButton
          :loading="submitting"
          icon-left="add"
          class="bg-purple-800 hover:bg-purple-700 px-8 py-4"
          @click="submit()"
        >
          Add package
        </BaseButton>
      </div>

      <ErrorMessage
        :error="error"
        class="error-box mt-8"
      />
    </div>
  </div>
  <div v-else-if="addedProposal">
    <PackageAdded
      :proposal="addedProposal"
      @add-another="addAnother()"
    />
  </div>
</template>
