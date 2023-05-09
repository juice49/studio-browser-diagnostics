import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId, useCdn } from '../env'

export const client = createClient({
  apiVersion,
  dataset,
  projectId,
  useCdn,
})

export const writeClient = client.withConfig({
  token: process.env.SANITY_WRITE_API_TOKEN,
})
