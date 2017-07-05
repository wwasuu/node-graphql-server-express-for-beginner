import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
} from 'graphql'
import axios from 'axios'
import _ from 'lodash'

import pokemonType from './inputType'

const queryType = new GraphQLObjectType({
  name: 'queryPokemon',
  fields: {
    getPokemon: {
      type: new GraphQLList(pokemonType),
      resolve(parentValue, args) {
        return axios.get('http://localhost:3002/pokemon', {})
        .then(result => result.data)
      }
    },
    getPokemonById: {
      type: pokemonType,
      args: {
        id: {
          type: GraphQLString
        }
      },
      resolve: (parentValue, args) => {
        return axios.get('http://localhost:3002/pokemon', {})
        .then(result => {
          return _.find(result.data, {id: args.id })
        })
      }
    }
  }
})

export default queryType