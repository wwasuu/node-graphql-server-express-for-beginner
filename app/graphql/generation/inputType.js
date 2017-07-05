import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt
} from 'graphql'
import axios from 'axios'

import { pokemonType } from '../pokemon'

const generationType = new GraphQLObjectType({
  name: "generationType",
  fields: () => ({
    id: {
      type: GraphQLInt
    },
    game: {
      type: new GraphQLList(GraphQLString)
    },
    numberOfPokemon: {
      type: GraphQLInt
    },
    region: {
      type: GraphQLString
    },
    pokemon: {
      type: new GraphQLList(pokemonType),
      resolve: (parentValue, args) => {
        return axios.get(`http://localhost:3002/pokemon?generationId=${parentValue.id}`, {})
        .then(result => {
          return result.data
        })
      }
    }
  })
})

export default generationType