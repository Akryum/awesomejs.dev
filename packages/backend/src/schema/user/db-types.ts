import { User, UserAccount } from '@/generated/schema'
import { User as ContextUser } from '@/context'
import { values } from 'faunadb'

export interface DBUserAccount extends UserAccount {
  userRef: values.Ref
}

export interface DBUser extends Omit<User, 'accounts'>, ContextUser {
}
