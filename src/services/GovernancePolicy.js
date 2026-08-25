const KEY = "invisor_governance_policy";

const DEFAULT_POLICY = {
  riskHigh: 0.75,
  riskMedium: 0.5,
  slaHours: 24,
  maxDeptAllocation: 10,
  overrideEnabled: false,
};

export function getPolicy() {
  const stored = localStorage.getItem(KEY);

  if (!stored) return DEFAULT_POLICY;

  try {
    return JSON.parse(stored);
  } catch {
    return DEFAULT_POLICY;
  }
}

export function updatePolicy(newValues) {
  const updated = { ...getPolicy(), ...newValues };

  localStorage.setItem(KEY, JSON.stringify(updated));

  return updated;
}