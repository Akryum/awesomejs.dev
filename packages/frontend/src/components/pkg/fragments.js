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
  info {
    tags
  }
}
`

export const pkgProposal = gql`
fragment pkgProposal on PackageProposal {
  id
  name
  description
  upvotes
  stars
  defaultLogo
  homepage
  repo
  maintainers {
    name
    email
    avatar
  }
  info {
    tags
  }
}
`
