<template>
  <div class="document">
    <div class="flex justify-center text-purple-500 mb-4">
      <i class="material-icons text-6xl">verified_user</i>
    </div>

    <PageTitle class="mb-12 justify-center">
      Privacy &amp; Security
    </PageTitle>

    <h2>🍪️ Cookies</h2>

    <p>
      Cookies necessary for the application to work may be stored on your device. By using this application you agree with the usage of those cookies.
    </p>

    <p>
      List of the first-party 🍪️ cookies:
    </p>

    <ul class="list-disc my-2">
      <li class="ml-8">
        <span class="font-mono text-purple-300">user-session</span>: used to store your authentified session allowing you to be logged in and interact with your user account.
      </li>

      <li class="ml-8">
        <span class="font-mono text-purple-300">user-session-sig</span>: used to sign and verify the above <span class="font-mono">user-session</span> cookie to prevent tampering.
      </li>
    </ul>

    <h2>Privacy Policy</h2>

    <p class="text-gray-500">
      Last updated: 8th October 2019
    </p>

    <p>Guillaume Chau - Akryum ("us", "we", or "our") operates https://awesomesj.dev (the "Site"). This page informs you of our policies regarding the collection, use and disclosure of Personal Information we receive from users of the Site.</p>

    <p>We take Personal Information security and privacy very seriously.</p>

    <p>We use your Personal Information only for providing and improving the Site. By using the Site, you agree to the collection and use of information in accordance with this policy.</p>

    <h3>Information Processing Supervisor</h3>

    <p>The supervisor of Information and Data Processing mentioned in this document is Mr Guillaume Chau - Akryum.</p>

    <h3>Information for European Union users</h3>

    <p>By using the Site and providing your information, you authorize us to collect, use, and store your information outside of the European Union.</p>

    <h3>Information Collection And Use</h3>

    <p>While using our Site, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you. Personally identifiable information may include, but is not limited to your names and email addresses ("Personal Information").</p>

    <p>This Personal Information will be used to identify your content and allow other users of the Site to identify your content. Personal Information will not be used for other means than the Site functionality. Personal Information will not be sold to third-parties.</p>

    <p>We don't collect any sensitive data about you. Sensitive data: racial or ethnical origin, political positions, religious or philosophical beliefs, work union membership, data related to health or sexual orientation. If any sensitive data about you would be sent to us or the Site, they will be deleted.</p>

    <p>This Personal Information will be stored as long as you have a user account registered on the Site. You can ask us anytime to delete your user account and all associated Personal Information by contacting us (see "Contact Us" section below).</p>

    <h3>Communications</h3>

    <p>We may use your Personal Information to contact you with newsletters, marketing or promotional materials and other information that you opted to, like notifications and other transactional emails. You can unsubscribe anytime from our communications by clicking in the "Unsubscribe" link in the emails or by contacting us (see "Contact Us" section below).</p>

    <h3>Cookies</h3>

    <p>Cookies are files with small amount of data, which may include an anonymous unique identifier. Cookies are sent to your browser from a web site and stored on your computer's hard drive.</p>

    <p>Like many sites, we use "cookies" to collect information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Site.</p>

    <h3>Security</h3>

    <p>The security of your Personal Information is important to us, but remember that no method of transmission over the Internet, or method of electronic storage, is 100% secure. While we strive to use commercially acceptable means to protect your Personal Information, we cannot guarantee its absolute security.</p>

    <h3>Hosting</h3>

    <p>All data processed and stored by the Site is hosted on Amazon Web Services and Google Cloud. They are provided by intermediaries such as Zeit Now and FaunaDB. The hosting locations may vary and be worldwide, in order to provide the best performance and ensure the Site functionality is best quality possible. Hosting data processed by the Site physically closer to you improves the Site performance for your experience.</p>

    <h3>Changes To This Privacy Policy</h3>

    <p>This Privacy Policy is effective as of 8th October 2019 and will remain in effect except with respect to any changes in its provisions in the future, which will be in effect immediately after being posted on this page.</p>

    <p>We reserve the right to update or change our Privacy Policy at any time and you should check this Privacy Policy periodically. Your continued use of the Service after we post any modifications to the Privacy Policy on this page will constitute your acknowledgment of the modifications and your consent to abide and be bound by the modified Privacy Policy.</p>

    <p>If we make any material changes to this Privacy Policy, we will notify you either through the email address you have provided us, or by placing a prominent notice on our website.</p>

    <h3>Contact Us</h3>

    <p>If you have any questions about this Privacy Policy, please contact us.</p>

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

<script>
import PageTitle from '../PageTitle.vue'

export default {
  components: {
    PageTitle,
  },
}
</script>
