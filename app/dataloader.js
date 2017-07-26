import DataLoader from 'dataloader'
import axios from 'axios'

const getGenerationById = (generationId) => (
  axios.get(`http://localhost:3002/generation/${generationId}`, {})
)

const getGenerationByIdLoader = new DataLoader(generationIds => Promise.all(generationIds.map(getGenerationById)))

export {
  getGenerationByIdLoader
}
