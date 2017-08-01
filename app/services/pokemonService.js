import axios from 'axios'

const getPokemon = id => (
  axios.get(`http://localhost:3002/pokemon`, {})
)

const getPokemonById = id => (
  axios.get(`http://localhost:3002/pokemon/${id}`, {})
)

const addPokemon = (input) => (
  axios.post('http://localhost:3002/pokemon', input)
)

export {
  getPokemon,
  getPokemonById,
  addPokemon
}