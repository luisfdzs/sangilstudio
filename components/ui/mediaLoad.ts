/**
 * Las fotos aparecen con un fundido al terminar de cargar (ver `.media-fade` en
 * `globals.css`). Quien las marca como cargadas es este script, que va al
 * principio del `<body>`: así no esperan a que arranque React, que llega mucho
 * después de que la foto ya esté descargada. Como el atributo no viene del
 * servidor, esas fotos llevan `suppressHydrationWarning`.
 */
export const MEDIA_BOOT_SCRIPT = `document.addEventListener('load',function(e){var t=e.target;if(t.tagName==='IMG')t.setAttribute('data-loaded','')},true)`

/**
 * Para las fotos que React monta ya en la caché (al volver a una página, al
 * abrir el visor): se marcan antes de pintarse y salen sin fundido.
 */
export function markIfLoaded(img: HTMLImageElement | null): void {
  if (img?.complete && img.naturalWidth > 0) img.setAttribute('data-loaded', '')
}
