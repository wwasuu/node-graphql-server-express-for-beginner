import graphql from 'graphql'
import chai, { expect } from 'chai'
import sinon from 'sinon'
import supertest from 'supertest'
import axios from 'axios'
import { makeExecutableSchema } from 'graphql-tools'
import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLList,
  GraphQLNonNull
} from 'graphql'
import { PubSub } from 'graphql-subscriptions'
import { execute, subscribe } from 'graphql'
import { createServer } from 'http'
import { SubscriptionServer } from 'subscriptions-transport-ws'

import server from '../../../server'
import schema from '../../../app/graphql/rootSchema'

const request = supertest.agent(server)

after((done) => {
  server.close(done);
})

describe('Pokemon', () => {
  let mockAxios
  beforeEach(() => {
    mockAxios = sinon.mock(axios)
  })

  afterEach(() => {
    mockAxios.restore()
  })
  it.only('Should return status 200 and correctly payload', () => {
    const query = {
      query: `
          query {
          getPokemon {
            meta {
              status
            }
            data {
              id
              name
              generation {
                region
              }
            }
            errors {
              code
            }
          }
        }
      `,
      variables:null,
      operationName:""
    }
    const pokemonData = [
      {
        "id": "001",
        "name": "Bulbasaur",
        "type": [
          "Grass",
          "Posion"
        ],
        "species": "Seed Pokemon",
        "nameJP": "Fushigidane",
        "height": 0.71,
        "weight": 6.9,
        "generationId": 1
      }
    ]
    const generationData = {
      "id": 1,
      "game": [
        "Red",
        "Green",
        "Blue",
        "Yellow"
      ],
      "numberOfPokemon": 151,
      "region": "Kanto"
    }
    const expected = {
      meta: {
        status: 200
      },
      data: [
        {
          "id": "001",
          "name": "Bulbasaur",
          "generation": {
            "region": "Kanto"
          }
        }
      ],
      errors: []
    }
    const apiPokemonServiceData = { status: 200, data: pokemonData }
    const resPokemonService = Promise.resolve(apiPokemonServiceData)
    const apiGenerationServiceData = { status: 200, data: generationData }
    const resGenerationService = Promise.resolve(apiGenerationServiceData);
    mockAxios.expects('get').once().withArgs('http://localhost:3002/pokemon', {}).returns(resPokemonService)
    mockAxios.expects('get').once().withArgs('http://localhost:3002/generation/1', {}).returns(resGenerationService)
    return request.post('/graphql')
      .set('Accept', 'application/json')
      .send(query)
      .then(res => {
        mockAxios.verify()
        expect(res.statusCode).to.equals(200)
        expect(res.body.data.getPokemon).to.deep.equals(expected)
      })
  })
}) 