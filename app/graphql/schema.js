import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLFloat,
  GraphQLInt,
  GraphQLNonNull,
} from 'graphql'
import _ from 'lodash'

import { queryPokemonType, mutationPokemonType } from './pokemon'
import { queryGenerationType, mutationGenerationType } from './generation'

const schema = new GraphQLSchema({
  query: _.merge(queryPokemonType, queryGenerationType),
  mutation: _.merge(mutationPokemonType, mutationGenerationType)
})

export default schema
