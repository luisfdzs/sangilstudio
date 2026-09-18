export type FamilyId =
  | 'montserrat'
  | 'inter'
  | 'dmsans'
  | 'jost'
  | 'worksans'
  | 'lora'
  | 'playfair'
  | 'system'
  | 'georgia'

export type Family = {
  id: FamilyId
  label: string
  stack: string
  cssName: string
  google: string | null
}

export const FAMILIES: Family[] = [
  {
    id: 'montserrat',
    label: 'Montserrat · la actual',
    stack: 'var(--font-montserrat), Montserrat, sans-serif',
    cssName: 'var(--font-montserrat), sans-serif',
    google: 'Montserrat:ital,wght@0,100..900;1,100..900',
  },
  {
    id: 'inter',
    label: 'Inter',
    stack: 'Inter, sans-serif',
    cssName: 'Inter, sans-serif',
    google: 'Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900',
  },
  {
    id: 'dmsans',
    label: 'DM Sans',
    stack: '"DM Sans", sans-serif',
    cssName: '"DM Sans", sans-serif',
    google: 'DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000',
  },
  {
    id: 'jost',
    label: 'Jost',
    stack: 'Jost, sans-serif',
    cssName: 'Jost, sans-serif',
    google: 'Jost:ital,wght@0,100..900;1,100..900',
  },
  {
    id: 'worksans',
    label: 'Work Sans',
    stack: '"Work Sans", sans-serif',
    cssName: '"Work Sans", sans-serif',
    google: 'Work+Sans:ital,wght@0,100..900;1,100..900',
  },
  {
    id: 'lora',
    label: 'Lora',
    stack: 'Lora, serif',
    cssName: 'Lora, serif',
    google: 'Lora:ital,wght@0,400..700;1,400..700',
  },
  {
    id: 'playfair',
    label: 'Playfair Display',
    stack: '"Playfair Display", serif',
    cssName: '"Playfair Display", serif',
    google: 'Playfair+Display:ital,wght@0,400..900;1,400..900',
  },
  {
    id: 'system',
    label: 'Sistema (sin descarga)',
    stack: 'ui-sans-serif, system-ui, sans-serif',
    cssName: 'ui-sans-serif, system-ui, sans-serif',
    google: null,
  },
  {
    id: 'georgia',
    label: 'Georgia (sin descarga)',
    stack: 'Georgia, serif',
    cssName: 'Georgia, serif',
    google: null,
  },
]

export const FAMILY_BY_ID: Record<FamilyId, Family> = Object.fromEntries(
  FAMILIES.map((family) => [family.id, family]),
) as Record<FamilyId, Family>

export function googleFontsHref(): string {
  const families = FAMILIES.map((family) => family.google)
    .filter((param): param is string => Boolean(param))
    .map((param) => `family=${param}`)
    .join('&')
  return `https://fonts.googleapis.com/css2?${families}&display=swap`
}
