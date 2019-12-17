import gql from 'graphql-tag'

export const pkgFragment = gql`
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

export const pkgProposalFragment = gql`
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

export const releaseFragment = gql`
fragment release on PackageRelease {
  id
  date
  title
  tagName
  description
  prerelease
  assets {
    name
    downloadUrl
    size
  }
}
`
