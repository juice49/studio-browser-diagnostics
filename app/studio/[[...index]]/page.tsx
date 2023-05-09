//'use client'

// import { NextStudio } from 'next-sanity/studio'
// import config from '../../../sanity.config'
export { metadata } from 'next-sanity/studio/metadata'
import Studio from './studio'

export default function StudioPage() {
  return <Studio />
}
