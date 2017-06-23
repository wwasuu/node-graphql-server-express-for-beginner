import {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLFloat,
} from 'graphql'

import pokemonData from './data/pokemon.json'

const queryPokemon = new GraphQLObjectType({
  name: "pokemon",
  fields: {
    name: {
      type: GraphQLString,
    },
    nameJP: {
      type: GraphQLString,
    },
    height: {
      type: GraphQLFloat,
    },
    weight: {
      type: GraphQLFloat,
    },
  }
}); 

const queryType = new GraphQLObjectType({
  name: "queryPokemon",
  fields: {
    pokemon: {
      type: new GraphQLList(queryPokemon),
      resolve() {
        return pokemonData
      }
    }
  }
})

const pokemonSchema = new GraphQLSchema({
  query: queryType
})

var query = `{ 
  pokemon {
    name,
    nameJP,
    height,
    weight
  }
}`

graphql(pokemonSchema, query).then(result => {
  console.log(result.data)
})