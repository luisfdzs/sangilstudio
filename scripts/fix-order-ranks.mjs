import { getCliClient } from 'sanity/cli'
import { LexoRank } from 'lexorank'

const client = getCliClient()

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

const total = await arreglar('project', 'Proyectos')

console.log(
  total > 0
    ? `\n✓ Listo. Abre /admin y comprueba que los listados cargan y se pueden arrastrar.`
    : `\n✓ Nada que arreglar.`,
)
