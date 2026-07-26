/**
 * ARREGLA EL ORDEN DE LOS LISTADOS DEL PANEL
 *   npx sanity exec scripts/fix-order-ranks.mjs --with-user-token
 *
 * El plugin de orden por arrastre (`@sanity/orderable-document-list`) no guarda el orden
 * como un número, sino como un **LexoRank**: una cadena con la forma `0|hzzzzz:` que
 * permite insertar algo «entre» dos elementos sin renumerar el resto. La migración
 * inicial escribió cadenas propias (`a000`, `a001`…) y el plugin, al no reconocer el
 * formato, **lanzaba una excepción y el listado no llegaba a pintarse nunca**: en el
 * panel se veía «There was an error / Please try again later» después de un rato en
 * blanco. Este script reescribe todos los `orderRank` con ranks válidos, conservando el
 * orden que ya tenían.
 *
 * Sólo toca el campo `orderRank` —con `patch`, no reemplazando documentos— para no pisar
 * nada de lo que se haya editado en el panel. Es idempotente: si ya están bien, no hace
 * nada.
 */

import { getCliClient } from 'sanity/cli'
import { LexoRank } from 'lexorank'

const client = getCliClient()

/** Un rank válido tiene bucket (0, 1 o 2), una barra, el valor y dos puntos. */
const esValido = (rank) => typeof rank === 'string' && /^[012]\|[0-9a-z]+:$/.test(rank)

async function arreglar(tipo, etiqueta) {
  const documentos = await client.fetch(
    `*[_type == $tipo]{ _id, title, orderRank } | order(coalesce(orderRank, "zzz") asc)`,
    { tipo },
  )

  if (documentos.length === 0) {
    console.log(`· ${etiqueta}: no hay documentos`)
    return 0
  }

  const invalidos = documentos.filter((d) => !esValido(d.orderRank))
  if (invalidos.length === 0) {
    console.log(`· ${etiqueta}: los ${documentos.length} ya tienen un orden válido`)
    return 0
  }

  console.log(
    `· ${etiqueta}: ${invalidos.length} de ${documentos.length} con orden inválido ` +
      `(ejemplo: ${JSON.stringify(invalidos[0].orderRank)})`,
  )

  // Se reparten ranks equiespaciados respetando el orden actual del listado.
  let rank = LexoRank.middle()
  const transaction = client.transaction()
  for (const documento of documentos) {
    transaction.patch(documento._id, { set: { orderRank: rank.toString() } })
    rank = rank.genNext()
  }
  await transaction.commit()
  console.log(`  ✓ ${documentos.length} documentos reordenados`)
  return documentos.length
}

const total =
  (await arreglar('project', 'Proyectos')) + (await arreglar('competition', 'Concursos'))

console.log(
  total > 0
    ? `\n✓ Listo. Abre /admin y comprueba que los listados cargan y se pueden arrastrar.`
    : `\n✓ Nada que arreglar.`,
)
