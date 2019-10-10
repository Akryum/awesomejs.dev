<template>
  <LoadingIndicator
    v-if="$apollo.loading"
    class="p-8"
  />
  <div
    v-else
    class="readme overflow-hidden relative pb-8 mt-4 border-t-2 border-gray-800"
    :class="{
      expand: expand || $responsive.sm
    }"
  >
    <div
      ref="render"
      class="markdown"
      v-html="pkg.readme"
    />

    <div
      v-if="!$responsive.sm"
      class="action-overlay absolute bottom-0 left-0 w-full flex justify-center pt-6 pb-2"
      @click="expand = !expand"
    >
      <BaseButton
        class="p-1 bg-gray-800"
      >
        <i class="material-icons">{{ expand ? 'expand_less' : 'expand_more' }}</i>
      </BaseButton>
    </div>
  </div>
</template>

<script>
import LoadingIndicator from '../LoadingIndicator.vue'
import { gql } from 'apollo-server-core'

export default {
  components: {
    LoadingIndicator,
  },

  props: {
    packageId: {
      type: String,
      required: true,
    },
  },

  data () {
    return {
      expand: false,
    }
  },

  apollo: {
    pkg: {
      query: gql`
        query PackageReadme ($id: ID!) {
          pkg: package (id: $id) {
            id
            readme
          }
        }
      `,
      variables () {
        return {
          id: this.packageId,
        }
      },
    },
  },

  watch: {
    'pkg.readme': 'processRender',
  },

  methods: {
    async processRender () {
      await this.$nextTick()
      const render = this.$refs.render

      // Images
      const imgs = render.querySelectorAll('img')
      for (const img of imgs) {
        img.onload = this.onImgLoad
      }
    },

    onImgLoad (e) {
      const img = e.currentTarget
      // Badge
      if (img.offsetHeight !== 20) {
        img.classList.add('ally-bg')
      }
    },
  },
}
</script>

<style lang="postcss" scoped>
.readme {
  &:not(.expand) {
    max-height: calc(100vh - 420px);
  }
}

.action-overlay {
  background: linear-gradient(to bottom, transparent, theme('colors.gray.900'));
}
</style>
