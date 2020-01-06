import { useRouter } from './router'
import gql from 'graphql-tag'
import { pkgProposalFragment } from '@/components/pkg/fragments'
import { useApolloClient } from '@vue/apollo-composable'

export function useSelectNextProposal () {
  const apolloClient = useApolloClient()
  const router = useRouter()

  async function selectNext (projectTypeId, proposalId) {
    const { data } = await apolloClient.client.query({
      query: gql`
        query ProjectTypePackages ($id: ID!) {
          projectType (id: $id) {
            id
            packageProposals {
              id
            }
          }
        }
      `,
      variables: {
        id: projectTypeId,
      },
    })
    const proposals = data.projectType.packageProposals

    if (proposals.length === 1) {
      router.push({ name: 'project-type-proposals' })
    } else {
      let index = proposals.findIndex(p => p.id === proposalId)
      if (index === proposals.length - 1) {
        index = 0
      } else {
        index++
      }
      const nextProposal = proposals[index]
      if (nextProposal) {
        router.push({
          name: 'package-proposal',
          params: { packageId: nextProposal.id },
        })
      }
    }
  }

  return {
    selectNext,
  }
}

export function removeProposalFromCache (cache, projectTypeId, proposalId) {
  const query = {
    query: gql`
      query ProjectTypePackages ($id: ID!) {
        projectType (id: $id) {
          id
          packageProposals {
            ...pkgProposal
          }
        }
      }
      ${pkgProposalFragment}
    `,
    variables: {
      id: projectTypeId,
    },
  }
  const data = cache.readQuery(query)
  const list = data.projectType.packageProposals
  const index = list.findIndex(p => p.id === proposalId)
  if (index !== -1) {
    list.splice(index, 1)
    cache.writeQuery({
      ...query,
      data,
    })
  }
}
