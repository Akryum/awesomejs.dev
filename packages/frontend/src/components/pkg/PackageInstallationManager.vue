<script>
import { installationAvailable } from '@/util/installation'

export default {
  setup () {
    window.addEventListener('message', event => {
      if (event.data && event.data.awesomeInstallationAvailable) {
        installationAvailable.value = true
      }
    })
  },

  render () {
    return null
  },
}
</script>
