

export function computeFairnessIndex(departments = []) {

  if (!departments.length) return 1;

  // Extract allocation counts
  const values = departments.map(d => Number(d.count || 0));

  // Calculate mean
  const mean =
    values.reduce((sum, value) => sum + value, 0) / values.length;

  // Calculate variance
  const variance =
    values.reduce((sum, value) => {
      return sum + Math.pow(value - mean, 2);
    }, 0) / values.length;

  const standardDeviation = Math.sqrt(variance);

  // Compute fairness index
  const fairnessIndex = Math.max(0, 1 - standardDeviation);

  return Number(fairnessIndex.toFixed(3));

}