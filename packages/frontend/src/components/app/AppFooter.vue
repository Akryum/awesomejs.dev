<script>
import AppSponsors from './AppSponsors.vue'

export default {
  components: {
    AppSponsors,
  },
}
</script>

<template>
  <footer
    class="text-center text-gray-700 px-8 py-16"
  >
    <AppSponsors />

    <div class="space-x-4">
      <span class="inline-block">
        <router-link
          :to="{ name: 'about-privacy' }"
          class="underline"
        >Privacy &amp; Cookies</router-link>
      </span>

      <span class="inline-block">
        <router-link
          :to="{ name: 'about-contributing' }"
          class="underline"
        >Contributing</router-link>
      </span>

      <span class="inline-block">
        Follow us on
        <a
          href="https://twitter.com/awesomejsapp"
          target="_blank"
          class="underline"
        >Twitter</a>
      </span>

      <span class="inline-block">
        Fork on
        <a
          href="https://github.com/Akryum/awesomejs.dev"
          target="_blank"
          class="underline"
        >Github</a>
      </span>

      <span class="inline-block">
        Some icons from
        <a
          href="https://icons8.com"
          target="_blank"
          class="underline"
        >icons8</a>
      </span>
    </div>
  </footer>
</template>
