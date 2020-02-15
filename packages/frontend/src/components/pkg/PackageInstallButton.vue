<script>
import { useQuery, useResult } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { computed } from '@vue/composition-api'
export default {
  props: {
    pkg: {
      type: Object,
      required: true,
    },
  },

  setup (props) {
    // Package
    const { result } = useQuery(() => gql`
      query PackageBookmarked ($id: ID!) {
        pkg: ${props.pkg.__typename === 'Package' ? 'package' : 'packageProposal'} (id: $id) {
          id
          dataSources {
            type
            data
          }
        }
      }
    `, () => ({
      id: props.pkg.id,
    }))
    const dataSources = useResult(result, [], data => data.pkg.dataSources)

    const npmDataSource = computed(() => dataSources.value.find(ds => ds.type === 'npm'))
    const npmName = computed(() => npmDataSource.value ? npmDataSource.value.data.name : null)

    // Installation

    function install () {
      if (parent) {
        parent.postMessage({
          awesomeInstall: npmName.value,
        }, '*')
      }
    }

    return {
      npmName,
      install,
    }
  },
}
</script>

<template>
  <BaseButton
    :disabled="!npmName"
    class="bg-purple-800 hover:bg-purple-700 px-8 py-4"
    icon-left="get_app"
    @click="install()"
  >
    Install
  </BaseButton>
</template>
