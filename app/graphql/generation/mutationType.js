import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLFloat,
  GraphQLInt,
  GraphQLNonNull,
} from 'graphql'
import axios from 'axios'

import generationType from './inputType'

const mutationType = new GraphQLObjectType({
  name: "mutationGeneration",
  fields: {
    addGeneration: {
      type: generationType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLInt)
        },
        game: {
          type: new GraphQLList(GraphQLString)
        },
        numberOfPokemon: {
          type: GraphQLInt
        },
        region: {
          type: GraphQLString
        }
      },
      resolve: (parentValue, args) => {
        return axios.post('http://localhost:3002/generation', args)
        .then(result => {
          return result.data
        })
      }
    }
  }
})

export default mutationType