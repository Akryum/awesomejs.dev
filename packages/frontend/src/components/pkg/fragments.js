import gql from 'graphql-tag'

export const pkg = gql`
fragment pkg on Package {
  id
  name
  description
  stars
  defaultLogo
  homepage
  repo
  maintainers {
    name
    email
    avatar
  }
}
`
