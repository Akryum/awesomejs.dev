import { values } from 'faunadb'
import { PackageProposal } from '@/generated/schema'

export interface DBPackageProposal extends PackageProposal {
  projectTypeRef: values.Ref
  userRef: values.Ref
}
