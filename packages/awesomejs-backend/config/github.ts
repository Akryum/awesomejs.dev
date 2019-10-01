import { Options } from '@octokit/rest'

export default{
  auth: process.env.GITHUB_AUTH
} as Options
