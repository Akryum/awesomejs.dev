import gql from 'graphql-tag'
import { useQuery, useResult } from '@vue/apollo-composable'
import { userFragment } from './fragments'

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

  return {
    currentUser,
    loading,
  }
}
