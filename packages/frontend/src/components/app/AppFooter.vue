<template>
  <footer
    class="text-center text-gray-700 px-8 py-16"
  >
    <div>
      <span class="inline-block mr-4">
        <router-link
          :to="{ name: 'about-privacy' }"
          class="underline"
        >Privacy &amp; Cookies</router-link>
      </span>

      <span class="inline-block mr-4">
        Follow us on
        <a
          href="https://twitter.com/awesomejsapp"
          target="_blank"
          class="underline"
        >Twitter</a>
      </span>

      <span class="inline-block mr-4">
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

    <div class="flex justify-center mt-4">
      <a
        href="https://algolia.com"
        target="_blank"
      >
        <img
          src="~@/assets/search-by-algolia-dark-background.svg"
          alt="Search by Algolia"
          class="opacity-25"
        >
      </a>
    </div>
  </footer>
</template>
