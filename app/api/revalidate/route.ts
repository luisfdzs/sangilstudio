import { revalidateTag } from 'next/cache'
import type { NextRequest } from 'next/server'
import { parseBody } from 'next-sanity/webhook'
import { CONTENT_TAG } from '@/lib/content'

/**
 * WEBHOOK DE PUBLICACIÓN
 *
 * Sanity llama a esta ruta cada vez que se publica algo en el panel. La web sigue
 * siendo estática —se sirve desde el CDN, igual de rápida— pero al recibir este aviso
 * Next descarta la copia cacheada del contenido y la regenera. Resultado práctico:
 * Yago pulsa «Publicar» y el cambio se ve en la web en segundos, **sin desplegar nada
 * y sin que nadie toque el repositorio**.
 *
 * La petición viene firmada: sin el secreto correcto no se revalida nada, para que
 * nadie pueda forzar regeneraciones desde fuera.
 *
 * Configuración (una vez, en sanity.io/manage › API › Webhooks):
 *   URL      https://sangilstudio.com/api/revalidate   (y la de test)
 *   Dataset  production · Trigger on: create, update, delete
 *   Secret   el mismo valor que la variable SANITY_REVALIDATE_SECRET
 */
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

    // Una sola etiqueta para todo el contenido: son pocas páginas y regenerarlas es
    // barato, así que no merece la pena afinar por tipo de documento.
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
