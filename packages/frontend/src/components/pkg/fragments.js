import gql from 'graphql-tag'
import { projectType } from '../project-type/fragments'

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

export const pkgProposal = gql`
fragment pkgProposal on PackageProposal {
  id
  name
  tags
  projectType {
    ...projectType
  }
}
${projectType}
`
