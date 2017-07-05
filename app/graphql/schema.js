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
import { queryGenerationType } from './generation'

const schema = new GraphQLSchema({
  query: _.merge(queryPokemonType, queryGenerationType),
  mutation: mutationPokemonType
})

export default schema
