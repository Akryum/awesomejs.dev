import { ProjectType } from '@/generated/schema'

export interface DBProjectType extends ProjectType {
  tagMap: { [key: string]: number }
}
