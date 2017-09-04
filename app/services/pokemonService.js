import axios from 'axios'

export const getPokemon = id => axios.get(`http://localhost:3002/pokemon`, {})
export const getPokemonById = id => axios.get(`http://localhost:3002/pokemon/${id}`, {})
export const addPokemon = input => axios.post('http://localhost:3002/pokemon', input)
