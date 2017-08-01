import graphql from 'graphql'
import chai, { expect } from 'chai'
import sinon from 'sinon'
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

import rootSchema from '../../../app/graphql/rootSchema'
import * as pokemonService from '../../../app/services/pokemonService'

describe('Pokemon', () => {
  const promised = func => new Promise((resolve) => {
    setTimeout(() => resolve(func), 1);
  })
  describe('Pokemon Type', () => { 
    it('Should have an id field of type String', () => {
      expect(rootSchema._typeMap.Pokemon.getFields()).to.have.property('id')
      expect(rootSchema._typeMap.Pokemon.getFields().id.type).to.deep.equals(new GraphQLNonNull(GraphQLString))
    }) 
    it('Should have a name field of type String', () => {
      expect(rootSchema._typeMap.Pokemon.getFields()).to.have.property('name')
      expect(rootSchema._typeMap.Pokemon.getFields().name.type).to.deep.equals(new GraphQLNonNull(GraphQLString))
    }) 
    it('Should have a type field of type Array of String', () => {
      expect(rootSchema._typeMap.Pokemon.getFields()).to.have.property('type')
      expect(rootSchema._typeMap.Pokemon.getFields().type.type).to.deep.equals(new GraphQLList(GraphQLString))
    }) 
    it('Should have a generation field of type Generation', () => {
      expect(rootSchema._typeMap.Pokemon.getFields()).to.have.property('generation')
      expect(rootSchema._typeMap.Pokemon.getFields().generation.type).to.deep.equals(rootSchema._typeMap.Generation)
    }) 
  })

  describe('Pokemon Input', () => {
    it('Should have an id field of type String', () => {
      expect(rootSchema._typeMap.PokemonInput.getFields()).to.have.property('id')
      expect(rootSchema._typeMap.PokemonInput.getFields().id.type).to.deep.equals(new GraphQLNonNull(GraphQLString))
    })
    it('Should have a name field of type String', () => {
      expect(rootSchema._typeMap.Pokemon.getFields()).to.have.property('name')
      expect(rootSchema._typeMap.Pokemon.getFields().name.type).to.deep.equals(new GraphQLNonNull(GraphQLString))
    }) 
    it('Should have a type field of type Array of String', () => {
      expect(rootSchema._typeMap.Pokemon.getFields()).to.have.property('type')
      expect(rootSchema._typeMap.Pokemon.getFields().type.type).to.deep.equals(new GraphQLList(GraphQLString))
    }) 
  })

  describe('Pokemon Query', () => {
    describe('getPokemonById', () => {
      describe('Arguments', () => {
        it('Should have a id argument ', () => {
          expect(rootSchema._typeMap.Query.getFields().getPokemonById.args[0].name).to.equal('id')
          expect(rootSchema._typeMap.Query.getFields().getPokemonById.args[0].type).to.deep.equals(new GraphQLNonNull(GraphQLString))
        })
      })
      describe('Resolve', () => {
        let mockPokemonService
        beforeEach(() => {
          mockPokemonService = sinon.mock(pokemonService)
        })
        afterEach(() => {
          mockPokemonService.restore()
        })
        it('Should return status 200 and data when pass correctly argument', (done) => {
          const args = { id: '1' }
          const pokemonData = [
            {
              id: "001",
              name: "Bulbasaur"
            },
            {
              id: "002",
              name: "Ivysaur"
            }
          ]
          const expected = {
            meta: { status: 200},
            data: pokemonData,
            errors: []
          }
          const apiPokemonServiceData = { status: 200, data: pokemonData };
          const resPokemonService = Promise.resolve(apiPokemonServiceData);
          mockPokemonService.expects('getPokemonById').once().withArgs(args.id).returns(resPokemonService)
          promised(rootSchema._typeMap.Query.getFields().getPokemonById.resolve({}, args))
            .then((data) => {
              mockPokemonService.verify()
              expect(data).to.deep.equal(expected)
              done()
            })
            .catch(err => done(err))
        })
      })
    })
  })

  describe('Pokemon Mutation', () => {
    describe('addPokemon', () => {
      describe('Arguments', () => {
        it('Should have a id argument ', () => {
          expect(rootSchema._typeMap.Mutation.getFields().addPokemon.args[0].name).to.equal('input')
          expect(rootSchema._typeMap.Mutation.getFields().addPokemon.args[0].type).to.deep.equals(rootSchema._typeMap.PokemonInput)
        })
      })
      describe('Resolve', () => {
        let mockPokemonService
        let mockPubSub
        beforeEach(() => {
          mockPokemonService = sinon.mock(pokemonService)
          mockPubSub = sinon.mock(PubSub.prototype)
        })
        afterEach(() => {
          mockPokemonService.restore()
          mockPubSub.restore()
        })
        it('Should return status 200 and data when created with correctly argument', (done) => {
          const pokemonData = {
            id: '150',
            name: 'Mewtwo',
            nameJP: 'Myutsu'
          }
          const args = {
            input: pokemonData
          }
          const expected = pokemonData
          const apiPokemonServiceData = { status: 201, data: pokemonData };
          const resPokemonService = Promise.resolve(apiPokemonServiceData);
          mockPokemonService.expects('addPokemon').once().withArgs(args.input).returns(resPokemonService)
          mockPubSub.expects('publish').once().withArgs('pokemonCreated', { pokemonCreated: pokemonData })
          promised(rootSchema._typeMap.Mutation.getFields().addPokemon.resolve({}, args))
            .then((data) => {
              mockPokemonService.verify()
              mockPubSub.verify()
              expect(data).to.deep.equal(expected)
              done()
            })
            .catch(err => done(err))
        })
      })
    })
  })

  describe('Pokemon Subscription', () => {
    describe('pokemonCreated', () => {
      describe('Resolve', () => {
        let mockPubSub
        beforeEach(() => {
          mockPubSub = sinon.mock(PubSub.prototype)
        })
        afterEach(() => {
          mockPubSub.restore()
        })
        it('Should call asyncIterator function with argument corretly', (done) => {
          mockPubSub.expects('asyncIterator').once().withArgs('pokemonCreated')
          promised(rootSchema._typeMap.Subscription.getFields().pokemonCreated.subscribe())
            .then(() => {
              mockPubSub.verify()
              done()
            })
            .catch(err => done(err))
        })
      })
    })
  })

  describe('PokemonsPayload Type', () => {
    it('Should have an data field of type Array of Pokemon', () => {
      expect(rootSchema._typeMap.PokemonsPayload.getFields()).to.have.property('data')
      expect(rootSchema._typeMap.PokemonsPayload.getFields().data.type).to.deep.equals(new GraphQLList(rootSchema._typeMap.Pokemon))
    })
    it('Should have a meta field of type meta', () => {
      expect(rootSchema._typeMap.PokemonsPayload.getFields()).to.have.property('meta')
      expect(rootSchema._typeMap.PokemonsPayload.getFields().meta.type).to.deep.equals(rootSchema._typeMap.Meta)
    })

    it('Should have an errors field of type meta', () => {
      expect(rootSchema._typeMap.PokemonsPayload.getFields()).to.have.property('errors')
      expect(rootSchema._typeMap.PokemonsPayload.getFields().errors.type).to.deep.equals(new GraphQLList(rootSchema._typeMap.Error))
    })
  })
})
