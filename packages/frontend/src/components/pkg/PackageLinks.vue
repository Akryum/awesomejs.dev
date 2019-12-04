<script>
import { computed } from '@vue/composition-api'
export default {
  props: {
    pkg: {
      type: Object,
      required: true,
    },
  },

  setup (props) {
    const links = computed(() => {
      const list = []
      if (props.pkg.homepage) {
        list.push({
          url: props.pkg.homepage,
          label: 'Homepage',
        })
      }
      if (props.pkg.repo) {
        list.push({
          url: props.pkg.repo,
          label: 'Repository',
        })
      }
      return list
    })

    return {
      links,
    }
  },
}
</script>

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
