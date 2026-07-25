// Next 16 publica `eslint-config-next` ya en formato flat: se compone directamente,
// sin el puente FlatCompat que hacía falta con Next 15.
import next from 'eslint-config-next/core-web-vitals'

const config = [
  ...next,
  {
    // next-env.d.ts lo genera Next en cada build: no es nuestro código.
    ignores: ['.next/**', 'node_modules/**', 'docs/**', 'public/**', 'next-env.d.ts', '.vercel/**'],
  },
]

// Nota: no añadimos reglas propias de @typescript-eslint aquí. En formato flat, una
// regla sólo se puede declarar en el mismo objeto que registra su plugin, y el
// plugin lo aporta `eslint-config-next`. Las reglas que traen `next/core-web-vitals`
// y `next/typescript` son suficientes para este proyecto.

export default config
