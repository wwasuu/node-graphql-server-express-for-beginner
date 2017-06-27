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

import pokemonJson from './data/pokemon.json'

const pokemonData = pokemonJson
const pokemonJsonPath = './data/pokemon.json'
const app = express()
const PORT = 3001

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
      args: {
        unit: {
          type: GraphQLString
        }
      },
      resolve: ({ height }, { unit }) => {
        return (unit === 'FEET') ? height * 3.28084 : height
      }
      
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

const mutationType = new GraphQLObjectType({
  name: "mutationPokemon",
  fields: {
    addPokemon: {
      type: new GraphQLList(pokemonType),
      args: {
        id: {
          type: GraphQLString
        },
        name: {
          type: GraphQLString
        },
        nameJP: {
          type: GraphQLString
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
      resolve: (_, args) => {
        const pokemon = {
          id: args.id,
          name: args.name,
          nameJP: args.nameJP,
          type: args.type,
          species: args.species,
          height: args.height,
          weight: args.weight,
        }
        pokemonData.push(pokemon)
        jsonFile.writeFileSync(pokemonJsonPath, pokemonData)
        return pokemonData
      }
    }
  }
})

const pokemonSchema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType
})

app.use('/graphql', graphqlHTTP({
  schema: pokemonSchema,
  graphiql: true
}));

app.listen(PORT);
console.log("Server running on localhost:", PORT);