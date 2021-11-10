import gql from 'graphql-tag'
import { query as q, values } from 'faunadb'
import { Resolvers } from '@/generated/schema'
import { isSpecialTag } from '@awesomejs/shared-utils/tags'
import { DBProjectType } from './db-types'
import { mapDocument, mapDocuments } from '@/util/fauna'
import { hasTeamAccess } from '../team/team-access'

export const typeDefs = gql`
type ProjectType {
  id: ID!
  name: String!
  slug: String!
  logo: String!
  popularTags: [Tag!]!
  tags: [Tag!]!
  inTeam: Boolean!
}

type Tag {
  id: ID!
  count: Int!
}

extend type Query {
  projectTypes: [ProjectType!]!
  projectType (id: ID!): ProjectType
  projectTypeBySlug (slug: String!): ProjectType
}
`

function getSortedTags (projectType: DBProjectType) {
  return Object.keys(projectType.tagMap).filter(
    (key) => key !== projectType.name.toLowerCase(),
  ).map((key) => ({
    id: key,
    count: projectType.tagMap[key],
  })).sort(
    (a, b) => {
      if (isSpecialTag(a.id)) { return -1 }
      if (isSpecialTag(b.id)) { return 1 }
      return b.count - a.count
    },
  )
}

export const resolvers: Resolvers = {
  ProjectType: {
    popularTags: (projectType) => {
      return getSortedTags(projectType).slice(0, 8)
    },

    tags: (projectType) => {
      return getSortedTags(projectType)
    },

    inTeam: (projectType, args, ctx) => hasTeamAccess(ctx, projectType.id),
  },

  Query: {
    projectTypes: async (root, args, ctx) => {
      const { data } = await ctx.db.query(
        q.Map(
          q.Paginate(
            q.Match(q.Index('projecttypes_sort_by_name_asc')),
          ),
          q.Lambda(['name', 'ref'], q.Get(q.Var('ref'))),
        ),
      )
      return mapDocuments(data)
    },

    projectType: async (root, { id }, ctx) => {
      const doc = await ctx.db.query<values.Document<any>>(
        q.Get(q.Ref(q.Collection('ProjectTypes'), id)),
      )
      return mapDocument(doc)
    },

    projectTypeBySlug: async (root, { slug }, ctx) => {
      try {
        const doc = await ctx.db.query<values.Document<any>>(
          q.Get(q.Match(q.Index('projecttypes_by_slug'), slug)),
        )
        return mapDocument(doc)
    } catch { /* Nothing */ }
    },
  },
}
