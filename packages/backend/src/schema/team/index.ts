import gql from 'graphql-tag'
import { Resolvers, CreateTeamInput, EditTeamInput } from '@/generated/schema'
import { query as q, values } from 'faunadb'
import { mapDocuments, mapDocument } from '@/util/fauna'
import { ApolloError } from '@nodepack/plugin-apollo'
import { ErrorCode } from '@/const/error-codes'

export const typeDefs = gql`
type Team {
  id: ID!
  name: String!
  projectTypes: [ProjectType!]!
  users: [User!]!
}

extend type Query {
  team (id: ID!): Team
  allTeams: [Team!]! @admin @auth
}

input CreateTeamInput {
  name: String!
  projectTypeIds: [ID!]!
  userIds: [ID!]!
}

input EditTeamInput {
  id: ID!
  name: String!
  projectTypeIds: [ID!]!
  userIds: [ID!]!
}

extend type Mutation {
  createTeam (input: CreateTeamInput!): Team @admin @auth
  editTeam (input: EditTeamInput!): Team @admin @auth
}
`

function validateInput (
  input: CreateTeamInput | EditTeamInput,
) {
  if (!input.name) {
    throw new ApolloError('Team name is required', ErrorCode.ERROR_VALIDATION)
  }

  if (!input.projectTypeIds.length) {
    throw new ApolloError('Select at least one project type', ErrorCode.ERROR_VALIDATION)
  }

  if (!input.userIds.length) {
    throw new ApolloError('Select at least one user', ErrorCode.ERROR_VALIDATION)
  }
}

export const resolvers: Resolvers = {
  Team: {
    projectTypes: async (team, args, ctx) => {
      return mapDocuments(await ctx.db.query<Array<values.Document<any>>>(q.Map(
        team.projectTypes,
        q.Lambda(['ref'], q.Get(q.Var('ref'))),
      )))
    },

    users: async (team, args, ctx) => {
      return mapDocuments(await ctx.db.query<Array<values.Document<any>>>(q.Map(
        team.users,
        q.Lambda(['ref'], q.Get(q.Var('ref'))),
      )))
    },
  },

  Query: {
    team: async (root, { id }, ctx) => {
      const doc = await ctx.db.query<values.Document<any>>(q.Get(q.Ref(q.Collection('teams'), id)))
      return mapDocument(doc)
    },

    allTeams: async (root, args, ctx) => {
      const { data } = await ctx.db.query(q.Map(
        q.Paginate(q.Match(q.Index('all_teams')), { size: 1000 }),
        q.Lambda(['ref'], q.Get(q.Var('ref'))),
      ))
      return mapDocuments(data)
    },
  },

  Mutation: {
    createTeam: async (root, { input }, ctx) => {
      validateInput(input)
      const doc = await ctx.db.query<values.Document<any>>(q.Create(q.Collection('teams'), {
        data: {
          name: input.name,
          projectTypes: input.projectTypeIds.map((id) => q.Ref(q.Collection('ProjectTypes'), id)),
          users: input.userIds.map((id) => q.Ref(q.Collection('Users'), id)),
        },
      }))
      return mapDocument(doc)
    },

    editTeam: async (root, { input }, ctx) => {
      validateInput(input)
      const doc = await ctx.db.query<values.Document<any>>(q.Update(q.Ref(q.Collection('teams'), input.id), {
        data: {
          name: input.name,
          projectTypes: input.projectTypeIds.map((id) => q.Ref(q.Collection('ProjectTypes'), id)),
          users: input.userIds.map((id) => q.Ref(q.Collection('Users'), id)),
        },
      }))
      return mapDocument(doc)
    },
  },
}

