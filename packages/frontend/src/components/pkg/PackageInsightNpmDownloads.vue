<script>
import { useQuery, useResult } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { computed } from '@vue/composition-api'
import { DateTime } from 'luxon'
import millify from 'millify'

import DotChart from '../chart/DotChart.vue'

export default {
  components: {
    DotChart,
  },

  props: {
    pkg: {
      type: Object,
      required: true,
    },
  },

  setup (props) {
    const { result, loading } = useQuery(gql`
      query PackageInsightNpmDownloads ($id: ID!) {
        pkg:${props.pkg.__typename === 'Package' ? 'package' : 'packageProposal'} (id: $id) {
          id
          insight {
            npm {
              downloadsPoints (range: month) {
                downloads
                day
              }
            }
          }
        }
      }
    `, () => ({
      id: props.pkg.id,
    }))
    const downloads = useResult(result, [], data => data.pkg.insight.npm.downloadsPoints)
    const points = computed(() => downloads.value.map(point => ({
      value: point.downloads,
      label: DateTime.fromMillis(point.day).toFormat('MMM d'),
      tooltip: `<b>${millify(point.downloads, {
        precision: 1,
      })}</b> <span class="text-gray-700">downloads on ${DateTime.fromMillis(point.day).toLocaleString()}</span>`,
    })))

    return {
      points,
      loading,
    }
  },
}
</script>

<template>
  <DotChart
    :loading="loading"
    :points="points"
    title="NPM Downloads"
    icon="cloud_download"
    class="max-w-192"
  />
</template>
