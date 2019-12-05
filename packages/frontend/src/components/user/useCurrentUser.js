import gql from 'graphql-tag'
import { useQuery, useResult } from '@vue/apollo-composable'
import { userFragment } from './fragments'
import { computed } from '@vue/composition-api'

export function useCurrentUser () {
  const { result, loading } = useQuery(gql`
    query CurrentUser {
      currentUser {
        ...user
      }
    }
    ${userFragment}
  `)

  const currentUser = useResult(result)

  const isAdmin = computed(() => currentUser.value && currentUser.value.admin)

  return {
    currentUser,
    isAdmin,
    loading,
  }
}
