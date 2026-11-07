/**
 * 1234.5 → "1,234.5", the en-US way, without toLocaleString: its first call starts up Intl, which
 * is a long task on a phone during hydration.
 */
export const commas = (n: number, decimals = 0) => {
  const [whole, fraction] = n.toFixed(decimals).split(".");
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return fraction ? `${grouped}.${fraction}` : grouped;
};
