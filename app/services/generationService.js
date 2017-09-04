import axios from 'axios'

export const getGeneration = () => axios.get('http://localhost:3002/generation', {})
export const getGenerationById = id => axios.get(`http://localhost:3002/generation/${id}`, {})