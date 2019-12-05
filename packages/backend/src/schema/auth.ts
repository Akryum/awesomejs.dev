import { SchemaDirectiveVisitor } from 'graphql-tools'
import { defaultFieldResolver, GraphQLField } from 'graphql'
import { gql, ApolloError } from 'apollo-server-core'
import { ErrorCode } from '@/const/error-codes'

export const typeDefs = gql`
"""
Field requiring authenticated user.
Otherwise, a 'unauthorized' error is thrown.
"""
directive @auth on FIELD_DEFINITION
`

export const schemaDirectives = {
  auth: class AuthDirective extends SchemaDirectiveVisitor {
    public visitFieldDefinition (field: GraphQLField<any, any>) {
      const { resolve = defaultFieldResolver } = field
      field.resolve = (root, args, context, info) => {
        if (!context.user) { throw new ApolloError('Not logged in', ErrorCode.ERROR_GUEST) }
        return resolve(root, args, context, info)
      }
    }
  },
}
