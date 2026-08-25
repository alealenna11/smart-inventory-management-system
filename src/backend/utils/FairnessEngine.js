export function computeFairnessIndex(departments = []) {
  if (!departments.length) return 1;

  const allocationRatios = departments.map((department) => Number(department.count || 0));
  const mean =
    allocationRatios.reduce((sum, value) => sum + value, 0) / allocationRatios.length;

  const variance =
    allocationRatios.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) /
    allocationRatios.length;

  const standardDeviation = Math.sqrt(variance);
  const fairnessIndex = Math.max(0, 1 - standardDeviation);

  return Number(fairnessIndex.toFixed(3));
}