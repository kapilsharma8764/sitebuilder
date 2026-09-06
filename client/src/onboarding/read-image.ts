/**
 * Reading a logo the user picked from their computer.
 *
 * The picture is scaled down and returned as a data URL, which is then stored
 * with the site. That means no file server and no upload to configure — the
 * logo travels with the site and appears in the published page.
 *
 * Scaling matters more than it looks: a logo straight off a phone can be four
 * megabytes, and a data URL of that size would sit inside every save, every
 * publish and every autosave request. A few hundred pixels is plenty for a
 * header.
 */

export const MAX_FILE_BYTES = 8 * 1024 * 1024

export class ImageReadError extends Error {}

/** Longest side of the stored image, in pixels. */
const DEFAULT_MAX_SIZE = 480

export async function readImageAsDataUrl(
  file: File,
  maxSize = DEFAULT_MAX_SIZE,
): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new ImageReadError('That file is not an image')
  }
  if (file.size > MAX_FILE_BYTES) {
    throw new ImageReadError('That image is too large — please pick one under 8 MB')
  }

  // SVG has no pixels to resample and is already small; keep it as it is so a
  // vector logo stays sharp at any size.
  if (file.type === 'image/svg+xml') {
    return readAsDataUrl(file)
  }

  const source = await readAsDataUrl(file)
  const image = await loadImage(source)

  const scale = Math.min(1, maxSize / Math.max(image.width, image.height))
  if (scale === 1) return source

  const canvas = document.createElement('canvas')
  canvas.width = Math.round(image.width * scale)
  canvas.height = Math.round(image.height * scale)

  const context = canvas.getContext('2d')
  if (!context) return source

  context.drawImage(image, 0, 0, canvas.width, canvas.height)

  // PNG rather than JPEG, because logos are usually transparent and JPEG would
  // fill that transparency with black.
  return canvas.toDataURL('image/png')
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new ImageReadError('Could not read that file'))
    reader.readAsDataURL(file)
  })
}

function loadImage(source: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new ImageReadError('That image could not be opened'))
    image.src = source
  })
}
