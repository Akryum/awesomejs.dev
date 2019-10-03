<script>
import gql from 'graphql-tag'
import { user } from './fragments'

export default {
  apollo: {
    user: {
      query: gql`
        query CurrentUser {
          user: currentUser {
            ...user
          }
        }
        ${user}
      `,
      result () {
        if (!this.user) {
          this.$router.replace({ name: 'login' })
        }
      },
    },
  },

  render (h) {
    return null
  },
}
</script>
