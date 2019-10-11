<template>
  <div v-if="links.length">
    <a
      v-for="(link, index) of links"
      :key="index"
      :href="link.url"
      target="_blank"
      class="inline-block py-2 mr-8 text-gray-500 hover:text-gray-400"
    >
      {{ link.label }}
      <i class="material-icons text-lg">open_in_new</i>
    </a>
  </div>
</template>

<script>
export default {
  props: {
    pkg: {
      type: Object,
      required: true,
    },
  },

  computed: {
    links () {
      const list = []
      if (this.pkg.homepage) {
        list.push({
          url: this.pkg.homepage,
          label: 'Homepage',
        })
      }
      if (this.pkg.repo) {
        list.push({
          url: this.pkg.repo,
          label: 'Repository',
        })
      }
      return list
    },
  },
}
</script>
