<script>
import { watch } from '@vue/composition-api'
import { useCurrentUser } from './useCurrentUser'

export default {
  setup (props, { root }) {
    const { currentUser, loading } = useCurrentUser()
    watch(currentUser, value => {
      if (!loading.value && !value) {
        root.$router.replace({ name: 'login' })
      }
    })
  },

  render (h) {
    return null
  },
}
</script>
