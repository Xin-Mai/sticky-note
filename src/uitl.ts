export function hexToRGBA(hex: string, opacity = 1): string {
  const reg = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/
  if (!reg.test(hex)) return hex;
  const r = hex.length === 4 ? parseInt(`0x${hex.slice(1,2)}`) : parseInt(`0x${hex.slice(1, 3)}`);
  const g = hex.length === 4 ? parseInt(`0x${hex.slice(2,3)}`) : parseInt(`0x${hex.slice(3, 5)}`);
  const b = hex.length === 4 ? parseInt(`0x${hex.slice(3,4)}`) : parseInt(`0x${hex.slice(5, 7)}`);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}