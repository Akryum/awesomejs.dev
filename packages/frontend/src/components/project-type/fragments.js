import gql from 'graphql-tag'

export const projectTypeFragment = gql`
fragment projectType on ProjectType {
  id
  name
  slug
  logo
  bookmarked
}
`
