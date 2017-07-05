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

import pokemonType from './inputType'

const mutationType = new GraphQLObjectType({
  name: "mutationPokemon",
  fields: {
    addPokemon: {
      type: pokemonType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLString)
        },
        name: {
          type: new GraphQLNonNull(GraphQLString)
        },
        nameJP: {
          type: new GraphQLNonNull(GraphQLString)
        },
        type: {
          type: new GraphQLList(GraphQLString)
        },
        species: {
          type: GraphQLString
        },
        weight: {
          type: GraphQLFloat
        },
        height: {
          type: GraphQLFloat
        },
      },
      resolve: (parentValue, args) => {
        return axios.post('http://localhost:3002/pokemon', args)
        .then(result => {
          return result.data
        })
      }
    },
    editPokemon: {
      type: pokemonType,
        args: {
        id: {
          type: new GraphQLNonNull(GraphQLString)
        },
        name: {
          type: GraphQLString
        },
        nameJP: {
          type: GraphQLString
        },
        type: {
          type: GraphQLString
        },
        species: {
          type: GraphQLString
        },
        weight: {
          type: GraphQLFloat
        },
        height: {
          type: GraphQLFloat
        },
      },
      resolve: (parentValue, args) => {
        return axios.patch(`http://localhost:3002/pokemon/${args.id}`, args)
        .then(result => {
          return result.data
        })
      }
    },
    deletePokemon: {
      type: pokemonType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLString)
        },
      },
      resolve: (parentValue, args) => {
        return axios.delete(`http://localhost:3002/pokemon/${args.id}`, {})
        .then(result => {
          return result.data
        })
      }
    }
  }
})

export default mutationType
