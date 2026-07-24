# Sangil Studio — Web "En proceso"

Página de aterrizaje (*coming soon*) de **Sangil Studio**. Web estática, sin
dependencias ni build: un único `index.html` con todo el CSS y JS en línea.

🌐 **En producción:** [sangilstudio.com](https://sangilstudio.com)

## Características

- **Fondo interactivo de "s"**: una retícula dibujada en `<canvas>` donde las
  letras cercanas al cursor crecen y se oscurecen con un efecto "imán" suave.
  Se adapta al tamaño de la ventana, es nítido en pantallas retina y funciona
  también con el dedo en móvil.
- **Logo flotante**: al pasar el ratón, el logo crece desde su centro con una
  sombra suave (el PNG tiene fondo transparente, así la sombra sigue la forma
  de las letras).
- **Mensajes dinámicos**: textos tipo "Estamos trabajando en ello" que rotan
  cada pocos segundos con un fundido.
- **Halo central** que difumina el fondo detrás del logo y los textos para que
  no choquen con el patrón.

## Estructura

```
.
├── index.html        # La web completa (HTML + CSS + JS en línea)
├── assets/
│   └── logo.png      # Logo de Sangil Studio (fondo transparente)
├── README.md
└── .gitignore
```

## Desarrollo

No requiere instalación. Abre `index.html` en el navegador:

```bash
# Windows
start index.html
```

O sírvelo con cualquier servidor estático, por ejemplo:

```bash
npx serve .
```

## Personalización rápida

Los parámetros del efecto del fondo están al principio del `<script>` en
`index.html` (sección *"Fondo de 's' interactivo"*):

| Constante   | Qué controla                                   |
|-------------|------------------------------------------------|
| `CELDA`     | Densidad de la retícula (menor = más "s")      |
| `BASE_SIZE` | Tamaño normal de cada "s"                       |
| `MAX_ADD`   | Cuánto crecen las "s" cerca del ratón           |
| `RADIO`     | Radio de influencia del cursor                  |
| `BASE_GRIS` | Tono en reposo (0 = negro, 255 = blanco)        |
| `DARK_GRIS` | Tono al máximo acercamiento                     |
| `SUAVIZADO` | Suavidad del efecto (menor = más fluido)        |

Los mensajes rotativos se editan en el array `mensajes`.

## Despliegue

Hospedado en **Netlify** (sirviendo desde la raíz del repositorio) con el
dominio `sangilstudio.com` apuntado vía DNS en IONOS. Al hacer *push* a la rama
principal, Netlify publica los cambios automáticamente.
