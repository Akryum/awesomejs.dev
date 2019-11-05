import BaseContext from '@context'
import { PassportUser } from '@nodepack/plugin-passport'

export interface User extends PassportUser {
  projectTypeBookmarks?: string[]
}

export interface Context extends BaseContext {
  user: User
  github: Octokit
}
