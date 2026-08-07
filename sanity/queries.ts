import { defineQuery } from 'next-sanity'

const IMAGE = /* groq */ `{
  "id": asset.asset->_id,
  "src": asset.asset->url,
  "width": asset.asset->metadata.dimensions.width,
  "height": asset.asset->metadata.dimensions.height,
  "blur": asset.asset->metadata.lqip,
  alt
}`

const PROJECT_FIELDS = /* groq */ `
  "slug": slug.current,
  title,
  location,
  year,
  status,
  type,
  area,
  client,
  collaboration,
  featured,
  summary,
  body,
  "images": images[] ${IMAGE},
  "plans": plans[] ${IMAGE}
`

export const PROJECTS_QUERY = defineQuery(`
  *[_type == "project" && defined(slug.current)] | order(orderRank) {
    ${PROJECT_FIELDS}
  }
`)

export const PROJECT_SLUGS_QUERY = defineQuery(`
  *[_type == "project" && defined(slug.current)] | order(orderRank) { "slug": slug.current }
`)

export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings"][0] {
    "hero": heroProjects[]-> { "image": images[0] ${IMAGE} },
    statement,
    "team": team[] { name, role, phone },
    collaborators,
    street,
    postalCode,
    city,
    region,
    country,
    phone,
    email,
    website,
    instagram,
    linkedin
  }
`)
