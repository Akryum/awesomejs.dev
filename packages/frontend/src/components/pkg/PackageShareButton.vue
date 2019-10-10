<template>
  <div>
    <BaseButton
      icon-left="share"
      class="bg-gray-800 hover:bg-gray-700 px-8 py-4"
      @click="open = true"
    >
      Share
    </BaseButton>

    <PackageShareModal
      v-if="open"
      :pkg="pkg"
      @close="open = false"
    />
  </div>
</template>

<script>
const PackageShareModal = () => import(
  /* webpackChunkName: "PackageShareModal.vue" */
  './PackageShareModal.vue'
)

export default {
  components: {
    PackageShareModal,
  },

  props: {
    pkg: {
      type: Object,
      required: true,
    },
  },

  data () {
    return {
      open: false,
    }
  },
}
</script>
