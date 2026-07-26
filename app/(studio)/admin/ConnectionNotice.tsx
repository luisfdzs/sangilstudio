'use client'

import { useEffect, useState } from 'react'
import { apiVersion, dataset, projectId } from '@/sanity/env'

/**
 * AVISO DE CONEXIÓN BLOQUEADA
 *
 * El panel de Sanity necesita una conexión **en tiempo real** (Server-Sent Events) con
 * `api.sanity.io` para funcionar: es como se enteran los formularios de que un documento
 * ha cambiado. Si algo la bloquea, el panel **se queda en blanco o girando para siempre,
 * sin decir nada**, y quien lo usa concluye —con razón— que la web está rota.
 *
 * Eso pasó de verdad: en un portátil con **Sophos Intercept X** (antivirus corporativo
 * que inspecciona el tráfico HTTPS), el navegador no lograba abrir esa conexión, mientras
 * las peticiones normales y `curl` funcionaban sin problema. Diagnosticarlo llevó un
 * rato precisamente porque el panel no daba ninguna pista.
 *
 * Este componente hace la comprobación por su cuenta y, si falla, explica qué ocurre y
 * qué probar. No sustituye al panel: se muestra encima, para que el mensaje aparezca
 * aunque el panel no llegue a arrancar.
 */

const TIMEOUT_MS = 9000

type Estado = 'comprobando' | 'ok' | 'bloqueada'

export function ConnectionNotice() {
  const [estado, setEstado] = useState<Estado>('comprobando')

  useEffect(() => {
    // Consulta mínima: sólo interesa si el canal se abre, no lo que devuelve.
    const query = encodeURIComponent('*[_id == "__health__"]{_id}')
    const url = `https://${projectId}.api.sanity.io/v${apiVersion}/data/listen/${dataset}?query=${query}&visibility=query`
    const source = new EventSource(url)

    const timer = setTimeout(() => {
      source.close()
      setEstado('bloqueada')
    }, TIMEOUT_MS)

    source.onopen = () => {
      clearTimeout(timer)
      source.close()
      setEstado('ok')
    }
    source.onerror = () => {
      clearTimeout(timer)
      source.close()
      setEstado('bloqueada')
    }

    return () => {
      clearTimeout(timer)
      source.close()
    }
  }, [])

  if (estado !== 'bloqueada') return null

  return (
    <div
      role="alert"
      style={{
        position: 'fixed',
        inset: 'auto 1rem 1rem 1rem',
        zIndex: 9999,
        maxWidth: '46rem',
        margin: '0 auto',
        padding: '1.25rem 1.5rem',
        borderRadius: '0.5rem',
        background: '#14140f',
        color: '#f4f2ee',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '0.9rem',
        lineHeight: 1.55,
        boxShadow: '0 10px 40px rgb(0 0 0 / 0.35)',
      }}
    >
      <strong style={{ display: 'block', marginBottom: '0.5rem' }}>
        Tu red está bloqueando el panel
      </strong>
      <p style={{ margin: '0 0 0.75rem' }}>
        El panel necesita una conexión permanente con los servidores de Sanity y este equipo o esta
        red no la deja abrir. Por eso puede quedarse en blanco o cargando sin parar.{' '}
        <strong>No es un problema de la web.</strong>
      </p>
      <p style={{ margin: 0, opacity: 0.85 }}>
        Suele ser un antivirus corporativo o un cortafuegos que inspecciona el tráfico (Sophos,
        McAfee y similares), o la red de una oficina. Para comprobarlo, abre esta misma dirección{' '}
        <strong>desde el móvil con datos</strong> o desde otra red: si ahí funciona, es eso. Si
        necesitas usarlo en este equipo, hay que pedir que se permita{' '}
        <code style={{ fontSize: '0.85em' }}>{projectId}.api.sanity.io</code>.
      </p>
    </div>
  )
}
