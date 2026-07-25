/**
 * Constantes técnicas del sitio, las únicas que NO se editan desde el panel.
 *
 * Todo lo editorial —manifiesto, equipo, colaboradores, email, ciudad, redes— vive en
 * el documento «Estudio y contacto» del panel de administración, para que el estudio
 * pueda cambiarlo sin pasar por nosotros. Aquí queda sólo lo que define el despliegue:
 * el nombre de la marca y el dominio canónico, que se usan para las URLs absolutas, el
 * sitemap y los metadatos.
 */
export const site = {
  name: 'Sangil Studio',
  /** Dominio canónico de producción. */
  url: 'https://sangilstudio.com',
} as const
