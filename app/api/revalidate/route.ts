import { revalidateTag } from 'next/cache'
import type { NextRequest } from 'next/server'
import { parseBody } from 'next-sanity/webhook'
import { CONTENT_TAG } from '@/lib/content'

const SIGNATURE_HEADER = 'sanity-webhook-signature'
const MAX_AGE_MS = 5 * 60 * 1000

export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET
  if (!secret) {
    return new Response('Falta SANITY_REVALIDATE_SECRET en el entorno', { status: 500 })
  }

  try {
    const { isValidSignature, body } = await parseBody<{ _type?: string; slug?: string }>(
      request,
      secret,
    )

    if (!isValidSignature) {
      return new Response('Firma no válida', { status: 401 })
    }

    const timestamp = Number(/t=(\d+)/.exec(request.headers.get(SIGNATURE_HEADER) ?? '')?.[1])
    if (Number.isFinite(timestamp) && Math.abs(Date.now() - timestamp) > MAX_AGE_MS) {
      return new Response('Firma caducada', { status: 401 })
    }

    revalidateTag(CONTENT_TAG, 'max')

    return Response.json({
      revalidated: true,
      tag: CONTENT_TAG,
      type: body?._type ?? null,
    })
  } catch (error) {
    console.error('[revalidate] Error procesando el webhook de Sanity', error)
    return new Response('No se pudo procesar el webhook', { status: 400 })
  }
}
