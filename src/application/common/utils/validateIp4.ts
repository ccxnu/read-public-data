export default function isValidIP4(str: string) {
  const blocks = str.split('.');
  if (blocks.length != 4) return false;
  for (const i in blocks) {
    if (
      !/^\d+$/g.test(blocks[i]) ||
      +blocks[i] > 255 ||
      +blocks[i] < 0 ||
      /^[0][0-9]{1,2}/.test(blocks[i])
    )
      return false;
  }
  return true;
}
