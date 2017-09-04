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
  it('Should return status 200 and correct payload', () => {
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

  it.only('Should return status 200, correct payload and emit event', () => {
    const query = {
      query: `
        mutation { 
          addPokemon (
            input: {
              id: "066"
              name: "Machop"
              nameJP: "Wanriki"
              species:"Superpower Pokemon"
              type: ["Fighting"]
              height: 0.79
              weight: 19.5
              generationId: 1
            }
          ) {
            meta {
              status
            }
            data {
              id
              name
              nameJP
            }
            errors {
              code
              message
            }
          }
        }
      `,
      variables: null,
      operationName:""
    }

    const pokemonInput = {
      id: "066",
      name: "Machop",
      nameJP: "Wanriki",
      species:"Superpower Pokemon",
      type: ["Fighting"],
      height: 0.79,
      weight: 19.5,
      generationId: 1,
    }
  
    const expected = {
      addPokemon: {
        meta: {
          status: 201
        },
        data: {
          id: "066",
          name: "Machop",
          nameJP: "Wanriki"
        },
        errors: []
      }
    }
    const apiPokemonServiceRes = { status: 201, data: pokemonInput}
    const resPokemonService = Promise.resolve(apiPokemonServiceRes)
    mockAxios.expects('post').once().withArgs('http://localhost:3002/pokemon', pokemonInput).returns(resPokemonService)
    return request.post('/graphql')
      .set('Accept', 'application/json')
      .send(query)
      .then(res => {
        mockAxios.verify()        
        expect(res.statusCode).to.equals(200)
        expect(res.body.data).to.deep.equals(expected)
      })
  })

  it('Should return status 400 and errors message when query invalid field', () => {
    const query = {
      query: `
        query {
          getPokemon {
            meta {
              status
            }
            data {
              id
              nameTH
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
      variables: null,
      operationName: ""
    }
    const expected = [
      {
        "message": "Cannot query field \"nameTH\" on type \"Pokemon\". Did you mean \"name\" or \"nameJP\"?",
        "locations": [
          {
              "line": 9,
              "column": 15
          }
        ]
      }
    ]
    return request.post('/graphql')
      .set('Accept', 'application/json')
      .send(query)
      .then(res => {
        expect(res.statusCode).to.equals(400)
        expect(res.body.errors).to.deep.equals(expected)
      })
  })
}) 