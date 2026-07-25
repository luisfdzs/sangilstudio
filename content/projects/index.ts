/**
 * Registro de proyectos. Los imports son explícitos a propósito: nada de leer el
 * directorio en tiempo de ejecución, así el bundler sabe exactamente qué entra.
 * Para añadir un proyecto: crear su fichero, importarlo aquí y generar sus
 * imágenes en `scripts/curation.mjs` + `npm run images`.
 */
import ancinOffices from './ancin-offices'
import arrosadiaSocialHousing from './arrosadia-social-housing'
import frApartmentTajonar from './fr-apartment-tajonar'
import holyLandVisitorCenter from './holy-land-visitor-center'
import housing10Salobrena from './housing-10-salobrena'
import housing4Cintruenigo from './housing-4-cintruenigo'
import housing8Cintruenigo from './housing-8-cintruenigo'
import isHousePamplona from './is-house-pamplona'
import lantegiCulturalCentre from './lantegi-cultural-centre'
import mzHousingZizur from './mz-housing-zizur'
import nabrawindOffices from './nabrawind-offices'
import veHouseIbiricu from './ve-house-ibiricu'
import yugoPlazaolaResidence from './yugo-plazaola-residence'
import z1HouseZizur from './z1-house-zizur'

export const projectSources = [
  arrosadiaSocialHousing,
  holyLandVisitorCenter,
  yugoPlazaolaResidence,
  lantegiCulturalCentre,
  isHousePamplona,
  mzHousingZizur,
  z1HouseZizur,
  veHouseIbiricu,
  housing8Cintruenigo,
  nabrawindOffices,
  housing10Salobrena,
  ancinOffices,
  housing4Cintruenigo,
  frApartmentTajonar,
]
