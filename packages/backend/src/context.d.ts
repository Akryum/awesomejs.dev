import BaseContext from '@context'
import { PassportUser } from '@nodepack/plugin-passport'
import { values } from 'faunadb'
import { User as BaseUser, UserAccount } from '@/generated/schema'

export interface User extends PassportUser, BaseUser {
  accounts: DBUserAccount[]
  projectTypeBookmarks?: string[]
}

export interface DBUserAccount extends UserAccount {
  userRef: values.Ref
}

export interface Context extends BaseContext {
  user: User
  github: Octokit
}
