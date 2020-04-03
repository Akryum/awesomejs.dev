<script>
import PageTitle from '../PageTitle.vue'

export default {
  components: {
    PageTitle,
  },

  metaInfo: {
    title: 'Contributing',
  },
}
</script>

<template>
  <div class="about-document">
    <div class="flex justify-center text-purple-500 mb-4">
      <i class="material-icons text-6xl">thumb_up</i>
    </div>

    <PageTitle center>
      Contributing Guide
    </PageTitle>

    <h3>Tags</h3>

    <p>
      Tags are used in filters and must adhere to the following requirements:
    </p>

    <ul class="list-disc my-2">
      <li class="ml-8">
        Tags describing the project type that the package is already attached to, for example vue, react, node.
      </li>

      <li class="ml-8">
        Useful to have not more than 3 tags on a package.
      </li>

      <li class="ml-8">
        Should not be redundant or variations of existing
      </li>

      <li class="ml-8">
        Must be brief and reuse existing as much as possible
      </li>
    </ul>

    <h3>Category</h3>

    <ul class="list-disc my-2">
      <li class="ml-8">
        Make sure you put things in the right category!
      </li>
    </ul>

    <h3>Documentation</h3>

    <ul class="list-disc my-2">
      <li class="ml-8">
        The documentation (README) contains a description of the project, illustration of the project with a demo or screenshots.
      </li>

      <li class="ml-8">
        The documentation is in English.
      </li>
    </ul>

    <h3>Project</h3>

    <ul class="list-disc my-2">
      <li class="ml-8">
        The project is active and maintained.
      </li>
      
      <li class="ml-8">
        Must have a link to the github repository.
      </li>
    </ul>

    <h3>Contact Us</h3>

    <p>If you have any questions about this Contributing Guide, please contact us.</p>

    <p>
      By email: guillaume@moonreach.io<br>
      On twitter: <a
        href="https://twitter.com/awesomejsapp"
        target="_blank"
        class="underline"
      >twitter.com/awesomejsapp</a>
    </p>
  </div>
</template>
