import gql from 'graphql-tag'

export const teamFragment = gql`
fragment team on Team {
  id
  name
}
`
