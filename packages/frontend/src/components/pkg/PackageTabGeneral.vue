<template>
  <div>
    <PackageLinks
      :pkg="pkg"
      class="mb-4"
    />

    <PackageTags
      :pkg="pkg"
    />

    <PackageReadme
      :package-id="pkg.id"
    />
  </div>
</template>

<script>
import PackageLinks from './PackageLinks.vue'
import PackageReadme from './PackageReadme.vue'
import PackageTags from './PackageTags.vue'

export default {
  components: {
    PackageLinks,
    PackageReadme,
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
