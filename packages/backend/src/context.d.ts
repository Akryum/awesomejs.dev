import BaseContext from '@context'
import { PassportUser } from '@nodepack/plugin-passport'
import { values } from 'faunadb'
import { User as BaseUser, UserAccount } from '@/generated/schema'
import { DBUserAccount } from './schema/user/db-types'

export interface User extends PassportUser, BaseUser {
  ref: values.Ref
  accounts: DBUserAccount[]
  projectTypeBookmarks?: string[]
}

export interface Context extends BaseContext {
  user: User
}
