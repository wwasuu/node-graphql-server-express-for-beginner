import { makeExecutableSchema } from 'graphql-tools'
import _ from 'lodash'

import { 
  typeDefs as pokemonTypeDefs,
  query as pokemonQuery,
  mutation as pokemonMutation,
  subscription as pokemonSubscription,
  resolvers as pokemonResolvers
} from './pokemon/schema'
import {
  typeDefs as generationTypeDefs,
  query as generationQuery,
  mutation as generationMutation,
  resolvers as generationResolvers
} from './generation/schema'
import metaTypeDefs from './meta'
import errorTypeDefs from './error'

const moduleTypeDefs = [
  metaTypeDefs,
  pokemonTypeDefs,
  generationTypeDefs ,
  errorTypeDefs
]

const moduleQueries = [
  pokemonQuery,
  generationQuery
]

const moduleMutations = [
  pokemonMutation,
  generationMutation
]

const moduleSubscriptions = [
  pokemonSubscription
]

const typeDefs = `
  ${moduleTypeDefs.join('\n')}

  # Root Query
  type Query {
    ${moduleQueries.join('\n')}
  }

  # Root Mutation
  type Mutation {
    ${moduleMutations.join('\n')}
  }

  # Root Subscription
  type Subscription {
    ${moduleSubscriptions.join('\n')}
  }

  # GraphQL Schema
  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }
`

const executableSchema = makeExecutableSchema({
  typeDefs,
  resolvers: _.merge(pokemonResolvers, generationResolvers),
})

export default executableSchema