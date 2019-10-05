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
        v-model="packageName"
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

      <input
        v-model="tags"
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
        class="p-4 border border-red-700 rounded mt-8"
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

<script>
import PageTitle from '../PageTitle.vue'
import ProjectTypeSelect from '../project-type/ProjectTypeSelect.vue'
import UserCheckSignedIn from '../user/UserCheckSignedIn.vue'
import PackageAdded from './PackageAdded.vue'
import ErrorMessage from '../ErrorMessage.vue'
import gql from 'graphql-tag'
import { pkgProposal } from './fragments'

export default {
  components: {
    PageTitle,
    ProjectTypeSelect,
    UserCheckSignedIn,
    PackageAdded,
    ErrorMessage,
  },

  data () {
    return {
      added: false,
      projectTypeId: this.$route.query.projectTypeId || null,
      packageName: '',
      tags: '',
      addedProposal: null,
      submitting: false,
      error: null,
    }
  },

  apollo: {
    proposal: {
      query: gql`
        query PackageProposal ($name: String!) {
          proposal: packageProposal (name: $name) {
            id
          }
        }
      `,
      variables () {
        return {
          name: this.packageName,
        }
      },
      skip () {
        return !this.packageName
      },
    },

    pkg: {
      query: gql`
        query PackageProposal ($name: String!) {
          pkg: packageByName (name: $name) {
            id
          }
        }
      `,
      variables () {
        return {
          name: this.packageName,
        }
      },
      skip () {
        return !this.packageName
      },
    },
  },

  computed: {
    alreadyProposed () {
      return this.packageName && this.proposal && !this.$apollo.loading
    },

    alreadyExists () {
      return this.packageName && this.pkg && !this.$apollo.loading
    },

    validRequired () {
      return this.projectTypeId != null && !!this.packageName
    },

    valid () {
      return this.validRequired && !this.alreadyProposed && !this.alreadyExists
    },
  },

  methods: {
    async submit () {
      this.error = null
      if (!this.valid) {
        if (!this.validRequired) {
          this.error = `Project type and package name are required`
        }
        return
      }
      this.submitting = true
      try {
        const { data } = await this.$apollo.mutate({
          mutation: gql`
            mutation ProposePackage ($input: ProposePackageInput!) {
              proposePackage (input: $input) {
                ...pkgProposal
              }
            }
            ${pkgProposal}
          `,
          variables: {
            input: {
              projectTypeId: this.projectTypeId,
              packageName: this.packageName,
              tags: this.tags.trim().split(',').map(t => t.trim()).filter(t => t.length),
            },
          },
        })
        this.addedProposal = data.proposePackage
        this.added = true
      } catch (e) {
        this.error = e
      }
      this.submitting = false
    },

    addAnother () {
      this.packageName = ''
      this.tags = ''
      this.added = false
    },
  },
}
</script>
