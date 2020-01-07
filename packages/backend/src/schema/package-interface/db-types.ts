import { PackageInterface } from '@/generated/schema'
import { PackageDataSources, GithubDataSource } from './data-source'
import { values } from 'faunadb'

export interface PackageMetadata<T> {
  version: number
  ts: number
  data: T
}

export interface PackageMetadatas {
  npm?: PackageMetadata<any>
  github?: PackageMetadata<any>
}

export interface DBPackageInterface extends Omit<PackageInterface, 'dataSources'> {
  ref: values.Ref
  dataSources: PackageDataSources
  metadata: PackageMetadatas

  /**
   * @deprecated
   */
  github: GithubDataSource
}
