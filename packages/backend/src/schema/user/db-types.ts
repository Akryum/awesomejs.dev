import { User, UserAccount } from '@/generated/schema'
import { values } from 'faunadb'

export interface DBUserAccount extends UserAccount {
  userRef: values.Ref
}

export interface DBUser extends Omit<User, 'accounts'> {
  ref: values.Ref
  accounts: DBUserAccount[]
  projectTypeBookmarks?: string[]
  teamsProjectTypes: values.Ref[]
}
