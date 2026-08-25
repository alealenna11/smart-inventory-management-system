export function calculateScarcityIndex(assets = []) {
  const total = assets.length;
  const allocated = assets.filter((a) => a.status === "Allocated").length;

  if (total === 0) return 0;

  return Number((allocated / total).toFixed(2));
}