import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLFloat,
  GraphQLInt
} from 'graphql'
import axios from 'axios'

import { generationType } from '../generation'

const pokemonType = new GraphQLObjectType({
  name: 'pokemonType',
  fields: () => ({
    id: {
      type: GraphQLString
    },
    name: {
      type: GraphQLString,
    },
    nameJP: {
      type: GraphQLString,
    },
    type: {
      type: new GraphQLList(GraphQLString),
    },
    species: {
      type: GraphQLString,
    },
    height: {
      type: GraphQLFloat,
    },
    weight: {
      type: GraphQLFloat,
    },
    generation: {
      type: generationType,
      resolve: (parentValue, args) => {
        return axios.get(`http://localhost:3002/generation/${parentValue.generationId}`, {})
        .then(result => {
          return result.data
        })
      }
    }
  })
}); 

export default pokemonType