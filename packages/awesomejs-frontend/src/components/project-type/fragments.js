import gql from 'graphql-tag'

export const projectType = gql`
fragment projectType on ProjectType {
  id
  name
  slug
  logo
}
`
