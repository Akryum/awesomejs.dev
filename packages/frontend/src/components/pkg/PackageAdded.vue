<script>
import PageTitle from '../PageTitle.vue'

export default {
  components: {
    PageTitle,
  },

  props: {
    proposal: {
      type: Object,
      required: true,
    },
  },
}
</script>

<template>
  <div class="max-w-lg">
    <PageTitle>
      {{ proposal.projectType.name }} package submitted!
    </PageTitle>

    <div class="flex items-center my-8">
      <i class="material-icons text-4xl text-purple-500 mr-4">check_circle_outline</i>
      <div>
        Thanks for submitting this package!<br>
        It will appear in the list when it's approved.<br>
        Meanwhile, people can upvote your proposal, so <router-link
          :to="{
            name: 'package-proposal',
            params: {
              projectTypeSlug: proposal.projectType.slug,
              packageId: proposal.id,
            }
          }"
          target="_blank"
          class="text-purple-500 hover:text-purple-400"
        >
          share it
        </router-link>!
      </div>
    </div>

    <div class="text-gray-500">
      <div>
        Name:
        <span class="text-white">{{ proposal.name }}</span>
      </div>
      <div>
        Tags:
        <span class="text-white">{{ proposal.info.tags.join(', ') }}</span>
      </div>
    </div>

    <div class="mt-8 flex items-center justify-end">
      <BaseButton
        icon-left="add"
        class="px-8 py-4 bg-gray-800 hover:bg-gray-700 mr-4"
        @click="$emit('add-another')"
      >
        Add another
      </BaseButton>

      <BaseButton
        :to="{
          name: 'package-proposal',
          params: {
            projectTypeSlug: proposal.projectType.slug,
            packageId: proposal.id,
          }
        }"
        class="px-8 py-4 bg-purple-800 hover:bg-purple-700"
      >
        View proposal
      </BaseButton>
    </div>
  </div>
</template>
