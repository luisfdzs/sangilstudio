import type { FamilyId } from './families'

export type Transform = 'none' | 'uppercase' | 'lowercase' | 'capitalize'

export type RoleStyle = {
  family: FamilyId
  sizeMobile: number
  sizeDesktop: number
  weight: number
  lineHeight: number
  letterSpacing: number
  wordSpacing: number
  transform: Transform
  italic: boolean
  color: string
  opacity: number
}

export type RoleGroup = 'portada' | 'proyectos' | 'ficha' | 'estudio' | 'menu' | 'otras'

export type Role = {
  id: string
  label: string
  where: string
  group: RoleGroup
  sample: string
  today: string
  defaults: RoleStyle
}

export const GROUPS: { id: RoleGroup; label: string }[] = [
  { id: 'portada', label: 'Portada y contacto' },
  { id: 'proyectos', label: 'Rejilla de proyectos' },
  { id: 'ficha', label: 'Ficha de proyecto' },
  { id: 'estudio', label: 'Estudio' },
  { id: 'menu', label: 'Menú' },
  { id: 'otras', label: 'Aviso legal y página 404' },
]

const INK = '#111111'
const SOFT = '#6b6b6b'
const FAINT = '#9a9a9a'

const base: RoleStyle = {
  family: 'montserrat',
  sizeMobile: 15,
  sizeDesktop: 17,
  weight: 400,
  lineHeight: 1.7,
  letterSpacing: 0,
  wordSpacing: 0,
  transform: 'none',
  italic: false,
  color: INK,
  opacity: 1,
}

const small: RoleStyle = { ...base, sizeMobile: 13, sizeDesktop: 13, lineHeight: 1.5 }
const micro: RoleStyle = {
  ...base,
  sizeMobile: 11,
  sizeDesktop: 11,
  lineHeight: 1.4,
  letterSpacing: 0.12,
  transform: 'uppercase',
}
const lead: RoleStyle = { ...base, sizeMobile: 14, sizeDesktop: 16, lineHeight: 1.55 }
const prose: RoleStyle = { ...base, sizeMobile: 14, sizeDesktop: 16 }
const title: RoleStyle = {
  ...base,
  sizeMobile: 22,
  sizeDesktop: 26,
  lineHeight: 1.2,
  letterSpacing: -0.025,
}
const display: RoleStyle = {
  ...base,
  sizeMobile: 21,
  sizeDesktop: 28,
  lineHeight: 1.05,
  letterSpacing: -0.025,
  transform: 'uppercase',
}

