<script>
import PackageLinks from './PackageLinks.vue'
import PackageTags from './PackageTags.vue'

export default {
  components: {
    PackageLinks,
    PackageTags,
  },

  props: {
    pkg: {
      type: Object,
      required: true,
    },
  },
}
</script>

<template>
  <div>
    <PackageLinks
      :pkg="pkg"
      class="mb-4"
    />

    <PackageTags
      :pkg="pkg"
    />
  </div>
</template>
