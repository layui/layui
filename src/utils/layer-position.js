/**
 * Apply explicit top/left offsets while preserving automatic axes.
 * @param {Object} coords Coordinates object; this function mutates it in place.
 * @param {Array<number|string|null|undefined>} offset [top, left] offsets.
 * @returns {Object} The same coordinates object after applying offsets.
 */
export function applyAxisOffsets(coords, offset) {
  if (offset[0] !== 'auto' && offset[0] != null) {
    coords.offsetTop = offset[0];
  }
  if (offset[1] !== 'auto' && offset[1] != null && offset[1] !== '') {
    coords.offsetLeft = offset[1];
  }
  return coords;
}
