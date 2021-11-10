<script>
import gql from 'graphql-tag'
import { ref, reactive, computed } from '@vue/composition-api'
import { useQuery, useResult, useMutation } from '@vue/apollo-composable'
import ProjectTypesGrid from './ProjectTypesGrid.vue'

import ErrorMessage from '../ErrorMessage.vue'
import PageTitle from '../PageTitle.vue'
import UserCheckSignedIn from '../user/UserCheckSignedIn.vue'

export default {
  components: {
    ErrorMessage,
    PageTitle,
    UserCheckSignedIn,
    ProjectTypesGrid,
  },

  setup ({ root }) {
    // Form data
    const formData = reactive({
      name: '',
    })

    // Check for existing proposals & packages
    const { result, loading } = useQuery(gql`
      query ProjectProposalAndProjectByName ($slug: String!) {
        proposal: projectProposalBySlug (slug: $slug) {
          id
          slug
        }

        project: projectTypeBySlug (slug: $slug) {
          id
          slug
        }
      }
    `, () => ({
      slug: formData.name.toLowerCase(),
    }), () => ({
      enabled: !!formData.name,
      debounce: 2000,
    }))

    const proposal = useResult(result, null, data => data.proposal)
    const project = useResult(result, null, data => data.project)

    const alreadyProposed = computed(() => formData.name && !loading.value && proposal.value)
    const alreadyExists = computed(() => formData.name && !loading.value && project.value)

    // Form validation
    const requiredFieldsValid = computed(() => !!formData.name)
    const valid = computed(() => requiredFieldsValid.value && !alreadyProposed.value && !alreadyExists.value)

    // Added summary
    const added = ref(false)
    const addedProposal = ref(null)
    const proposals = ref([])

    // List project proposal
    const { onResult } = useQuery(gql`
      query projectProposals {
        projectProposals {
          id
          name
          logo
          slug
        }
      }
    `)

    onResult(({ data }) => {
      proposals.value = data.projectProposals
    })

    // Submit

    const { mutate, error, loading: submitting, onDone } = useMutation(gql`
      mutation ProposeProject ($input: ProposeProjectInput!) {
        proposeProject (input: $input) {
          id,
          name,
          logo,
          slug,
        }
      }
    `)

    async function submit () {
      if (!valid.value) {
        if (!requiredFieldsValid.value) {
          error.value = `Project name are required`
        }
        return
      }
      await mutate({
        input: {
          name: formData.name,
        },
      })
    }

    onDone(({ data }) => {
      proposals.value.push(data.proposeProject)
      addedProposal.value = data.name
      added.value = true
    })

    return {
      formData,

      alreadyProposed,
      proposal,
      alreadyExists,
      project,

      submit,
      submitting,
      error,

      added,
      addedProposal,

      proposals,
    }
  },
}
</script>

<template>
  <div>
    <UserCheckSignedIn />

    <div class="flex">
      <div class="w-1/3 mr-4">
        <PageTitle>
          Add a project
        </PageTitle>
        <div class="mt-4 mb-8 text-gray-600">
          <i class="material-icons text-lg mr-2">thumb_up</i>
          Contribute by proposing a project!
        </div>
        <input
          v-model="formData.name"
          v-focus.lazy="true"
          placeholder="Enter organization name on GitHub"
          maxlength="80"
          class="bg-black px-8 py-4 rounded w-full"
        >

        <div
          v-if="alreadyProposed || alreadyExists"
          class="text-orange-500 mt-4"
        >
          <i class="material-icons text-lg mr-2">error</i>
          <span v-if="alreadyExists">This project already exists in the app:</span>
          <span v-if="alreadyProposed">This project is already proposed:</span>
        </div>

        <div class="mt-8 flex items-center justify-end">
          <BaseButton
            :loading="submitting"
            icon-left="add"
            class="bg-purple-800 hover:bg-purple-700 px-8 py-4"
            @click="submit()"
          >
            Add project
          </BaseButton>
        </div>

        <ErrorMessage
          :error="error"
          class="error-box mt-8"
        />
      </div>

      <div class="ml-4 w-2/3">
        <PageTitle class="mb-4">
          Proposed project
        </PageTitle>
        <ProjectTypesGrid
          v-if="proposals.length"
          :project-types="proposals"
          :project-component-item="'ProjectProposalItem'"
        />
      </div>
    </div>
  </div>
</template>