export const ROLES: Role[] = [
  {
    id: 'contactHeading',
    label: 'Rótulo de contacto',
    where: 'Portada · el «CONTACTO» sobre la dirección',
    group: 'portada',
    sample: 'Contacto',
    today: 'text-display tracking-tight uppercase',
    defaults: { ...display },
  },
  {
    id: 'contactBody',
    label: 'Datos de contacto',
    where: 'Portada · dirección, teléfono, correo, web, Instagram y socios',
    group: 'portada',
    sample: 'Castillo de Maya 35, bajo\n31004 Pamplona, España\nT +34 664 197 624',
    today: 'text-body',
    defaults: { ...base },
  },
  {
    id: 'cardTitle',
    label: 'Título de proyecto en la rejilla',
    where: 'Proyectos y ficha · el nombre bajo cada foto y el pie de la imagen grande',
    group: 'proyectos',
    sample: 'Vivienda unifamiliar en Zizur',
    today: 'text-small font-medium tracking-wide uppercase',
    defaults: {
      ...small,
      weight: 500,
      letterSpacing: 0.025,
      transform: 'uppercase',
    },
  },
  {
    id: 'cardLocation',
    label: 'Localidad en la rejilla',
    where: 'Proyectos y ficha · la línea gris bajo el título (localidad, o los arquitectos)',
    group: 'proyectos',
    sample: 'Pamplona, Navarra',
    today: 'text-small text-ink-soft',
    defaults: { ...small, color: SOFT },
  },
  {
    id: 'search',
    label: 'Buscador',
    where: 'Proyectos · el campo de búsqueda centrado',
    group: 'proyectos',
    sample: 'Buscar proyecto',
    today: 'text-small tracking-wide',
    defaults: { ...small, letterSpacing: 0.025 },
  },
  {
    id: 'searchOption',
    label: 'Sugerencias del buscador',
    where: 'Proyectos · los títulos del desplegable',
    group: 'proyectos',
    sample: 'Centro de congresos en Pozuelo',
    today: 'text-small tracking-[0.14em] uppercase',
    defaults: { ...small, letterSpacing: 0.14, transform: 'uppercase', color: SOFT },
  },
  {
    id: 'searchEmpty',
    label: 'Aviso de «sin resultados»',
    where: 'Proyectos · la frase que sale cuando la búsqueda no encuentra nada',
    group: 'proyectos',
    sample: 'No hay proyectos que coincidan con la búsqueda.',
    today: 'text-body text-ink-soft',
    defaults: { ...base, color: SOFT },
  },
  {
    id: 'galleryToggle',
    label: 'Botones de vista',
    where: 'Proyectos y ficha · «Cuadrados / Filas»',
    group: 'proyectos',
    sample: 'Cuadrados',
    today: 'text-micro tracking-[0.12em] uppercase',
    defaults: { ...micro, color: FAINT },
  },
  {
    id: 'projectTitle',
    label: 'Título de la ficha',
    where: 'Ficha en móvil · el nombre del proyecto, a gran tamaño',
    group: 'ficha',
    sample: 'UDC Research Building',
    today: 'text-display tracking-tight uppercase',
    defaults: { ...display },
  },
  {
    id: 'projectMeta',
    label: 'Datos de la ficha',
    where: 'Ficha en móvil · localidad, año, tipo, arquitectos y promotor',
    group: 'ficha',
    sample:
      'Ferrol, Galicia, 2023\nDocente\nArquitectos: Yago Fernández Sangil, Juan Luis Irigaray Huarte',
    today: 'text-body',
    defaults: { ...base },
  },
  {
    id: 'backLink',
    label: 'Enlace de vuelta a proyectos',
    where: 'Ficha · la barra inferior fija',
    group: 'ficha',
    sample: 'Proyectos',
    today: 'text-micro uppercase',
    defaults: { ...micro },
  },
  {
    id: 'studioTitle',
    label: 'Título de Estudio',
    where: 'Estudio · el titular de la página',
    group: 'estudio',
    sample: 'Estudio',
    today: 'text-display tracking-tight uppercase',
    defaults: { ...display },
  },
  {
    id: 'studioLead',
    label: 'Entradilla de Estudio',
    where: 'Estudio · el primer párrafo, más grande',
    group: 'estudio',
    sample:
      'SANGIL STUDIO es un estudio de arquitectura con base en Pamplona, con obra construida en Navarra y fuera de ella.',
    today: 'text-lead',
    defaults: { ...lead },
  },
  {
    id: 'studioBody',
    label: 'Texto de Estudio',
    where: 'Estudio · el resto de los párrafos',
    group: 'estudio',
    sample:
      'Trabajamos vivienda, rehabilitación, oficinas y equipamiento, con especial atención a la luz, la materia y el lugar.',
    today: 'text-prose text-ink-soft',
    defaults: { ...prose, color: SOFT },
  },
  {
    id: 'menuLink',
    label: 'Enlaces del menú',
    where: 'Menú · Inicio, Proyectos, Estudio, Contacto',
    group: 'menu',
    sample: 'Proyectos',
    today: 'text-title tracking-tight text-ink-soft',
    defaults: { ...title, color: SOFT },
  },
  {
    id: 'menuLocale',
    label: 'Idiomas del menú',
    where: 'Menú · ES / EN',
    group: 'menu',
    sample: 'ES',
    today: 'text-small uppercase',
    defaults: { ...small, transform: 'uppercase' },
  },
  {
    id: 'menuLegal',
    label: 'Aviso legal del menú',
    where: 'Menú · el enlace pequeño del final',
    group: 'menu',
    sample: 'Aviso legal',
    today: 'eyebrow (text-micro, uppercase)',
    defaults: { ...micro, color: FAINT },
  },
  {
    id: 'legalTitle',
    label: 'Título del aviso legal',
    where: 'Aviso legal · el titular de la página',
    group: 'otras',
    sample: 'Aviso legal',
    today: 'text-display tracking-tight uppercase',
    defaults: { ...display },
  },
  {
    id: 'legalHeading',
    label: 'Rótulos del aviso legal',
    where: 'Aviso legal · el encabezado de cada bloque (Titular, Propiedad intelectual…)',
    group: 'otras',
    sample: 'Propiedad intelectual',
    today: 'text-prose',
    defaults: { ...prose },
  },
  {
    id: 'legalBody',
    label: 'Texto del aviso legal',
    where: 'Aviso legal · el párrafo de cada bloque, con sus saltos de línea',
    group: 'otras',
    sample:
      'Responsable: SANGIL STUDIO S.L.P.\nCIF: B71549737\nCorreo electrónico: sangil@sangilstudio.com',
    today: 'text-prose text-ink-soft',
    defaults: { ...prose, color: SOFT },
  },
  {
    id: 'notFoundTag',
    label: 'El «404»',
    group: 'otras',
    where: 'Página no encontrada · el número de arriba',
    sample: '404',
    today: 'eyebrow (text-micro, uppercase)',
    defaults: { ...micro, color: FAINT },
  },
  {
    id: 'notFoundTitle',
    label: 'Título de la 404',
    where: 'Página no encontrada · el titular',
    group: 'otras',
    sample: 'Esta página no existe',
    today: 'text-display',
    defaults: { ...display, transform: 'none' },
  },
  {
    id: 'notFoundBody',
    label: 'Texto de la 404',
    where: 'Página no encontrada · la frase bajo el titular',
    group: 'otras',
    sample: 'Puede que se haya movido o que el enlace esté mal escrito.',
    today: 'text-body text-ink-soft',
    defaults: { ...base, color: SOFT },
  },
  {
    id: 'notFoundLink',
    label: 'Enlace de la 404',
    where: 'Página no encontrada · el enlace de vuelta a la portada',
    group: 'otras',
    sample: 'Volver a la portada',
    today: 'text-small',
    defaults: { ...small },
  },
]

export const ROLE_BY_ID: Record<string, Role> = Object.fromEntries(
  ROLES.map((role) => [role.id, role]),
)

export const DEFAULT_STATE: Record<string, RoleStyle> = Object.fromEntries(
  ROLES.map((role) => [role.id, role.defaults]),
)

export const PALETTE = [
  { value: INK, label: 'ink' },
  { value: SOFT, label: 'ink-soft' },
  { value: FAINT, label: 'ink-faint' },
  { value: '#000000', label: 'negro' },
]
