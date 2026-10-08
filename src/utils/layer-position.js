export function applyAxisOffsets(coords, offset) {
  if (offset[0] !== 'auto' && offset[0] != null) {
    coords.offsetTop = offset[0];
  }
  if (offset[1] !== 'auto' && offset[1] != null) {
    coords.offsetLeft = offset[1];
  }
  return coords;
}
