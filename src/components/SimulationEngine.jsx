export function simulateAllocation(dataset) {

  const manualTime = dataset.length * 6;
  const automatedTime = dataset.length * 2;

  const conflictRateManual = 0.18;
  const conflictRateAuto = 0.04;

  return {

    manualDecisionTime: manualTime,
    automatedDecisionTime: automatedTime,

    timeReduction:
      ((manualTime - automatedTime) / manualTime * 100).toFixed(1),

    conflictReduction:
      ((conflictRateManual - conflictRateAuto) /
        conflictRateManual * 100).toFixed(1)

  };

}