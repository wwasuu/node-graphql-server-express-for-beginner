import {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLFloat,
} from 'graphql'
import express from 'express'
import graphqlHTTP from 'express-graphql'
import jsonFile from 'jsonfile'

import pokemonData from './data/pokemon.json'

const pokemonType = new GraphQLObjectType({
  name: 'pokemonType',
  fields: {
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
  }
}); 

const queryType = new GraphQLObjectType({
  name: 'queryPokemon',
  fields: {
    getPokemon: {
      type: new GraphQLList(pokemonType),
      resolve() {
        return pokemonData
      }
    },
    getPokemonById: {
      type: pokemonType,
      args: {
        id: {
          type: GraphQLString
        }
      },
      resolve: (_, args) => {
        return pokemonData.filter((pokemon) => pokemon.id === args.id)[0]
      }
    }
  }
})

const rootSchema = new GraphQLSchema({
  query: queryType,
})

const query = `
  query {
    getPokemon {
      name
      nameJP
      type
    }
  }
`

graphql(rootSchema, query).then(result => {
  console.log(result.data);
});