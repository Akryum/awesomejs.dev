<script>
import { watch } from '@vue/composition-api'
import { useCurrentUser } from './useCurrentUser'
import { useRouter } from '@/util/router'

export default {
  setup (props) {
    const { currentUser, loading } = useCurrentUser()
    const router = useRouter()
    watch(currentUser, value => {
      if (!loading.value && !value) {
        router.replace({ name: 'login' })
      }
    })
  },

  render (h) {
    return null
  },
}
</script>
