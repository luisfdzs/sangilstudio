import type { Metadata, Viewport } from 'next'
import { NextStudio } from 'next-sanity/studio'
import config from '@/sanity.config'
import { ConnectionNotice } from '../ConnectionNotice'

export const metadata: Metadata = {
  title: 'Administración · Sangil Studio',
  robots: { index: false, follow: false },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  interactiveWidget: 'resizes-content',
}

export default function AdminPage() {
  return (
    <>
      <NextStudio config={config} />
      <ConnectionNotice />
    </>
  )
}
