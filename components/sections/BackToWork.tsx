import Link from 'next/link'
import { Chevron } from '@/components/ui/Chevron'

type Props = {
  href: string
  label: string
  title: string
}

/**
 * VOLVER A PROYECTOS. Sólo existe en la ficha de un proyecto, y **no se mueve**: es una
 * fila fija al borde inferior de la ventana, así que está a mano desde el primer scroll
 * hasta el último. Lo pidió así el estudio.
 *
 * Es una **fila entera** y no una etiqueta flotando porque la ficha son fotografías a todo
 * el ancho de la caja: un rótulo en tinta sobre una imagen oscura no se lee. La fila lleva el
 * mismo tratamiento que la barra de arriba cuando se ha bajado —papel al 95% con desenfoque—,
 * y así las dos se leen como el marco de la página y no como parte de las fotos.
 *
 * El rótulo va pegado al margen izquierdo de la web (`page-gutter`), en la misma vertical que
 * el título del proyecto, y el chevron es el de toda la web (ver `ui/Chevron`): una línea, sin
 * filete de acompañamiento.
 *
 * Es servidor: un enlace y un texto no necesitan JavaScript.
 */
export function BackToWork({ href, label, title }: Props) {
  return (
    /* `z-30`, por debajo del panel del menú (`z-40`): la barra vive más abajo en el árbol,
       así que con el mismo z-index se pintaría ENCIMA del menú abierto. */
    <div className="page-gutter fixed inset-x-0 bottom-0 z-30 flex h-16 items-center bg-paper/95 backdrop-blur-md md:h-20">
      <Link
        href={href}
        title={title}
        className="tap group flex items-center gap-2 text-ink transition-colors duration-300 hover:text-ink-soft"
      >
        <Chevron
          direction="left"
          className="h-4 w-2 transition-transform duration-300 ease-(--ease-out-soft) group-hover:-translate-x-1"
        />
        {/* Tamaño y versalitas de la utilidad `eyebrow`, pero sin su color gris: el
            rótulo va en tinta, que es el único texto de esta fila. */}
        <span className="text-micro uppercase">{label}</span>
      </Link>
    </div>
  )
}
